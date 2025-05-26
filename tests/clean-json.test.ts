import { cleanAndParseJson } from "@/lib/clean-json";

describe("cleanAndParseJson", () => {
  it("should parse clean JSON data correctly", () => {
    const input = `{
      "full_name": "Dan Brown",
      "first_name": "Dan",
      "last_name": "Brown",
      "title": "Product Manager",
      "email": "",
      "linkedin_url": "",
      "company_name": "BrightWave",
      "company_domain": "brightwave.io",
      "company_description": "Brightwave is the leading AI-powered investment intelligence platform that transforms thousands of pages of documents into actionable insights in minutes."
    }`;

    const result = cleanAndParseJson(input);

    expect(result).toEqual({
      full_name: "Dan Brown",
      first_name: "Dan",
      last_name: "Brown",
      title: "Product Manager",
      email: "",
      linkedin_url: "",
      company_name: "BrightWave",
      company_domain: "brightwave.io",
      company_description:
        "Brightwave is the leading AI-powered investment intelligence platform that transforms thousands of pages of documents into actionable insights in minutes.",
    });
  });

  it("should handle JSON with markdown code block markers", () => {
    const input =
      "```json\n" +
      `{
      "full_name": "Dan Brown",
      "first_name": "Dan",
      "last_name": "Brown",
      "title": "Product Manager",
      "email": "",
      "linkedin_url": "",
      "company_name": "BrightWave",
      "company_domain": "brightwave.io",
      "company_description": "Brightwave is the leading AI-powered investment intelligence platform that transforms thousands of pages of documents into actionable insights in minutes."
    }` +
      "\n```";

    const result = cleanAndParseJson(input);

    expect(result).toEqual({
      full_name: "Dan Brown",
      first_name: "Dan",
      last_name: "Brown",
      title: "Product Manager",
      email: "",
      linkedin_url: "",
      company_name: "BrightWave",
      company_domain: "brightwave.io",
      company_description:
        "Brightwave is the leading AI-powered investment intelligence platform that transforms thousands of pages of documents into actionable insights in minutes.",
    });
  });
});
