"use client";

import Image from "next/image";
import { Instagram, Info, Star, MapPin, Clock, Bike } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isOpen] = useState(true);

  return (
    <header className="bg-background">
      {/* Cover Image */}
      <div className="relative h-48 bg-primary">
        <Image
          src="/images/background.webp"
          alt="Sushi Delivery Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <div className="w-24 h-24 rounded-full bg-primary p-1 shadow-lg">
            <Image
              src="/images/logo.webp"
              alt="Sushi Delivery"
              width={96}
              height={96}
              className="rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="pt-14 pb-4 px-4 max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">
            Delivery - Culinaria Japonesa
          </h1>

          <div className="flex items-center justify-center gap-3 mt-3">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <button className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
              <Info className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Info */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="font-medium">Pedido Minimo</span>
              <span className="font-bold text-foreground">R$ 13,00</span>
            </span>
            <span className="flex items-center gap-1">
              <Bike className="w-4 h-4" />
              <span className="font-bold text-foreground">25-40 min</span>
            </span>
            <span className="text-success font-semibold">Gratis</span>
          </div>

          {/* Location */}
          <div className="flex items-center justify-center gap-1 mt-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Sua Cidade - UF</span>
            <span>- 1,9km de voce</span>
          </div>

          {/* Rating */}
          <div className="flex flex-col items-center gap-2 mt-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-bold">4,8</span>
              <span className="text-muted-foreground">(1.589 avaliacoes)</span>
              <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                <Star className="w-3 h-3 fill-red-600" />
                Super
              </span>
            </div>
            <div className="flex gap-2">
              <span className="border border-primary text-foreground px-3 py-1 rounded-full text-xs">
                Otimo atendimento
              </span>
              <span className="border border-primary text-foreground px-3 py-1 rounded-full text-xs">
                Melhores precos
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span
              className={`w-2 h-2 rounded-full ${
                isOpen ? "bg-success btn-pulse" : "bg-destructive"
              }`}
            />
            <span className="font-semibold">
              {isOpen ? "ABERTO" : "FECHADO"}
            </span>
            {isOpen && (
              <>
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">ate 02:00</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
