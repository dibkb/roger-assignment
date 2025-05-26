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

## Live Preview (⚠️ not recommended)

```
https://roger-assignment.vercel.app/
```
