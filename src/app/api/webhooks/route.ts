import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Webhook secret for signature verification
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

function verifySignature(
    payload: string,
    signature: string,
    secret: string
): boolean {
    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex");
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();

        // Verify signature if secret is configured
        if (WEBHOOK_SECRET) {
            const signature = request.headers.get("x-webhook-signature");
            if (!signature || !verifySignature(body, signature, WEBHOOK_SECRET)) {
                return NextResponse.json(
                    { error: "Invalid signature" },
                    { status: 401 }
                );
            }
        }

        const data = JSON.parse(body);
        const eventType = request.headers.get("x-webhook-event") ?? data.event;

        // Route webhook events
        switch (eventType) {
            case "contact.created":
                // Handle new contact webhook
                console.log("Webhook: contact.created", data);
                break;
            case "payment.completed":
                // Handle payment webhook
                console.log("Webhook: payment.completed", data);
                break;
            case "form.submitted":
                // Handle form submission webhook
                console.log("Webhook: form.submitted", data);
                break;
            default:
                console.log(`Webhook: unhandled event type "${eventType}"`, data);
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}
