import {
  uploadResponseSchema,
  errorResponseSchema,
} from "@/mock-server/mock.server";

// Mock fetch globally
global.fetch = jest.fn();

describe("File Upload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully upload a CSV file", async () => {
    const mockResponse = {
      id: "123",
      status: "success",
      message: "File uploaded successfully",
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const file = new File(["test,csv,data"], "test.csv", { type: "text/csv" });
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    const parsedData = uploadResponseSchema.parse(data);
    expect(parsedData).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith("/api/upload", {
      method: "POST",
      body: expect.any(FormData),
    });
  });

  it("should handle upload errors", async () => {
    const mockError = {
      error: "Invalid file format",
      status: "error",
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve(mockError),
    });

    const file = new File(["invalid,data"], "test.txt", { type: "text/plain" });
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    const parsedError = errorResponseSchema.parse(data);
    expect(parsedError).toEqual(mockError);
  });

  it("should handle network errors", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    const file = new File(["test,data"], "test.csv", { type: "text/csv" });
    const formData = new FormData();
    formData.append("file", file);

    await expect(
      fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
    ).rejects.toThrow("Network error");
  });
});
