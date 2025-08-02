import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { useAuth } from './AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@shared/config/firebase';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface NotificationContextType {
  expoPushToken: string | null;
  registerForPushNotifications: () => Promise<string | null>;
  sendLocalNotification: (title: string, body: string, data?: any) => Promise<void>;
  schedulePushNotification: (
    title: string,
    body: string,
    trigger: Notifications.NotificationTriggerInput,
    data?: any
  ) => Promise<string>;
  cancelScheduledNotification: (identifier: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [expoPushToken, setExpoPushToken] = React.useState<string | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // Register for push notifications when user is authenticated
    if (user) {
      registerForPushNotifications().then(token => {
        if (token) {
          setExpoPushToken(token);
          // Update user's FCM token in Firestore
          updateUserFCMToken(token);
        }
      });
    }

    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Listen for notification responses (user tapped notification)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      handleNotificationResponse(response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [user]);

  const registerForPushNotifications = async (): Promise<string | null> => {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }

    try {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo push token:', token);

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return token;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  };

  const updateUserFCMToken = async (token: string) => {
    if (!user) return;

    try {
      await updateDoc(doc(db, 'users', user.id), {
        fcmToken: token,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating FCM token:', error);
    }
  };

  const sendLocalNotification = async (title: string, body: string, data?: any) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  };

  const schedulePushNotification = async (
    title: string,
    body: string,
    trigger: Notifications.NotificationTriggerInput,
    data?: any
  ): Promise<string> => {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
        },
        trigger,
      });
      return identifier;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  };

  const cancelScheduledNotification = async (identifier: string) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error('Error canceling scheduled notification:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await Notifications.dismissAllNotificationsAsync();
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data;
    
    // Handle different notification types
    switch (data?.type) {
      case 'order_update':
        // Navigate to order details
        // NavigationService.navigate('OrderDetails', { orderId: data.orderId });
        break;
      case 'message':
        // Navigate to chat
        // NavigationService.navigate('Chat', { conversationId: data.conversationId });
        break;
      case 'promotion':
        // Navigate to promotion details
        // NavigationService.navigate('Promotion', { promotionId: data.promotionId });
        break;
      default:
        // Handle default navigation
        break;
    }
  };

  const contextValue: NotificationContextType = {
    expoPushToken,
    registerForPushNotifications,
    sendLocalNotification,
    schedulePushNotification,
    cancelScheduledNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
