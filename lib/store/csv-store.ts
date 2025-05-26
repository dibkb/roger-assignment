import { create } from "zustand";
import { persist } from "zustand/middleware";
import { z } from "zod";
import { uploadResponseSchema } from "@/lib/zod/api/csv";

type CSVData = z.infer<typeof uploadResponseSchema>;

export interface CSVStore {
  csvs: Record<string, CSVData>;

  addCSV: (csv: CSVData) => void;

  getCSV: (id: string) => CSVData | undefined;

  removeCSV: (id: string) => void;

  clearCSVs: () => void;
}

export const useCSVStore = create<CSVStore>()(
  persist(
    (set, get) => ({
      csvs: {},

      addCSV: (csv: CSVData) =>
        set((state) => ({
          csvs: {
            ...state.csvs,
            [csv.id]: csv,
          },
        })),

      getCSV: (id: string) => get().csvs[id],

      removeCSV: (id: string) =>
        set((state) => {
          const newCSVs = { ...state.csvs };
          delete newCSVs[id];
          return { csvs: newCSVs };
        }),

      clearCSVs: () => set({ csvs: {} }),
    }),
    {
      name: "csv-storage",
    }
  )
);
