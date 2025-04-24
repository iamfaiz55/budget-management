import { IUser } from "./user.interface";

export interface ITransaction {
    _id?: string;
    date: string;
    note:string;
    category: string;
    amount:number;
    account: string
    type:string;
    isTransfered?:boolean;
    // status: 'active' | 'inactive';
    user?:IUser

}



export interface ICategory {
    _id: string;
    name: string;
    type?: "expense"| "income";
    createdBy?:string
}
