'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Service } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';

export interface CartItem extends Service {
  price: number; // The calculated price based on vehicle type
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (service: Service, price: number) => void;
  removeFromCart: (serviceId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = useCallback((service: Service, price: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === service.id);
      if (existingItem) {
        toast({
          title: 'Already in Cart',
          description: `${service.title} is already in your cart.`,
        });
        return prevItems;
      }
      toast({
        title: 'Added to Cart',
        description: `${service.title} has been added to your cart.`,
      });
      return [...prevItems, { ...service, price }];
    });
  }, [toast]);

  const removeFromCart = useCallback((serviceId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== serviceId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        itemCount: cartItems.length
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
