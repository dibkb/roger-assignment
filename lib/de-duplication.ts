import { Person } from "./zod/api/response";

type PartialPerson = Partial<Person>;

function mergeRows(rows: PartialPerson[]): Person {
  const merged: PartialPerson = {};

  for (const row of rows) {
    for (const key of Object.keys(row) as (keyof Person)[]) {
      if (
        merged[key] === undefined ||
        merged[key] === null ||
        merged[key] === ""
      ) {
        merged[key] = row[key];
      }
    }
  }

  return merged as Person;
}

export function deduplicateRows(rows: Person[]): {
  uniqueRows: Person[];
  mapping: Map<number, number>;
} {
  const seenEmail = new Map<string, number>();
  const seenLinkedin = new Map<string, number>();
  const mapping = new Map<number, number>();
  const mergeGroups: Map<number, Person[]> = new Map();

  const uniqueRows: Person[] = [];

  rows.forEach((row, index) => {
    const email = row.email?.trim().toLowerCase();
    const linkedin = row.linkedin_url?.trim().toLowerCase();

    const emailMatch = email ? seenEmail.get(email) : undefined;
    const linkedinMatch = linkedin ? seenLinkedin.get(linkedin) : undefined;

    const existingIdx = emailMatch ?? linkedinMatch;

    if (existingIdx !== undefined) {
      mapping.set(index, existingIdx);
      mergeGroups.get(existingIdx)!.push(row);
    } else {
      const newIdx = uniqueRows.length;
      uniqueRows.push(row);
      mergeGroups.set(newIdx, [row]);
      if (email) seenEmail.set(email, newIdx);
      if (linkedin) seenLinkedin.set(linkedin, newIdx);
      mapping.set(index, newIdx);
    }
  });

  const finalRows = uniqueRows.map((_, idx) =>
    mergeRows(mergeGroups.get(idx)!)
  );

  return { uniqueRows: finalRows, mapping };
}
