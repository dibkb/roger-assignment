"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { uploadResponseSchema, errorResponseSchema } from "@/lib/zod/api/csv";
import { useCSVStore } from "@/lib/store/csv-store";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";

export default function FileUpload() {
  const router = useRouter();
  const addCSV = useCSVStore((state) => state.addCSV);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = useCallback(
    async (file: File) => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        // Parse the response using Zod
        if (response.ok) {
          const parsedData = uploadResponseSchema.parse(data);
          addCSV(parsedData);
          router.push(`/csv/${parsedData.id}`);
        } else {
          const errorData = errorResponseSchema.parse(data);
          console.error("Upload failed:", errorData.error);
        }
      } catch (error) {
        console.error("Invalid response format:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [addCSV, router]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleUpload(acceptedFiles[0]);
      }
    },
    [handleUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
    disabled: isLoading,
  });

  return (
    <Card>
      <form onSubmit={(e) => e.preventDefault()}>
        <CardContent className="p-6 space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg flex flex-col gap-1 p-6 items-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <File className="my-4 text-neutral-400 size-6" />
            <span className="text-sm font-medium text-gray-500">
              {isDragActive
                ? "Drop the CSV file here"
                : "Drag and drop a file or click to browse"}
            </span>
            <span className="text-xs text-gray-500">.csv</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            size="lg"
            disabled={isLoading}
            onClick={() =>
              (
                document.querySelector('input[type="file"]') as HTMLInputElement
              )?.click()
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
