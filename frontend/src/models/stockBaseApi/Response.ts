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
    instrumentId: string;
    stockType: string;
    prevClose: number;
    dayHigh: number;
    dayLow: number;
    high52weeks: number;
    low52weeks: number;
    dividendYield: number;
    faceValue: number;
    bookValue: number;
    pros: string;
    cons: string;
    stockName: string;
    price: number;
    marketCap: number;
    PERatio: number;
    about: string;
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