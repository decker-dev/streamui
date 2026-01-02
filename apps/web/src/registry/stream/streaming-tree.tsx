"use client";

import type { DeepPartial } from "@stream.ui/react";
import { Stream } from "@stream.ui/react";
import {
  ChevronRight,
  File,
  FileCode,
  FileText,
  Folder,
  FolderOpen,
  Image,
  Settings,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type {
  StreamingTreeData,
  StreamingTreeNode,
} from "./streaming-tree-schema";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  folder: Folder,
  "folder-open": FolderOpen,
  file: File,
  "file-code": FileCode,
  "file-text": FileText,
  image: Image,
  user: User,
  settings: Settings,
};

function getIcon(
  iconName: string | undefined,
  isOpen: boolean,
  hasChildren: boolean,
) {
  if (iconName && iconMap[iconName]) {
    return iconMap[iconName];
  }
  if (hasChildren) {
    return isOpen ? FolderOpen : Folder;
  }
  return File;
}

interface TreeNodeProps {
  node: DeepPartial<StreamingTreeNode>;
  depth: number;
  isLast: boolean;
  parentPath: boolean[];
}

function TreeNodeSkeleton({ depth }: { depth: number }) {
  return (
    <div
      className="flex items-center gap-2 py-1.5"
      style={{ paddingLeft: depth * 20 + 8 }}
    >
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

function TreeNode({ node, depth, isLast, parentPath }: TreeNodeProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  const hasChildren = Boolean(node.children && node.children.length > 0);
  const validChildren = React.useMemo(() => {
    if (!node.children) return [];
    return node.children.filter(
      (child): child is DeepPartial<StreamingTreeNode> =>
        child !== null &&
        child !== undefined &&
        typeof child.label === "string",
    );
  }, [node.children]);

  const Icon = getIcon(node.icon, isOpen, hasChildren);
  const isComplete = node.id !== undefined && node.label !== undefined;

  if (!isComplete) {
    return <TreeNodeSkeleton depth={depth} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Node row */}
      <div
        className={cn(
          "group relative flex items-center gap-1 rounded-md py-1 pr-2 transition-colors",
          hasChildren && "cursor-pointer hover:bg-muted/50",
        )}
        style={{ paddingLeft: depth * 20 + 8 }}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (hasChildren && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        {...(hasChildren && {
          role: "button",
          tabIndex: 0,
          "aria-expanded": isOpen,
        })}
      >
        {/* Tree lines */}
        {depth > 0 && (
          <div
            className="absolute left-0 top-0 h-full"
            style={{ width: depth * 20 }}
          >
            {parentPath.map((showLine, i) => (
              <div
                key={i}
                className={cn(
                  "absolute top-0 h-full w-px",
                  showLine && "bg-border",
                )}
                style={{ left: i * 20 + 16 }}
              />
            ))}
            {/* Horizontal connector */}
            <div
              className="absolute top-1/2 h-px bg-border"
              style={{
                left: (depth - 1) * 20 + 16,
                width: 12,
              }}
            />
            {/* Vertical connector (partial for last item) */}
            <div
              className={cn(
                "absolute w-px bg-border",
                isLast ? "h-1/2" : "h-full",
              )}
              style={{ left: (depth - 1) * 20 + 16 }}
            />
          </div>
        )}

        {/* Expand/collapse chevron */}
        {hasChildren ? (
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.15 }}
            className="flex h-4 w-4 shrink-0 items-center justify-center"
          >
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          </motion.div>
        ) : (
          <div className="h-4 w-4 shrink-0" />
        )}

        {/* Icon */}
        <Icon
          className={cn(
            "h-4 w-4 shrink-0",
            hasChildren
              ? "text-amber-500 dark:text-amber-400"
              : "text-muted-foreground",
          )}
        />

        {/* Label */}
        <span className="truncate text-sm">{node.label}</span>

        {/* Description */}
        {node.description && (
          <span className="ml-2 truncate text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
            {node.description}
          </span>
        )}
      </div>

      {/* Children */}
      <AnimatePresence initial={false}>
        {isOpen && validChildren.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            {validChildren.map((child, index) => (
              <TreeNode
                key={child.id ?? index}
                node={child}
                depth={depth + 1}
                isLast={index === validChildren.length - 1}
                parentPath={[...parentPath, !isLast]}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface StreamingTreeProps {
  data: DeepPartial<StreamingTreeData> | undefined;
  isLoading: boolean;
  error?: Error;
  className?: string;
}

export function StreamingTree({
  data,
  isLoading,
  error,
  className,
}: StreamingTreeProps) {
  const isStreaming = isLoading && data !== undefined;
  const isComplete = !isLoading && data !== undefined;
  const currentState = isComplete
    ? "complete"
    : isStreaming
      ? "streaming"
      : isLoading
        ? "loading"
        : "idle";

  const borderColors = {
    idle: "",
    loading: "border-yellow-500/50",
    streaming: "border-blue-500/50",
    complete: "border-green-500/50",
  };

  const validNodes = React.useMemo(() => {
    if (!data?.nodes) return [];
    return data.nodes.filter(
      (node): node is DeepPartial<StreamingTreeNode> =>
        node !== null && node !== undefined && typeof node.label === "string",
    );
  }, [data?.nodes]);

  const hasNodes = validNodes.length > 0 || isLoading;

  return (
    <Stream.Root data={data} isLoading={isLoading} error={error}>
      <Card
        className={cn(
          "w-full max-w-md transition-colors",
          borderColors[currentState],
          className,
        )}
      >
        {data?.title && (
          <CardHeader className="pb-2">
            <CardTitle>
              <Stream.Field fallback={<Skeleton className="h-6 w-32" />}>
                {data.title}
              </Stream.Field>
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className={cn(!data?.title && "pt-4")}>
          {hasNodes ? (
            <div className="min-h-[120px]">
              {validNodes.map((node, index) => (
                <TreeNode
                  key={node.id ?? index}
                  node={node}
                  depth={0}
                  isLast={index === validNodes.length - 1}
                  parentPath={[]}
                />
              ))}
              {/* Show skeleton for incoming node */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1"
                >
                  <TreeNodeSkeleton depth={0} />
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex h-[120px] items-center justify-center text-sm text-muted-foreground">
              Click a button to generate a tree
            </div>
          )}
        </CardContent>
      </Card>
    </Stream.Root>
  );
}
