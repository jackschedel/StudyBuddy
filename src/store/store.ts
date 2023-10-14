import { create, StoreApi } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatSlice, createChatSlice } from './chat-slice';
import { AuthSlice, createAuthSlice } from './auth-slice';
export type StoreState = ChatSlice &
  AuthSlice;

export type StoreSlice<T> = (
  set: StoreApi<StoreState>['setState'],
  get: StoreApi<StoreState>['getState']
) => T;

export const createPartializedState = (state: StoreState) => ({
  chats: state.chats,
  currentChatIndex: state.currentChatIndex,
  apiKey: state.apiKey,
});

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...createChatSlice(set, get),
      ...createAuthSlice(set, get),
    }),
    {
      name: 'study-buddy',
      partialize: (state) => createPartializedState(state),
      version: 9,
    }
  )
);

export default useStore;
