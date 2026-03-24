import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Log webhook for debugging
    console.log("Pix Webhook received:", JSON.stringify(body, null, 2));

    // Validate webhook (you may want to add signature verification)
    const { transactionId, status, paidAt } = body;

    if (!transactionId) {
      return NextResponse.json(
        { success: false, error: "Transaction ID obrigatorio" },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Verify the webhook signature
    // 2. Update the order status in your database
    // 3. Send notification to the customer
    // 4. Notify the restaurant/kitchen

    console.log(`Transaction ${transactionId} status updated to: ${status}`);

    if (status === "paid" && paidAt) {
      console.log(`Payment confirmed at: ${paidAt}`);
      // TODO: Update order status to "paid"
      // TODO: Send confirmation to customer via WhatsApp/SMS
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}
