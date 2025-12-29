import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { TypeTable } from "fumadocs-ui/components/type-table";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DemoPreview } from "@/components/docs/demo-preview";
import {
  StreamFieldDemo,
  StreamListDemo,
  StreamWhenDemo,
  StreamRootDemo,
} from "@/components/demos";
import { WeatherCard, WeatherCardDemo } from "@/registry/stream";

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
    WeatherCard,
    WeatherCardDemo,
    ...components,
  };
}
