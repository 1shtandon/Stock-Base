export interface Feedback {
    feedback_id: number;
    user_id: number;
    title: string;
    message: string;
}

export interface UserInfo {
    username: string;
    email: string;
    isAdmin: boolean;
}

export interface Stock {
    instrument_id: string;
    stock_type: string;
    stock_name: string;
    prev_close: number;
    current_price: number;
    day_high: number;
    day_low: number;
}

export interface Transaction {
    transaction_id: number;
    user_id: number;
    instrument_id: number;
    quantity: number;
    price: number;
    purchase_date: string;
}

export interface ErrorResponse {
    error: string;
    error_description: string;
}

export interface LoginResponse {
    access_token: string;
    username: string;
    email: string;
    isAdmin: boolean;
}

export interface FeedbackResponse {
    feedback: Feedback;
}

export interface FeedbacksResponse {
    feedbacks: Feedback[];
}

export interface Response {
}