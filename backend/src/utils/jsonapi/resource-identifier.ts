import { Meta } from "./meta";

export interface ResourceIdentifier {
  id?: string;
  lid?: string;
  meta?: Meta;
  type: string;
}
