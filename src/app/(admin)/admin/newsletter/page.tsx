import { listNewsletterSubscribersAction } from "@/actions/admin";
import { DataTable } from "@/features/admin/data-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminStatsCard } from "@/features/admin/admin-stats-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Mail } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminNewsletterPage() {
  const result = await listNewsletterSubscribersAction(1);
  const subscribers = result.success ? result.data!.data : [];
  const total = result.success ? result.data!.total : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Newsletter</h1>
        <p className="text-sm text-muted-foreground">Manage email subscribers.</p>
      </div>

      <AdminStatsCard title="Active subscribers" value={total} icon={Mail} />

      {subscribers.length === 0 ? (
        <EmptyState icon={Mail} title="No subscribers" description="Subscribers will appear here." />
      ) : (
        <DataTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Subscribed</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>{sub.email}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(sub.subscribedAt)}
                  </TableCell>
                  <TableCell>{sub.confirmed ? "Confirmed" : "Pending"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTable>
      )}
    </div>
  );
}
