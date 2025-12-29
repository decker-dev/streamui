"use client";

import { Stream } from "@stream.ui/react";
import { Play, RotateCcw } from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Item {
  id: number;
  name: string;
  status: "active" | "pending" | "done";
}

interface PartialData {
  items?: Partial<Item>[];
}

const ITEMS: Item[] = [
  { id: 1, name: "Authentication", status: "done" },
  { id: 2, name: "Database setup", status: "done" },
  { id: 3, name: "API routes", status: "active" },
  { id: 4, name: "UI components", status: "pending" },
  { id: 5, name: "Testing", status: "pending" },
];

function ItemCard({ item }: { item: Item }) {
  const statusVariant = {
    done: "default" as const,
    active: "secondary" as const,
    pending: "outline" as const,
  };

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <CardContent className="flex items-center gap-3 p-3">
        <span className="font-medium">{item.name}</span>
        <Badge variant={statusVariant[item.status]} className="ml-auto">
          {item.status}
        </Badge>
      </CardContent>
    </Card>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-2">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function StreamListDemo() {
  const [data, setData] = React.useState<PartialData | undefined>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [itemCount, setItemCount] = React.useState(0);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const addItem = (index: number) => {
    if (index >= ITEMS.length) {
      setIsLoading(false);
      return;
    }

    setData((prev) => ({
      items: [...(prev?.items || []), ITEMS[index]],
    }));
    setItemCount(index + 1);

    timeoutRef.current = setTimeout(() => addItem(index + 1), 400);
  };

  const start = () => {
    cleanup();
    setData(undefined);
    setIsLoading(true);
    setItemCount(0);
    timeoutRef.current = setTimeout(() => addItem(0), 300);
  };

  const reset = () => {
    cleanup();
    setData(undefined);
    setIsLoading(false);
    setItemCount(0);
  };

  React.useEffect(() => cleanup, []);

  const isComplete = !isLoading && data !== undefined;
  const isIdle = !isLoading && data === undefined;

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={start} disabled={isLoading}>
            <Play className="h-3.5 w-3.5" />
            {isIdle ? "Start" : "Restart"}
          </Button>
          {!isIdle && (
            <Button size="icon" variant="ghost" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {itemCount}/{ITEMS.length} items
        </span>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="mb-3 text-xs font-medium text-muted-foreground">
            path="items"
          </div>
          <Stream.Root data={data} isLoading={isLoading}>
            <Stream.List path="items" fallback={<ListSkeleton />}>
              {(items: Item[]) => (
                <div className="space-y-2">
                  {items.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </Stream.List>
          </Stream.Root>
        </CardContent>
      </Card>

      {isComplete && (
        <p className="text-center text-sm text-green-600 dark:text-green-400">
          ✓ All {ITEMS.length} items loaded
        </p>
      )}
    </div>
  );
}
