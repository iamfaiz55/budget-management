// stores/useUserStore.ts
import { create } from "zustand";
import { IUser } from "@/models/user.interface";
import { ITransaction } from "@/models/transaction.interface";

interface UserState {
  currentUser: IUser | null;
  transactions: ITransaction[];
  adminBalance: number;

  setUserData: (
    user: IUser,
    transactions: ITransaction[],
    adminBalance: number,

  ) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  transactions: [],
  adminBalance: 0,
  amountAddedSuccess: false,
  sendAmount: undefined,
  setUserData: (user, transactions, adminBalance) =>
    set({ currentUser: user, transactions, adminBalance }),

}));
