import { create } from "zustand";

type RowUpdateStatus = "not_updated" | "updating" | "updated";

interface RowUpdatesState {
  // tableId -> rowIndex -> status
  rowStatuses: Record<string, Record<number, RowUpdateStatus>>;
  // Global update lock
  isUpdating: boolean;

  // Actions
  setRowStatus: (
    tableId: string,
    rowIndex: number,
    status: RowUpdateStatus
  ) => void;
  getRowStatus: (tableId: string, rowIndex: number) => RowUpdateStatus;
  resetTable: (tableId: string) => void;
  initializeTable: (tableId: string, rowCount: number) => void;
  canUpdate: () => boolean;
}

export const useRowUpdatesStore = create<RowUpdatesState>((set, get) => ({
  rowStatuses: {},
  isUpdating: false,

  setRowStatus: (
    tableId: string,
    rowIndex: number,
    status: RowUpdateStatus
  ) => {
    set((state) => {
      // If this is an update to "updating" status, set the global lock
      if (status === "updating") {
        state.isUpdating = true;
      } else {
        // If this is a final status, release the global lock
        state.isUpdating = false;
      }

      // Ensure we have the table entry
      const tableStatuses = state.rowStatuses[tableId] || {};

      return {
        rowStatuses: {
          ...state.rowStatuses,
          [tableId]: {
            ...tableStatuses,
            [rowIndex]: status,
          },
        },
        isUpdating: state.isUpdating,
      };
    });
  },

  getRowStatus: (tableId: string, rowIndex: number) => {
    const state = get();
    return state.rowStatuses[tableId]?.[rowIndex] ?? "not_updated";
  },

  canUpdate: () => {
    return !get().isUpdating;
  },

  resetTable: (tableId: string) => {
    set((state) => {
      const newStatuses = { ...state.rowStatuses };
      delete newStatuses[tableId];

      return {
        rowStatuses: newStatuses,
        isUpdating: false,
      };
    });
  },

  initializeTable: (tableId: string, rowCount: number) => {
    set((state) => {
      const existingStatuses = state.rowStatuses[tableId] || {};
      const newStatuses: Record<number, RowUpdateStatus> = {};

      // Initialize all rows as not_updated
      for (let i = 0; i < rowCount; i++) {
        newStatuses[i] = existingStatuses[i] || "not_updated";
      }

      return {
        rowStatuses: {
          ...state.rowStatuses,
          [tableId]: newStatuses,
        },
        isUpdating: false,
      };
    });
  },
}));
