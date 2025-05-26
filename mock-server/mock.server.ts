import { mockData } from "./mock.data";

export const mockServer = {
  enrich: async (id: string) => {
    const idx = mockData.findIndex((_, idx) => idx === parseInt(id));
    if (idx === -1) {
      return null;
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData[idx]);
      }, 1000);
    });
  },
};
