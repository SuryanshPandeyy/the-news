import Link from "next/link";
import { connectDB } from "@/lib/db/connect";
import { Subscriber } from "@/lib/models/Subscriber";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateIST } from "@/lib/timezone";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  await connectDB();
  const subscribers = await Subscriber.find().sort({ subscribedAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Subscribers ({subscribers.length})</h1>
        <Link
          href="/api/admin/subscribers/export"
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          Export CSV
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Subscribed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscribers.map((s) => (
            <TableRow key={String(s._id)}>
              <TableCell>{s.email}</TableCell>
              <TableCell>{s.isActive ? "Active" : "Inactive"}</TableCell>
              <TableCell>
                {s.subscribedAt
                  ? formatDateIST(s.subscribedAt, { dateStyle: "medium" })
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
