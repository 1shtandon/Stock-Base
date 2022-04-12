import {StockBaseApi} from "./services/StockBaseApi";

export const logout = () => {
    StockBaseApi.getInstance().logout().then(() => {});

};