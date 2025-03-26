export interface ITransaction {
    _id?: string;
    date: string;
    note?:string;
    category: string;
    amount:number;
    account: string
    type:string;
    // status: 'active' | 'inactive';
    user?:string
}