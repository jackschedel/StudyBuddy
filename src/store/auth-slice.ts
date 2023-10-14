import { StoreSlice } from './store';

export interface AuthSlice {
  apiKey?: string;
  setApiKey: (apiKey: string) => void;
}

export const createAuthSlice: StoreSlice<AuthSlice> = (set, get) => ({
  apiKey: undefined,
  setApiKey: (apiKey: string) => {
    set((prev: AuthSlice) => ({
      ...prev,
      apiKey: apiKey,
    }));
  },
});
