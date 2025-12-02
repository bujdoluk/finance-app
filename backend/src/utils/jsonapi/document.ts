import { Links } from "./links";
import { Meta } from "./meta";
import { Resource } from "./resource";

export interface Document {
  data?: null | Resource | Resource[];
  errors?: unknown[];
  included?: Resource[];
  jsonapi?: {
    meta?: Meta;
    version?: string;
  };
  links?: Links;
  meta?: Meta;
}
