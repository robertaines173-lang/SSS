"use client";

import { useState } from "react";
import { X, Truck, Store, Copy, CheckCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/lib/store";
import type { CustomerData } from "@/lib/types";

export function Checkout() {
  const items = useCartStore((state) => state.items);
  const isCheckoutOpen = useCartStore((state) => state.isCheckoutOpen);
  const setCheckoutOpen = useCartStore((state) => state.setCheckoutOpen);
  const setCustomerData = useCartStore((state) => state.setCustomerData);
  const pixPayment = useCartStore((state) => state.pixPayment);
  const setPixPayment = useCartStore((state) => state.setPixPayment);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
  });

  const total = getTotal();

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const customerData: CustomerData = {
      ...formData,
      deliveryType,
    };

    setCustomerData(customerData);

    try {
      const response = await fetch("/api/pix/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          customerName: formData.name,
          customerPhone: formData.phone,
          items: items.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPixPayment(data.payment);
      } else {
        alert("Erro ao gerar pagamento Pix. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao criar pagamento:", error);
      alert("Erro ao gerar pagamento Pix. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPix = async () => {
    if (pixPayment?.copyPasteCode) {
      await navigator.clipboard.writeText(pixPayment.copyPasteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleConfirmPayment = () => {
    clearCart();
    setCheckoutOpen(false);
    setPixPayment(null);
    alert("Pedido confirmado! Em breve voce recebera atualizacoes.");
  };

  if (!isCheckoutOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => {
          if (!pixPayment) {
            setCheckoutOpen(false);
          }
        }}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-background z-50 rounded-xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold">
            {pixPayment ? "Pagamento Pix" : "Finalizar Pedido"}
          </h2>
          {!pixPayment && (
            <button
              onClick={() => setCheckoutOpen(false)}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {pixPayment ? (
            /* PIX Payment View */
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">
                  Escaneie o QR Code ou copie o codigo Pix
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {formatPrice(pixPayment.amount)}
                </p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  {pixPayment.qrCodeBase64 ? (
                    <Image
                      src={pixPayment.qrCodeBase64}
                      alt="QR Code Pix"
                      width={200}
                      height={200}
                    />
                  ) : (
                    <div className="w-48 h-48 bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">QR Code</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Copy Pix */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Pix Copia e Cola</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pixPayment.copyPasteCode}
                    readOnly
                    className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm truncate"
                  />
                  <button
                    onClick={handleCopyPix}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 font-medium hover:opacity-90 transition-opacity"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Apos o pagamento, clique em confirmar para finalizar o pedido
              </p>

              <button
                onClick={handleConfirmPayment}
                className="w-full bg-success text-success-foreground py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Confirmar Pagamento
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Delivery Type */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Tipo de Entrega</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("delivery")}
                    className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                      deliveryType === "delivery"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    <Truck className="w-5 h-5" />
                    Entrega
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType("pickup")}
                    className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                      deliveryType === "pickup"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    <Store className="w-5 h-5" />
                    Retirada
                  </button>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome Completo</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full mt-1 px-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Telefone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full mt-1 px-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              {/* Address (only for delivery) */}
              {deliveryType === "delivery" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Endereco</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full mt-1 px-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Rua, Avenida..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Numero</label>
                      <input
                        type="text"
                        name="number"
                        value={formData.number}
                        onChange={handleInputChange}
                        required
                        className="w-full mt-1 px-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="123"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Complemento</label>
                      <input
                        type="text"
                        name="complement"
                        value={formData.complement}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Apto, Bloco..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">Bairro</label>
                      <input
                        type="text"
                        name="neighborhood"
                        value={formData.neighborhood}
                        onChange={handleInputChange}
                        required
                        className="w-full mt-1 px-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Bairro"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Cidade</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full mt-1 px-3 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Cidade"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <h3 className="font-semibold">Resumo do Pedido</h3>
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-border pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gerando Pix...
                  </>
                ) : (
                  "Pagar com Pix"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
