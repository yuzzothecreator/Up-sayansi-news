import { listReportsAction } from "@/actions/admin";
import { DataTable } from "@/features/admin/data-table";
import { ReportRowActions } from "@/features/admin/report-row-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Flag } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export default async function AdminReportsPage() {
  const result = await listReportsAction(1);
  const reports = result.success ? result.data!.data : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground">Review flagged content and users.</p>
      </div>

      {reports.length === 0 ? (
        <EmptyState icon={Flag} title="No reports" description="All clear — no reports to review." />
      ) : (
        <DataTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reason</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Badge variant="outline">{report.reason.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell>{report.reporter.name}</TableCell>
                  <TableCell className="text-sm">
                    {report.post?.title ?? report.comment?.content?.slice(0, 40) ?? report.targetUser?.name ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        report.status === "PENDING"
                          ? "destructive"
                          : report.status === "RESOLVED"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatRelativeTime(report.createdAt)}
                  </TableCell>
                  <TableCell>
                    {report.status === "PENDING" && (
                      <ReportRowActions reportId={report.id} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTable>
      )}
    </div>
  );
}
