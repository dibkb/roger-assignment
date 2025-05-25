interface PersonData {
  full_name: string;
  first_name: string;
  last_name: string;
  title: string;
  email: string;
  linkedin_url: string;
  company_name: string;
  company_domain: string;
  company_description: string;
}

export function cleanAndParseJson(input: string): PersonData {
  // Remove markdown code block markers if present
  const cleanedInput = input
    .replace(/^```json\s*/i, "") // Remove opening ```json
    .replace(/^```\s*/i, "") // Remove opening ``` if no language specified
    .replace(/\s*```$/g, "") // Remove closing ```
    .trim(); // Remove any extra whitespace

  try {
    return JSON.parse(cleanedInput) as PersonData;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Invalid JSON format after cleaning");
    }
    throw error;
  }
}
