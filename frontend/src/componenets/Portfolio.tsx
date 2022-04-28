import {StockBaseApi} from "../services/StockBaseApi";
import React, {useEffect, useState} from 'react';

import {StockValue} from "../models/stockBaseApi/Response";
import {SearchResult} from "./ScreenerSearch";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const DetailCard: React.FC<StockValue> = ({stock_name, instrument_id, market_value, quantity, day_gain, price}) => {
    return (
        <tr data-item="trxc">
            <td><a href={`/screener/${instrument_id}`} style={{color: "white"}}>{instrument_id}</a></td>
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
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [submittingForm, setSubmittingForm] = useState<boolean>(false);
    const [addingStock, setAddingStock] = useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [currentStock, setCurrentStock] = useState<StockValue>();
    const [alertShow, setAlertShow] = useState<boolean>(false);
    const notify = (text: string, error: boolean) => toast(text, {
        type: error ? "error" : "success",
        theme: "dark"
    });


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

    const updateStocksValue = () => {
        StockBaseApi.getInstance().getValue().then(stockValueRes => {
            if (stockValueRes.success) {
                setStocksValue(stockValueRes.data!);
            }
        });
    }


    useEffect(() => {
        updateStocksValue();
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
                            <div style={{
                                display: "flex",
                                alignContent: "center",
                                width: "100%",
                                alignSelf: "center",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: "50px",
                                flexDirection: "column"
                            }}>
                                <h2 id="mv">Total Market
                                    Value: ₹{parseFloat(stocksValue.reduce((acc, curr) => acc + curr.market_value, 0).toFixed(2)).toLocaleString()}</h2>
                                <h2 id="mv">Today Total Day
                                    Gain: ₹{parseFloat(stocksValue.reduce((acc, curr) => acc + (curr.price * curr.quantity * curr.day_gain / 100), 0).toFixed(2)).toLocaleString()}</h2>
                            </div>
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
                                                        setCurrentStock(() => {
                                                                let stockValue = stocksValue.filter(stocksValue => stocksValue.instrument_id === stock.stock_id)[0]

                                                                return {
                                                                    stock_name: stock.stock_name,
                                                                    quantity: stockValue?.quantity,
                                                                    day_gain: stockValue?.day_gain,
                                                                    instrument_id: stock.stock_id,
                                                                    price: stockValue?.price,
                                                                    market_value: stockValue?.market_value,
                                                                    stockType: stockValue?.stockType,
                                                                    buyed_value: stockValue?.buyed_value,
                                                                }
                                                            }
                                                        );
                                                        !submittingForm && setSubmittingForm(true);
                                                    }}>
                                                Add
                                            </button>
                                            {stocksValue.filter(stocksValue => stocksValue.instrument_id === stock.stock_id).length > 0 ?
                                                <button className="btn btn-danger"
                                                        style={{float: "right", marginRight: 40}}
                                                        onClick={() => {
                                                            setAddingStock(false);
                                                            setCurrentStock(stocksValue.filter(stocksValue => stocksValue.instrument_id === stock.stock_id)[0]);
                                                            !submittingForm && setSubmittingForm(true);
                                                        }}>
                                                    Remove
                                                </button>
                                                :
                                                <></>
                                            }

                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="row" style={{color: "white"}}>
                            <div style={{
                                display: "flex",
                                alignContent: "center",
                                alignSelf: "center",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                                <div className="col-md-7">
                                    <div className="tab-content">
                                        <div role="tabpanel" className="tab-pane active" id="home">
                                            <table className="table table-responsive table-striped">
                                                <thead>
                                                <tr>
                                                        <th style={{ width: "12%", color: "#42DCA3"}}>Symbol</th>
                                                        <th style={{ color: "#42DCA3"}}>Name</th>
                                                    <th className="text-right"
                                                            style={{ width: "10%", color: "#42DCA3"}}>Price
                                                    </th>
                                                    <th className="text-right"
                                                            style={{ width: "12%", color: "#42DCA3"}}>Quantity
                                                    </th>
                                                        <th className="text-right" style={{ width: "14%", color: "#42DCA3"}}>
                                                        Day Gain
                                                    </th>
                                                    <th className="text-right"
                                                            style={{ width: "15%", color: "#42DCA3"}}>Value
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
                    </> :
                    <>
                        <form className="row g-3">
                            <div className="col-md-12">
                                <label htmlFor="inputStockName" className="form-label">Stock Name</label>
                                <input type="text" className="form-control" id="inputStockName" readOnly={true}
                                       value={currentStock?.stock_name}/>
                            </div>
                            <input type="text" className="form-control" id="inputStockId" readOnly={true}
                                   value={currentStock?.instrument_id} hidden={true}/>
                            <div className="col-12">
                                <label htmlFor="inputQuantity" className="form-label">Quantity</label>
                                {
                                    addingStock ?
                                        <input type="number" className="form-control" id="inputQuantity" placeholder="1"
                                               min="1"/>
                                        :
                                        <input type="number" className="form-control" id="inputQuantity" placeholder="1"
                                               min="1" max={currentStock?.quantity}/>
                                }
                            </div>
                            <div className="col-6">
                                <label htmlFor="inputPurchaseDate"
                                       className="form-label">{addingStock ? "Purchase Date" : "Selling Date"}</label>
                                <input type="date" className="form-control" id="inputPurchaseDate"/>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="inputPurchasePrice" className="form-label">Price</label>
                                <input type="number" className="form-control" id="inputPurchasePrice"/>
                            </div>
                            <div className="col-12">
                                <button type="button" className="btn btn-primary" onClick={() => {
                                    let rawQuantity = document.querySelector<HTMLInputElement>('input[id="inputQuantity"]')!.value
                                    let purchase_date = document.querySelector<HTMLInputElement>('input[id="inputPurchaseDate"]')!.value
                                    let rawPrice = document.querySelector<HTMLInputElement>('input[id="inputPurchasePrice"]')!.value
                                    console.log(rawQuantity)
                                    console.log(purchase_date)
                                    console.log(rawPrice)
                                    if (!rawQuantity) {
                                        notify("Quantity cannot be empty.", true)
                                        return
                                    }
                                    if (!purchase_date) {
                                        notify("Purchase Date cannot be empty.", true)
                                        return;
                                    }
                                    if (!rawPrice) {
                                        notify("Price cannot be empty.", true)
                                        return;
                                    }

                                    let quantity = parseInt(document.querySelector<HTMLInputElement>('input[id="inputQuantity"]')!.value)
                                    if (currentStock) {
                                        if (quantity > currentStock.quantity) {
                                            notify(`Quantity should be less than ${currentStock.quantity}`, true);
                                            return;
                                        }
                                    }
                                    if (!addingStock) {
                                        quantity = -quantity
                                    }
                                    StockBaseApi.getInstance().createTransaction(
                                        {
                                            instrumentId: currentStock!.instrument_id,
                                            quantity: quantity,
                                            purchase_date: document.querySelector<HTMLInputElement>('input[id="inputPurchaseDate"]')!.value,
                                            price: parseFloat(document.querySelector<HTMLInputElement>('input[id="inputPurchasePrice"]')!.value),
                                        }
                                    ).then((transactionRes) => {
                                        if (!transactionRes.success) {
                                            throw Error("Error");
                                        }
                                        if(addingStock)
                                        { notify("Stock Added", false); }
                                        else
                                        { notify("Stock Sold", false); }
                                        setLoading(false);
                                        setAddingStock(false);
                                        setSearchTerm("");
                                        setSearchResults([]);
                                        updateStocksValue();
                                        setSubmittingForm(false);
                                    }).catch(() => {
                                        notify("Error in adding stock", true);
                                        setLoading(false);
                                        setAddingStock(false);
                                        setSearchTerm("");
                                        setSearchResults([]);
                                        updateStocksValue();
                                        setSubmittingForm(false);
                                    });
                                }}>
                                    {addingStock ? "Add" : "Remove"}
                                </button>
                            </div>
                        </form>
                    </>
                }</>
            }
            <ToastContainer/>
        </div>
    );
}

export default Portfolio
;
