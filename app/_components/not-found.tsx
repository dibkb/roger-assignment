import React from "react";

const CsvNotFound = () => {
  return (
    <main className="flex flex-col mx-auto container">
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold text-gray-900">CSV not found</h2>
        <p className="mt-2 text-gray-600">
          The requested CSV file could not be found.
        </p>
      </div>
    </main>
  );
};

export default CsvNotFound;
