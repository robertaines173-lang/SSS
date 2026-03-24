"use client";

import Image from "next/image";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setCartOpen);

  const handleAddToCart = () => {
    addItem(product, 1);
    setCartOpen(true);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="flex gap-3 p-3 bg-card rounded-lg border border-border hover:border-primary transition-colors text-left w-full"
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-2">
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through mr-2">
              de {formatPrice(product.originalPrice)}
            </span>
          )}
          <span className="text-sm text-muted-foreground">por </span>
          <span className="font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
      <div className="relative w-24 h-24 flex-shrink-0">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover rounded-lg"
        />
        {product.originalPrice && (
          <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded-full">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
      </div>
    </button>
  );
}
