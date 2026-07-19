"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  deleteNotificationAction,
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/actions/notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { formatRelativeTime } from "@/lib/utils";
import type { NotificationWithActor } from "@/types";

type NotificationsListProps = {
  initialNotifications: NotificationWithActor[];
};

export function NotificationsList({ initialNotifications }: NotificationsListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const markAllRead = () => {
    startTransition(async () => {
      const result = await markAllNotificationsReadAction();
      if (!result.success) {
        toast.error(result.error ?? "Failed to mark all as read");
        return;
      }
      toast.success("All notifications marked as read");
      router.refresh();
    });
  };

  const markRead = (id: string) => {
    startTransition(async () => {
      await markNotificationReadAction(id);
      router.refresh();
    });
  };

  const remove = (id: string) => {
    startTransition(async () => {
      const result = await deleteNotificationAction(id);
      if (!result.success) {
        toast.error(result.error ?? "Failed to delete");
        return;
      }
      router.refresh();
    });
  };

  if (initialNotifications.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="All caught up"
        description="You have no notifications right now."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={markAllRead} disabled={isPending}>
          <CheckCheck className="mr-2 size-4" />
          Mark all read
        </Button>
      </div>

      <div className="space-y-2">
        {initialNotifications.map((notification) => (
          <Card
            key={notification.id}
            className={notification.read ? "opacity-70" : "border-primary/20"}
          >
            <CardContent className="flex items-start justify-between gap-4 p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{notification.title}</p>
                  {!notification.read && <Badge variant="secondary">New</Badge>}
                </div>
                {notification.message && (
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formatRelativeTime(notification.createdAt)}
                </p>
                {notification.link && (
                  <Link
                    href={notification.link}
                    className="text-sm text-primary hover:underline"
                    onClick={() => !notification.read && markRead(notification.id)}
                  >
                    View →
                  </Link>
                )}
              </div>
              <div className="flex gap-1">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => markRead(notification.id)}
                    disabled={isPending}
                  >
                    <CheckCheck className="size-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive"
                  onClick={() => remove(notification.id)}
                  disabled={isPending}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
