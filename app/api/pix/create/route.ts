import { NextResponse } from "next/server";
import QRCode from "qrcode";

interface CreatePixRequest {
  amount: number;
  customerName: string;
  customerPhone: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export async function POST(request: Request) {
  try {
    const body: CreatePixRequest = await request.json();
    const { amount, customerName, customerPhone, items } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Valor invalido" },
        { status: 400 }
      );
    }

    // Get API credentials from environment
    const apiKey = process.env.UMBRELLA_API_KEY;
    const apiUrl = process.env.UMBRELLA_API_URL || "https://api.umbrellapag.com";

    if (!apiKey) {
      console.error("UMBRELLA_API_KEY not configured");
      return NextResponse.json(
        { success: false, error: "API Pix nao configurada" },
        { status: 500 }
      );
    }

    // Create transaction description
    const description = items
      .map((item) => `${item.quantity}x ${item.name}`)
      .join(", ");

    // Create Pix payment via Umbrella API
    const response = await fetch(`${apiUrl}/api/user/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        amount: amount,
        description: `Pedido Sushi Delivery: ${description}`,
        customer: {
          name: customerName,
          phone: customerPhone,
        },
        expiresIn: 3600, // 1 hour
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
