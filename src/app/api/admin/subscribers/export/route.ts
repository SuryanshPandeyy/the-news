import { auth } from "@/auth";
import { connectDB } from "@/lib/db/connect";
import { Subscriber } from "@/lib/models/Subscriber";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  await connectDB();
  const rows = await Subscriber.find().sort({ subscribedAt: -1 }).lean();
  const lines = ["email,isActive,subscribedAt"];
  for (const row of rows) {
    lines.push(
      `${row.email},${row.isActive},${row.subscribedAt?.toISOString() ?? ""}`,
    );
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="subscribers.csv"',
    },
  });
}
