import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get("transactionId");

    if (!transactionId) {
      return NextResponse.json(
        { success: false, error: "Transaction ID obrigatorio" },
        { status: 400 }
      );
    }

    const apiKey = process.env.UMBRELLA_API_KEY;
    const apiUrl = process.env.UMBRELLA_API_URL || "https://api.umbrellapag.com";

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "API Pix nao configurada" },
        { status: 500 }
      );
    }

    // Check transaction status via Umbrella API
    const response = await fetch(
      `${apiUrl}/api/user/transactions/${transactionId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Umbrella API error:", errorData);
      return NextResponse.json(
        { success: false, error: "Erro ao consultar status" },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      status: data.status || "pending",
      paidAt: data.paidAt || null,
    });
  } catch (error) {
    console.error("Error checking Pix status:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
