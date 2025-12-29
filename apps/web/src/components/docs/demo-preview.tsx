import { cn } from "@/lib/cn";

interface DemoPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DemoPreview({
  children,
  className,
  ...props
}: DemoPreviewProps) {
  return (
    <div className={cn("not-prose my-6 w-full", className)} {...props}>
      <div className="flex min-h-[280px] w-full items-center justify-center rounded-xl border bg-background p-6">
        {children}
      </div>
    </div>
  );
}

