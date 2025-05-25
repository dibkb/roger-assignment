import { create } from "zustand";

type RowUpdateStatus = "not_updated" | "updating" | "updated";

interface RowUpdatesState {
  // tableId -> rowIndex -> status
  rowStatuses: Record<string, Record<number, RowUpdateStatus>>;

  setRowStatus: (
    tableId: string,
    rowIndex: number,
    status: RowUpdateStatus
  ) => void;
  getRowStatus: (tableId: string, rowIndex: number) => RowUpdateStatus;
  resetTable: (tableId: string) => void;
  initializeTable: (tableId: string, rowCount: number) => void;
  canUpdateRow: (tableId: string, rowIndex: number) => boolean;
}

export const useRowUpdatesStore = create<RowUpdatesState>((set, get) => ({
  rowStatuses: {},

  setRowStatus: (
    tableId: string,
    rowIndex: number,
    status: RowUpdateStatus
  ) => {
    set((state) => {
      const currentStatus = state.rowStatuses[tableId]?.[rowIndex];

      if (currentStatus === "updated") {
        return state;
      }

      const tableStatuses = state.rowStatuses[tableId] || {};

      return {
        rowStatuses: {
          ...state.rowStatuses,
          [tableId]: {
            ...tableStatuses,
            [rowIndex]: status,
          },
        },
      };
    });
  },

  getRowStatus: (tableId: string, rowIndex: number) => {
    const state = get();
    return state.rowStatuses[tableId]?.[rowIndex] ?? "not_updated";
  },

  canUpdateRow: (tableId: string, rowIndex: number) => {
    const state = get();
    const currentStatus = state.rowStatuses[tableId]?.[rowIndex];
    return currentStatus !== "updated";
  },

  resetTable: (tableId: string) => {
    set((state) => {
      const newStatuses = { ...state.rowStatuses };
      delete newStatuses[tableId];

      return {
        rowStatuses: newStatuses,
      };
    });
  },

  initializeTable: (tableId: string, rowCount: number) => {
    set((state) => {
      const existingStatuses = state.rowStatuses[tableId] || {};
      const newStatuses: Record<number, RowUpdateStatus> = {};

      for (let i = 0; i < rowCount; i++) {
        newStatuses[i] = existingStatuses[i] || "not_updated";
      }

      return {
        rowStatuses: {
          ...state.rowStatuses,
          [tableId]: newStatuses,
        },
      };
    });
  },
}));
