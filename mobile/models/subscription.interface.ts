export interface ISubscription {
    _id?: string;
    user: string;
    plan: number;
    startDate: number;
    endDate: number; 
    isActive:boolean; 
    createdAt?:string
}
export interface IPayment {
    razorpay_order_id: string,
     razorpay_payment_id:string,
      razorpay_signature:string,
       planId:string
}
export interface IPaymentCreate {
    orderId: string,
    planId: string,
    amount:string,
    currency:string,
    key_id:string
}
export interface IMyPlan {
    message:string,
    result:{
        admin:{
            createdAt?:string, 
            _id?:string, 
           email : string,
            name : string,
            password?:string, 
            mobile?:any 
            role: string,
            status: string
        },
        paymentDetails:{
            razorpay_order_id: string
             razorpay_payment_id: string
             razorpay_signature: string,
           status: string
        },
        plan:{
            createdAt?: string
            duration: number
            maxUsers:number
            name: string
            price: number
        },
        users?: {
            role: string;
            _id: string;
            name: string;
            email: string;
            password?: string;
            mobile?: number;
          }[];
        endDate:string
        startDate:string
        isActive:boolean    
    }
}