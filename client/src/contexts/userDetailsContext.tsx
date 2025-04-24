import { createContext, useContext, useState, ReactNode } from "react";
import { IUser } from "../models/user.interface";
import { ITransaction } from "../models/transaction.interface";
// import { IUser } from "@/models/user.interface";

interface UserDataContextType {
  transactions: ITransaction[];
  setTransactions: (txns: any[]) => void;
  userData: IUser | null;
  setUserData: (user: IUser | null) => void;
  adminBalance: number;
  setAdminBalance: (balance: number) => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [userData, setUserData] = useState<IUser | null>(null);
  const [adminBalance, setAdminBalance] = useState<number>(0);

  return (
    <UserDataContext.Provider
      value={{
        transactions,
        setTransactions,
        userData,
        setUserData,
        adminBalance,
        setAdminBalance,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
};
