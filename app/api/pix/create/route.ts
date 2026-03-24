import { NextResponse } from "next/server";
import QRCode from "qrcode";

interface CreatePixRequest {
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerDocument: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export async function POST(request: Request) {
  try {
    const body: CreatePixRequest = await request.json();
    const { amount, customerName, customerEmail, customerPhone, customerDocument, items } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Valor invalido" },
        { status: 400 }
      );
    }

    // Get API credentials from environment
    const apiKey = process.env.UMBRELLA_API_KEY;
    const apiUrl = "https://api-gateway.umbrellapag.com/api";

    if (!apiKey) {
      console.error("UMBRELLA_API_KEY not configured");
      return NextResponse.json(
        { success: false, error: "API Pix nao configurada" },
        { status: 500 }
      );
    }

    // Format items for Umbrella API
    const formattedItems = items.map((item) => ({
      title: item.name,
      unitPrice: Math.round(item.price * 100), // Convert to cents
      quantity: item.quantity,
      tangible: true,
      externalRef: `item-${Date.now()}`,
    }));

    // Create Pix payment via Umbrella API
    const response = await fetch(`${apiUrl}/user/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "User-Agent": "UMBRELLAB2B/1.0",
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "BRL",
        paymentMethod: "PIX",
        customer: {
          id: crypto.randomUUID(),
          name: customerName,
          email: customerEmail || "cliente@email.com",
          document: {
            number: customerDocument || "000.000.000-00",
            type: "CPF",
          },
          phone: customerPhone,
          externalRef: `customer-${Date.now()}`,
          address: {
            street: "Endereco",
            streetNumber: "0",
            complement: "",
            zipCode: "00000-000",
            neighborhood: "Centro",
            city: "Cidade",
            state: "SP",
            country: "BR",
          },
        },
        items: formattedItems,
        pix: {
          expiresInDays: 1,
        },
        metadata: JSON.stringify({ source: "sushi-delivery" }),
        traceable: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Umbrella API error:", errorData);
      return NextResponse.json(
        { success: false, error: "Erro ao criar pagamento Pix" },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Generate QR Code from the PIX code
    let qrCodeBase64 = "";
    if (data.pixCode || data.copyPasteCode || data.qrCode) {
      const pixCode = data.pixCode || data.copyPasteCode || data.qrCode;
      try {
        qrCodeBase64 = await QRCode.toDataURL(pixCode, {
          width: 200,
          margin: 2,
        });
      } catch (qrError) {
        console.error("Error generating QR code:", qrError);
      }
    }

    return NextResponse.json({
      success: true,
      payment: {
        transactionId: data.transactionId || data.id || crypto.randomUUID(),
        qrCode: data.qrCode || data.pixCode || "",
        qrCodeBase64: qrCodeBase64 || data.qrCodeBase64 || "",
        copyPasteCode: data.copyPasteCode || data.pixCode || data.qrCode || "",
        amount: amount,
        expiresAt: data.expiresAt || new Date(Date.now() + 3600000).toISOString(),
        status: "pending",
      },
    });
  } catch (error) {
    console.error("Error creating Pix payment:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
