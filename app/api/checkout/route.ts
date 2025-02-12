import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-01-27.acacia",
});

export async function POST(req: Request) {
    try {
        const { items, customerData } = await req.json();

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: items.map((item: any) => ({
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: item.name,
                        // Only include images if they are HTTPS URLs
                        ...(item.image?.startsWith('https://') && {
                            images: [item.image]
                        })
                    },
                    unit_amount: Math.round(item.price * 100), // Convert to cents
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/carrito`,
            customer_email: customerData.email,
            shipping_address_collection: {
                allowed_countries: ["ES"],
            },
            metadata: {
                customerName: customerData.name,
                customerPhone: customerData.phone,
            },
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json(
            { error: "Error processant la comanda" },
            { status: 500 }
        );
    }
}