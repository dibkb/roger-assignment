import { deduplicateRows } from "@/lib/de-duplication";
import { Person } from "@/lib/zod/api/response";

describe("deduplicateRows", () => {
  it("should deduplicate rows based on email", () => {
    const input: Person[] = [
      {
        full_name: "John Doe",
        email: "john@example.com",
        linkedin_url: "https://linkedin.com/in/john1",
      },
      {
        full_name: "John Doe",
        email: "john@example.com",
        linkedin_url: "https://linkedin.com/in/john2",
      },
    ];

    const result = deduplicateRows(input);

    expect(result.uniqueRows).toHaveLength(1);
    expect(result.mapping.get(0)).toBe(0);
    expect(result.mapping.get(1)).toBe(0);
    expect(result.uniqueRows[0].email).toBe("john@example.com");
  });

  it("should deduplicate rows based on LinkedIn URL", () => {
    const input: Person[] = [
      {
        full_name: "Jane Smith",
        email: "jane1@example.com",
        linkedin_url: "https://linkedin.com/in/jane",
      },
      {
        full_name: "Jane Smith",
        email: "jane2@example.com",
        linkedin_url: "https://linkedin.com/in/jane",
      },
    ];

    const result = deduplicateRows(input);

    expect(result.uniqueRows).toHaveLength(1);
    expect(result.mapping.get(0)).toBe(0);
    expect(result.mapping.get(1)).toBe(0);
    expect(result.uniqueRows[0].linkedin_url).toBe(
      "https://linkedin.com/in/jane"
    );
  });

  it("should merge data from duplicate rows", () => {
    const input: Person[] = [
      {
        full_name: "Alice Johnson",
        email: "alice@example.com",
        linkedin_url: "",
        title: "Engineer",
        company_name: "Tech Corp",
        company_domain: "",
      },
      {
        full_name: "Alice Johnson",
        email: "alice@example.com",
        linkedin_url: "https://linkedin.com/in/alice",
        title: "",
        company_name: "",
        company_domain: "techcorp.com",
      },
      {
        full_name: "Alice Johnson",
        email: "alice@example.com",
        title: "Senior Engineer",
        company_name: "",
        company_domain: "",
      },
    ];

    const result = deduplicateRows(input);

    expect(result.uniqueRows).toHaveLength(1);
    expect(result.uniqueRows[0]).toEqual({
      full_name: "Alice Johnson",
      email: "alice@example.com",
      linkedin_url: "https://linkedin.com/in/alice",
      title: "Engineer",
      company_name: "Tech Corp",
      company_domain: "techcorp.com",
    });
    expect(result.mapping.get(0)).toBe(0);
    expect(result.mapping.get(1)).toBe(0);
    expect(result.mapping.get(2)).toBe(0);
  });

  it("should handle case-insensitive email and LinkedIn URL matching", () => {
    const input: Person[] = [
      {
        full_name: "Bob Wilson",
        email: "BOB@example.com",
        linkedin_url: "https://linkedin.com/in/BOB",
      },
      {
        full_name: "Bob Wilson",
        email: "bob@example.com",
        linkedin_url: "https://linkedin.com/in/bob",
      },
    ];

    const result = deduplicateRows(input);

    expect(result.uniqueRows).toHaveLength(1);
    expect(result.mapping.get(0)).toBe(0);
    expect(result.mapping.get(1)).toBe(0);
  });

  it("should handle empty or undefined values", () => {
    const input: Person[] = [
      {
        full_name: "Charlie Brown",
        email: "",
        linkedin_url: "",
      },
      {
        full_name: "Charlie Brown",
        email: "charlie@example.com",
        linkedin_url: "",
      },
    ];

    const result = deduplicateRows(input);

    expect(result.uniqueRows).toHaveLength(2);
    expect(result.mapping.get(0)).toBe(0);
    expect(result.mapping.get(1)).toBe(1);
  });
});
