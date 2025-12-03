import { Links } from "./links";
import { Meta } from "./meta";

export interface Error {
  code?: string;
  detail?: string;
  id?: string;
  links?: Links & {
    about?: string;
    type?: string;
  };
  meta?: Meta;
  source?: ErrorSource;
  status?: string;
  title?: string;
}

export interface ErrorDocument {
  errors: Error[];
  links?: Links;
  meta?: Meta;
}

export interface ErrorSource {
  header?: string;
  parameter?: string;
  pointer?: string;
}

export function createError(
  status: number,
  title: string,
  detail: string,
  source?: ErrorSource
): Error {
  return {
    detail,
    source,
    status: String(status),
    title,
  };
}

export function createErrorDocument(errors: Error[]): ErrorDocument {
  return { errors };
}

/**
 *  Helper function that converts Joi schema validation errors into a JSON:API ErrorDocument
 */
export function joiToErrors(
  details: { message: string; path: (number | string)[] }[],
  status: number
): ErrorDocument {
  const errors: Error[] = details.map((d) =>
    createError(
      status,
      "Invalid Attribute",
      d.message,
      {
        pointer:
          d.path.length > 0
            ? `/data/attributes/${d.path.join("/")}`
            : "/data/attributes",
      }
    )
  );

  return createErrorDocument(errors);
}
