"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, CustomerData, PixPayment } from "./types";

interface CartStore {
  items: CartItem[];
  customerData: CustomerData | null;
  pixPayment: PixPayment | null;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  
  addItem: (product: Product, quantity?: number, observation?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  setCustomerData: (data: CustomerData) => void;
  setPixPayment: (payment: PixPayment | null) => void;
  
  setCartOpen: (open: boolean) => void;
  setCheckoutOpen: (open: boolean) => void;
  
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      customerData: null,
      pixPayment: null,
      isCartOpen: false,
      isCheckoutOpen: false,
      
      addItem: (product, quantity = 1, observation) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          
          return {
            items: [...state.items, { product, quantity, observation }],
          };
        });
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [], pixPayment: null });
      },
      
      setCustomerData: (data) => {
        set({ customerData: data });
      },
      
      setPixPayment: (payment) => {
        set({ pixPayment: payment });
      },
      
      setCartOpen: (open) => {
        set({ isCartOpen: open });
      },
      
      setCheckoutOpen: (open) => {
        set({ isCheckoutOpen: open });
      },
      
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
