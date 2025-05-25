"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";
import { useCallback } from "react";
import { uploadResponseSchema, errorResponseSchema } from "@/lib/zod/api/csv";
import { useCSVStore } from "@/lib/store/csv-store";
import { useRouter } from "next/navigation";

export default function FileUpload() {
  const router = useRouter();
  const addCSV = useCSVStore((state) => state.addCSV);

  const handleUpload = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      // Parse the response using Zod
      try {
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
      }
    },
    [addCSV, router]
  );

  return (
    <Card>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const fileInput = event.currentTarget.elements.namedItem(
            "file"
          ) as HTMLInputElement;
          if (fileInput && fileInput.files && fileInput.files[0]) {
            handleUpload(fileInput.files[0]);
          }
        }}
      >
        <CardContent className="p-6 space-y-4">
          <div className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col gap-1 p-6 items-center">
            <FileIcon className="w-12 h-12" />
            <span className="text-sm font-medium text-gray-500">
              Drag and drop a file or click to browse
            </span>
            <span className="text-xs text-gray-500">.csv</span>
          </div>
          <div className="space-y-2 text-sm">
            <Label htmlFor="file" className="text-sm font-medium">
              File
            </Label>
            <Input id="file" type="file" placeholder="File" accept="csv/*" />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" size="lg">
            Upload
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
