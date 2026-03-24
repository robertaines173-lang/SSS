"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { CategoryNav } from "@/components/category-nav";
import { ProductList } from "@/components/product-list";
import { CartButton } from "@/components/cart-button";
import { CartDrawer } from "@/components/cart-drawer";
import { Checkout } from "@/components/checkout";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("destaques");

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <CategoryNav
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <ProductList />
      <CartButton />
      <CartDrawer />
      <Checkout />
    </div>
  );
}
