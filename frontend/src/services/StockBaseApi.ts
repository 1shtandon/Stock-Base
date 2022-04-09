import axios from 'axios';
import {
    CreateTransactionPayload,
    FeedbackPayload,
    LoginPayload,
    RegisterPayload, SearchStockParams
} from "../models/stockBaseApi/Request";
import {
    FeedbackResponse,
    FeedbacksResponse,
    LoginResponse,
    Stock,
    Transaction,
    UserInfo
} from "../models/stockBaseApi/Response";

export class ApiResponse<T> {
    success: boolean;
    data: T | null;
    error: string | null;

    public constructor(success: boolean, data: T | null, error: string | null = null) {
        this.success = success;
        this.data = data;
        this.error = error;
    }

}

export class StockBaseApi {
    private static instance: StockBaseApi;
    private static baseUrl: string = 'http://127.0.0.1:8000/';
    private token: string | null = null;
    private username: string | null = null;
    private email: string | null = null;
    private is_admin: boolean | null = null;

    private constructor() {
        this.token = StockBaseApi.getToken();
    }

    public static getToken(): string | null {
        return localStorage.getItem('stockapi_token');
    }

    public async getUserInfo(): Promise<ApiResponse<UserInfo>> {
        if (this.token) {
            try {
                const response = await axios.get<UserInfo>(`${StockBaseApi.baseUrl}api/user/`, {
                    headers: {
                        Authorization: `Token ${this.token}`
                    }
                });
                return new ApiResponse(
                    true,
                    response.data
                )
            } catch (error) {
                return new ApiResponse<UserInfo>(
                    false,
                    null
                )
            }
        }
        return new ApiResponse<UserInfo>(
            false,
            null
        )
    }

    public static setToken(token: string): void {
        localStorage.setItem('stockapi_token', token);
    }

    public static getInstance(): StockBaseApi {
        if (!StockBaseApi.instance) {
            StockBaseApi.instance = new StockBaseApi();
        }
        return StockBaseApi.instance;
    }

    private async _login({...loginPayload}: LoginPayload, is_admin: boolean = false): Promise<ApiResponse<LoginResponse>> {
        try {
            let url = `${StockBaseApi.baseUrl}login/`;
            if (is_admin) {
                url = `${StockBaseApi.baseUrl}admin/login/`
            }
            const {data} = await axios.post<LoginResponse>(url, {...loginPayload});
            this.username = data.username;
            this.email = data.email
            this.is_admin = data.isAdmin;
            this.token = data.access_token;
            StockBaseApi.setToken(data.access_token);
            return new ApiResponse(
                true,
                data
            );
        } catch (e) {
            console.log(e);
            return new ApiResponse<LoginResponse>(
                false,
                null
            );
        }
    }

    public async login({...loginPayload}: LoginPayload): Promise<ApiResponse<LoginResponse>> {
        return this._login({...loginPayload});
    }

    public async loginAdmin({...loginPayload}: LoginPayload): Promise<ApiResponse<LoginResponse>> {
        return this._login({...loginPayload}, true);
    }

    public async logout(): Promise<void> {
        this.token = null;
        this.username = null;
        this.is_admin = null;
        localStorage.removeItem('stockapi_token');
        await axios.post(`${StockBaseApi.baseUrl}logout/`);
    }

    public async register({...registerPayload}: RegisterPayload): Promise<ApiResponse<LoginResponse>> {
        try {
            let url = `${StockBaseApi.baseUrl}register/`;
            const {data} = await axios.post<LoginResponse>(url, {...registerPayload});
            this.username = data.username;
            this.is_admin = data.isAdmin;
            this.token = data.access_token;
            StockBaseApi.setToken(data.access_token);
            return new ApiResponse(
                true,
                data
            );
        } catch (e) {
            console.log(e);
            return new ApiResponse<LoginResponse>(
                false,
                null
            );
        }
    }

    public async createFeedback({...feedbackPayload}: FeedbackPayload): Promise<ApiResponse<FeedbackResponse>> {
        try {
            let url = `${StockBaseApi.baseUrl}feedback/`;
            const {data} = await axios.post<FeedbackResponse>(url, {...feedbackPayload});
            return new ApiResponse(
                true,
                data
            );
        } catch (e) {
            console.log(e);
            return new ApiResponse<FeedbackResponse>(
                false,
                null
            );
        }
    }

    public async getFeedbacks(): Promise<ApiResponse<FeedbacksResponse>> {
        try {
            let url = `${StockBaseApi.baseUrl}feedbacks/`;
            const {data} = await axios.get<FeedbacksResponse>(url);
            return new ApiResponse(
                true,
                data
            );
        } catch (e) {
            console.log(e);
            return new ApiResponse<FeedbacksResponse>(
                false,
                null
            );
        }
    }

    public async getStock(stock_id: string): Promise<ApiResponse<Stock>> {
        try {
            let url = `${StockBaseApi.baseUrl}stock/`;
            const {data} = await axios.get<Stock>(url);
            return new ApiResponse(
                true,
                data
            );
        } catch (e) {
            console.log(e);
            return new ApiResponse<Stock>(
                false,
                null
            );
        }
    }

    public async getAllStocks(): Promise<ApiResponse<Stock[]>> {
        try {
            let url = `${StockBaseApi.baseUrl}stock/all/`;
            const {data} = await axios.get<Stock[]>(url);
            return new ApiResponse(
                true,
                data
            );
        } catch (e) {
            console.log(e);
            return new ApiResponse<Stock[]>(
                false,
                null
            );
        }
    }

    public async createStocks(stock: Stock): Promise<ApiResponse<Stock>> {
        try {
            let url = `${StockBaseApi.baseUrl}stock/`;
            const {data} = await axios.post<Stock>(url, stock);
            return new ApiResponse(
                true,
                data
            );
        } catch (e) {
            console.log(e);
            return new ApiResponse<Stock>(
                false,
                null
            );
        }
    }

    public async searchStocks({...params}: SearchStockParams): Promise<ApiResponse<Stock>> {
        try {
            let url = `${StockBaseApi.baseUrl}stock/search/`;
            const {data} = await axios.get<Stock>(url, {params});
            return new ApiResponse(
                true,
                data
            );
        } catch (e) {
            console.log(e);
            return new ApiResponse<Stock>(
                false,
                null
            );
        }
    }

    public async getTransactions(stock_id: string | null): Promise<ApiResponse<Transaction[]>> {
        try {
            let url = `${StockBaseApi.baseUrl}transaction/`;
            const {data} = await axios.get<Transaction[]>(url, {params: {stock_id}});
            return new ApiResponse(
                true,
                data
            );
        } catch (e) {
            console.log(e);
            return new ApiResponse<Transaction[]>(
                false,
                null
            );
        }
    }

    public async createTransaction(transaction: CreateTransactionPayload): Promise<ApiResponse<Transaction>> {
        try {
            let url = `${StockBaseApi.baseUrl}transaction/`;
            const {data} = await axios.post<Transaction>(url, transaction);
            return new ApiResponse(
                true,
                data
            );
        } catch (e) {
            console.log(e);
            return new ApiResponse<Transaction>(
                false,
                null
            );
        }
    }

}