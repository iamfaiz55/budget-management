export interface IPlan {
    _id?: string;
    name: string;
    price: number;
    maxUsers: number;
    duration: number; 
    createdAt?:string
}