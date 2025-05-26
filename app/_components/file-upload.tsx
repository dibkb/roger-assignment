"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { File, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { uploadResponseSchema, errorResponseSchema } from "@/lib/zod/api/csv";
import { useCSVStore } from "@/lib/store/csv-store";
import { useRouter } from "next/navigation";

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
            <File className="my-4 text-neutral-400 size-6" />
            <span className="text-sm font-medium text-gray-500">
              Drag and drop a file or click to browse
            </span>
            <span className="text-xs text-gray-500">.csv</span>
          </div>
          <div className="space-y-2 text-sm">
            <Label htmlFor="file" className="text-sm font-medium">
              File
            </Label>
            <Input
              id="file"
              type="file"
              placeholder="File"
              accept="csv/*"
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" size="lg" disabled={isLoading}>
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
