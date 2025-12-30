import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { TypeTable } from "fumadocs-ui/components/type-table";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import {
  StreamFieldDemo,
  StreamListDemo,
  StreamRootDemo,
  StreamWhenDemo,
} from "@/components/demos";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DemoPreview } from "@/components/docs/demo-preview";
import {
  StreamingChart,
  StreamingChartDemo,
  StreamingText,
  StreamingTextDemo,
} from "@/registry/stream";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Tabs,
    Tab,
    Steps,
    Step,
    TypeTable,
    ComponentPreview,
    DemoPreview,
    StreamFieldDemo,
    StreamListDemo,
    StreamWhenDemo,
    StreamRootDemo,
    StreamingText,
    StreamingTextDemo,
    StreamingChart,
    StreamingChartDemo,
    ...components,
  };
}
