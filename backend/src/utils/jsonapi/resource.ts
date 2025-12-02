import { Links } from "./links";
import { Meta } from "./meta";
import { Relationships } from "./relationships";

export type Attributes = Record<string, unknown>;

export interface Resource {
  attributes?: Attributes;
  id?: string;
  lid?: string;
  links?: Links;
  meta?: Meta;
  relationships?: Relationships;
  type: string;
}
