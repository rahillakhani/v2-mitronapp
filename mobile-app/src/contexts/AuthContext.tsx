import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@shared/config/firebase';
import { User, UserRole, VendorProfile, BuyerProfile } from '@shared/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = { id: userDoc.id, ...userDoc.data() } as User;
            setUser(userData);
            await AsyncStorage.setItem('user', JSON.stringify(userData));
          } else {
            // User document doesn't exist, sign out
            await signOut();
            setUser(null);
            await AsyncStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
        await AsyncStorage.removeItem('user');
      }
      
      setLoading(false);
    });

    // Load cached user data while auth state is being determined
    loadCachedUser();

    return unsubscribe;
  }, []);

  const loadCachedUser = async () => {
    try {
      const cachedUser = await AsyncStorage.getItem('user');
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
      }
    } catch (error) {
      console.error('Error loading cached user:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(error.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setLoading(true);
      
      // Create Firebase user
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase profile
      await updateProfile(firebaseUser, {
        displayName: userData.role === 'vendor' 
          ? (userData.profile as VendorProfile)?.businessName 
          : `${(userData.profile as BuyerProfile)?.firstName} ${(userData.profile as BuyerProfile)?.lastName}`,
      });

      // Create user document in Firestore
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        role: userData.role!,
        profile: userData.profile!,
        isActive: true,
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      
    } catch (error: any) {
      throw new Error(error.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      // This would need to be implemented with proper Google Sign-In for React Native
      // For now, throwing an error to indicate it's not implemented
      throw new Error('Google Sign-In not implemented yet');
    } catch (error: any) {
      throw new Error(error.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Sign out failed');
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');

    try {
      const updatedUser = {
        ...user,
        ...updates,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(doc(db, 'users', user.id), updates);
      setUser(updatedUser as User);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  };

  const refreshUser = async () => {
    if (!firebaseUser) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = { id: userDoc.id, ...userDoc.data() } as User;
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const contextValue: AuthContextType = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut: handleSignOut,
    updateUserProfile,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
