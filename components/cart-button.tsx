"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store";

export function CartButton() {
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const getItemCount = useCartStore((state) => state.getItemCount);
  const setCartOpen = useCartStore((state) => state.setCartOpen);

  const itemCount = getItemCount();
  const total = getTotal();

  if (items.length === 0) return null;

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <button
      onClick={() => setCartOpen(true)}
      className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto bg-primary text-primary-foreground py-4 px-6 rounded-lg shadow-lg flex items-center justify-between z-50"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <ShoppingBag className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
            {itemCount}
          </span>
        </div>
        <span className="font-semibold">Ver Sacola</span>
      </div>
      <span className="font-bold">{formatPrice(total)}</span>
    </button>
  );
}
