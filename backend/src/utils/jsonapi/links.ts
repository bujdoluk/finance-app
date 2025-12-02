import { Meta } from "./meta";

export type Link = LinkObject | null | string;

export interface LinkObject {
  describedby?: string;
  href: string;
  hreflang?: string | string[];
  meta?: Meta;
  rel?: string;
  title?: string;
  type?: string;
}

export type Links = Record<string, Link>;
