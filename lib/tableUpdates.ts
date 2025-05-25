// lib/tableUpdates.ts

// --- Types ---
export interface RowData {
  [key: string]: string;
}

export interface RowUpdate {
  data: string;
  read: boolean;
  error?: string;
}

export type TableUpdates = Record<string, RowUpdate>;
export type UpdatesStore = Record<string, TableUpdates>;

// Payload delivered to subscribers
export interface UpdateEvent {
  tableId: string;
  rowId: string;
  data: string;
}

// Global store to persist data between requests
const globalStore: UpdatesStore = {};
const globalCompletedTables = new Set<string>();

// --- Store ---
class TableUpdateManager {
  private store: UpdatesStore = globalStore;
  public completedTables: Set<string> = globalCompletedTables;

  pushUpdate(tableId: string, rowId: string, data: string, error?: string) {
    if (!this.store[tableId]) {
      this.store[tableId] = {};
    }
    this.store[tableId][rowId] = { data, read: false, error };
  }

  getUnreadUpdates(tableId: string): UpdateEvent[] {
    const table = this.store[tableId] ?? {};
    return Object.entries(table)
      .filter(([, upd]) => !upd.read)
      .map(([rowId, upd]) => ({ tableId, rowId, data: upd.data }));
  }

  markRead(tableId: string, rowIds: string[]) {
    const table = this.store[tableId];
    if (!table) return;
    rowIds.forEach((rowId) => {
      if (table[rowId]) {
        table[rowId].read = true;
      }
    });
  }

  subscribe(tableId: string): UpdateEvent[] {
    return this.getUnreadUpdates(tableId);
  }

  clearTable(tableId: string) {
    delete this.store[tableId];
    this.completedTables.delete(tableId);
  }
}

export const tableUpdates = new TableUpdateManager();
