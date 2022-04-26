import {StockBaseApi} from "../services/StockBaseApi";
import React, {useEffect, useState} from 'react';
import {StockValue} from "../models/stockBaseApi/Response";
import {SearchResult} from "./ScreenerSearch";


const DetailCard: React.FC<StockValue> = ({stock_name, instrument_id, market_value, quantity, day_gain, price}) => {
    return (
        <tr data-item="trxc">
            <td><a href={instrument_id} style={{color: "white"}}>{instrument_id}</a></td>
            <td style={{color: "white"}}>{stock_name}</td>
            <td className="text-right" data-column="value" style={{color: "white"}}>{price}</td>
            <td className="text-right up" data-column="change" style={{color: "white"}}>{quantity}</td>
            <td className="text-right up" data-column="changePercent" style={{color: "white"}}>{day_gain}%</td>
            <td className="text-right" data-column="volume"
                style={{color: "white"}}>{market_value.toLocaleString()}</td>
        </tr>
    );
}


const Portfolio: React.FC = () => {

    const [stocksValue, setStocksValue] = useState<StockValue[]>([]);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
    const [submittingForm, setSubmittingForm] = React.useState(false);
    const [addingStock, setAddingStock] = React.useState(false);
    const [limit, setLimit] = React.useState(1000);
    const [loading, setLoading] = React.useState(false);


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

    useEffect(() => {
        StockBaseApi.getInstance().getValue().then(stockValueRes => {
            if (stockValueRes.success) {
                setStocksValue(stockValueRes.data!);
            }
        });
    }, []);

    return (
        <div className="safe-area">
            {loading ?
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                :
                <>{!submittingForm ?
                    <>
                        <div className="stock-search-bar" style={{marginLeft: "10vw", marginRight: "10vw"}}>
                            <form className="d-flex" onSubmit={() => {
                                handleChange({target: {value: searchTerm}});
                                return false
                            }}>
                                <input className="form-control me-2" type="search" placeholder="Search Stock"
                                       aria-label="Search"
                                       value={searchTerm} onChange={handleChange}/>
                            </form>
                            <div style={{marginTop: '5vh'}}>
                                <ul>
                                    {searchResults.map(stock => (
                                        <li key={stock.stock_id} style={{marginBottom: 10}}>
                                            <a href={`/screener/${stock.stock_id}`}
                                               style={{fontSize: 22}}>{stock.stock_name}</a>
                                            <button className="btn btn-primary"
                                                    style={{float: "right", marginRight: 40}}
                                                    onClick={() => {
                                                        setAddingStock(true);
                                                        !submittingForm && setSubmittingForm(true);
                                                    }}>
                                                Add
                                            </button>
                                            <button className="btn btn-danger" style={{float: "right", marginRight: 40}}
                                                    onClick={() => {
                                                        setAddingStock(false);
                                                        !submittingForm && setSubmittingForm(true);
                                                    }}>
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="row" style={{color: "white"}}>
                            <div className="col-md-2"></div>
                            <div className="col-md-7">
                                <div className="tab-content">
                                    <div role="tabpanel" className="tab-pane active" id="home">
                                        <table className="table table-responsive table-striped">
                                            <thead>
                                            <tr>
                                                <th style={{width: "12%", color: "white"}}>Symbol</th>
                                                <th style={{color: "white"}}>Name</th>
                                                <th className="text-right"
                                                    style={{width: "10%", color: "white"}}>Price
                                                </th>
                                                <th className="text-right"
                                                    style={{width: "12%", color: "white"}}>Quantity
                                                </th>
                                                <th className="text-right" style={{width: "10%", color: "white"}}>Day
                                                    Gain
                                                </th>
                                                <th className="text-right"
                                                    style={{width: "15%", color: "white"}}>Value
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                stocksValue.map(stockValue => <DetailCard
                                                    key={stockValue.instrument_id} {...stockValue}/>)
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog"
                             aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        ...
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close
                                        </button>
                                        <button type="button" className="btn btn-primary">Save changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={() => {
                            setSubmittingForm(true);
                        }}>
                            Launch demo modal
                        </button>
                    </> :
                    <>
                        <form>
                            
                        </form>
                        <div className="d-flex justify-content-center">
                            <button type="button" className="btn btn-primary" onClick={() => {
                                setSubmittingForm(false);
                            }}>
                                Exit
                            </button>
                        </div>

                    </>
                }</>
            }
        </div>
    );
}

export default Portfolio;
