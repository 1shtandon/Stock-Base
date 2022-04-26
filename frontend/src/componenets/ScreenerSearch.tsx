import React, {useEffect} from "react";
import {StockBaseApi} from "../services/StockBaseApi";

export interface SearchResult {
    stock_id: string;
    stock_name: string;
}

const ScreenerSearch: React.FC = () => {

    const [searchTerm, setSearchTerm] = React.useState("");
    const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
    const handleChange = (event: { target: { value: string; }; }) => {
        setSearchResults([]);
        if (event.target.value.length > 0) {
            StockBaseApi.getInstance().searchStocks({stock_name: event.target.value}).then(res => {
                if (res.success) {
                    let stockResultResponse = res.data;
                    let results_: SearchResult[] = []
                    if (stockResultResponse && stockResultResponse.length > 0) {
                        stockResultResponse.forEach(stock => {
                            console.log(stock)
                            results_.push({
                                stock_id: stock.instrumentId,
                                stock_name: stock.stockName
                            })
                        })
                        setSearchResults(results_);
                    }
                }
                console.log(res);
            })
        }
        setSearchTerm(event.target.value);
    };

    return (
        <div className="container safe-area sdss">
            <div className="stock-search-bar">
                <form className="d-flex" onSubmit={() => {
                    handleChange({target: {value: searchTerm}});
                    return false
                }}>
                    <input className="form-control me-2" type="search" placeholder="Search Stock" aria-label="Search"
                           value={searchTerm} onChange={handleChange}/>
                    {/*<button className="btn btn-outline-success" type="submit">Search</button>*/}
                </form>
                <div style={{marginTop: '5vh'}}>
                    <ul>
                    {searchResults.map(stock => (
                        <li key={stock.stock_id}>
                            <a href={`/screener/${stock.stock_id}`} style={{fontSize: 26}}>{stock.stock_name}</a>
                        </li>
                    ))}
                </ul>
                </div>
            </div>
        </div>
    );
}

export default ScreenerSearch;
