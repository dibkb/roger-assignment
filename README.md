# Roger Assignment

## Setup Instructions

1. Clone the repository:

```bash
git clone git@github.com:dibkb/roger-assignment.git
cd roger-assignment
```

2. Environment Configuration:

```bash
cp .env.example .env
```

Edit the `.env` file and populate the required values.

3. Install Dependencies:

```bash
pnpm install
```

## Running the Application

To start the development server:

```bash
pnpm run dev
```

The application will be running on port 3000.

## Testing

To run the test suite:

```bash
pnpm test
```

## Sample Data

Sample CSV files are available in the `sample-data` directory:

- `data-dup.csv`: Contains sample data with potential duplicates
- `data2.csv`: Additional sample dataset
- `datqa.csv`: Another sample dataset

You can use these files to test the application's functionality.

## Demo Video

A demonstration of the application's features is available here:
[Watch Demo Video](https://www.loom.com/share/21e250bde51c4ee08fc9ecbd7a7adc47?sid=d027e385-82e0-4ab6-8486-43011783a661)

## Live Preview (⚠️ not recommended)

```
https://roger-assignment.vercel.app/
```

## System Design

```mermaid
graph TD
    A[Frontend UI\nUpload • Table View • UX] --> B[1. CSV Upload/Drag-Drop\n→ Parsed & mapped via GPT-4o\n→ Returns: { uuid, normalizedData[] }]
    B --> C[Stored in Zustand Store\n+ localStorage for uuid]
    C --> D[Go to /csv/uuid]
    D --> E[Table Display\nNormalized UI]
    E --> F[Deduplication Logic\n→ By email/linkedin]
    F --> G[Unique Deduplicated Entries]
    G --> H[Enhance\nRow Btn]
    G --> I[Enhance All Btn\nUses p-limit(6)\n→ Calls Enhance Row under hood]
    I --> J[Mastra AI Agent \nTools:\n• SCRAPIN\n• SCRAPEOW\n• SERP API]
    J --> K[Enhanced Row Data\n→ Replace in UI]
    K --> L[Token Usage Count]
    K --> M[Global Progress]
    K --> N[Per Row Error Info]
    M --> O[Highlight rows\nmissing email/LI]
    O --> P[Download Enhanced\nCSV Filtered]
```

This diagram illustrates the flow of data and user interactions in the application, from CSV upload through processing, enhancement, and final output.
