
export interface LoginPayload {
    username: string;
    password: string;
}

export interface RegisterPayload {
    username: string;
    password: string;
    email: string;
    first_name: string;
    last_name: string;
    age: number;
}

export interface FeedbackPayload {
    title: string;
    message: string;
}

export interface SearchStockParams {
    stock_name: string;
}

export interface CreateTransactionPayload {
    instrumentId: string;
    quantity: number;
    price: number;
    purchase_date: string;
}