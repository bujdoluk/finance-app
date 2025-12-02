// For more information visit https://jsonapi.org/
import { Link } from "./links";
import { Meta } from "./meta";
import { ResourceIdentifier } from "./resource-identifier";

export interface Relationship {
  data?: null | ResourceIdentifier | ResourceIdentifier[];
  links?: RelationshipsLinks;
  meta?: Meta;
}

export type Relationships = Record<string, Relationship>;

export interface RelationshipsLinks {
  [key: string]: Link | undefined;
  related?: Link;
  self?: Link;
}
