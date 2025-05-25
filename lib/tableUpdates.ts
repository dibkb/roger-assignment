// lib/tableUpdates.ts
import { EventEmitter } from "events";

// --- Types ---
export interface RowData {
  [key: string]: string;
}

export interface RowUpdate {
  data: string;
  read: boolean;
}

export type TableUpdates = Record<string, RowUpdate>;
export type UpdatesStore = Record<string, TableUpdates>;

// Payload delivered to subscribers
export interface UpdateEvent {
  tableId: string;
  rowId: string;
  data: string;
}

// --- Store & Event Emitter ---
class TableUpdateManager {
  private store: UpdatesStore = {};
  private emitter = new EventEmitter();

  pushUpdate(tableId: string, rowId: string, data: string) {
    if (!this.store[tableId]) {
      this.store[tableId] = {};
    }
    this.store[tableId][rowId] = { data, read: false };

    this.emitter.emit(tableId, { tableId, rowId, data } as UpdateEvent);
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

  subscribe(tableId: string, listener: (evt: UpdateEvent) => void) {
    this.emitter.on(tableId, listener);
    return () => this.emitter.off(tableId, listener);
  }

  clearTable(tableId: string) {
    delete this.store[tableId];
    this.emitter.removeAllListeners(tableId);
  }
}

export const tableUpdates = new TableUpdateManager();
