import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@contexts/ThemeContext';
import { useCart } from '@contexts/CartContext';
import { formatCurrency } from '@shared/utils';

const CartScreen = () => {
  const { theme } = useTheme();
  const { items, totalItems, totalAmount } = useCart();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
    },
    title: {
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
    },
    emptyText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.xl,
    },
    summary: {
      marginTop: theme.spacing.lg,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
    },
    summaryText: {
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    totalText: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.primary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>
      
      {items.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty</Text>
      ) : (
        <>
          <View style={styles.summary}>
            <Text style={styles.summaryText}>Items: {totalItems}</Text>
            <Text style={styles.totalText}>Total: {formatCurrency(totalAmount)}</Text>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;
