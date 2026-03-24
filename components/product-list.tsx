"use client";

import { products, categories } from "@/lib/products";
import { ProductCard } from "./product-card";

export function ProductList() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      {/* Promo Banners */}
      <div className="space-y-3 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <span className="font-bold text-green-800">Entrega Gratis</span>
          <span className="text-green-700"> para sua cidade!</span>
        </div>
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-3 text-center text-red-700">
          Aproveite nossa{" "}
          <span className="font-bold">promocao compre qualquer combo e ganhe</span>{" "}
          um Temaki
        </div>
      </div>

      {/* Product Categories */}
      {categories.map((category) => {
        const categoryProducts = products.filter(
          (p) => p.category === category.id
        );
        
        if (categoryProducts.length === 0) return null;

        return (
          <section key={category.id} id={category.id} className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4">
              {category.name}
              {category.id === "destaques" && (
                <span className="text-accent ml-2">- Quase Esgotado!</span>
              )}
            </h2>
            <div className="grid gap-3">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
