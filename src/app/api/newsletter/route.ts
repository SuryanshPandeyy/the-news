import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { sendSubscriptionConfirmation } from "@/lib/mail";
import { Subscriber } from "@/lib/models/Subscriber";
import { getSettings } from "@/lib/models/Settings";
import { rateLimit } from "@/lib/rate-limit";
import { subscriberSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const limited = rateLimit(`newsletter:${ip}`, 5, 60_000);
  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const { email } = subscriberSchema.parse(body);
    await connectDB();

    const existing = await Subscriber.findOne({ email });
    if (existing?.isActive) {
      return NextResponse.json(
        { error: "You are already subscribed." },
        { status: 409 },
      );
    }

    if (existing) {
      existing.isActive = true;
      existing.subscribedAt = new Date();
      await existing.save();
    } else {
      await Subscriber.create({ email });
    }

    const settings = await getSettings();
    void sendSubscriptionConfirmation(email, settings.siteName);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }
}
