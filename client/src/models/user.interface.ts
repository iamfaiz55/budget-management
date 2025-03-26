export interface IUser {
    _id?: string
    clinicId?: string
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phone: number
    confirmPassword?: string
    profile?: string
    role: 'Clinic Admin' | 'Doctor' | 'Receptionist';
    status?: 'active' | 'inactive';
    token?: string
}