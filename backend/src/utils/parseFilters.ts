export type Filters =
  | { field: string; type: "contains"; value: string }
  | { field: string; type: "equals"; value: string }
  | { field: string; type: "greaterThan"; value: string }
  | { field: string; type: "lessThan"; value: string };

// matches: equals(category,'Food')
const filterRegex = /^(\w+)\((\w+),'(.+)'\)$/;

export interface FilterParams {
  filter?: string;
  sort?: string;
}

export function parseFilter(filterString: string): Filters {
  const match = filterRegex.exec(filterString);
  if (!match) {
    throw new Error(`Invalid filter format: ${filterString}`);
  }

  const [, operator, field, value] = match;

  if (!["contains", "equals", "greaterThan", "lessThan"].includes(operator)) {
    throw new Error(`Unsupported filter operator: ${operator}`);
  }

  return { field, type: operator as Filters["type"], value };
}

