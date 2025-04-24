export interface IUser {
    _id?: string
    name: string;
    role?: string;
    email: string;
    password?: string;
    mobile: number| string
    confirmPassword?: string
    profile?: string
    status?: 'active' | 'inactive';
    token?: string
}