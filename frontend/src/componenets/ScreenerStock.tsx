import React, { useEffect, useState } from "react";
import { StockBaseApi } from "../services/StockBaseApi";
import { Stock } from "../models/stockBaseApi/Response";
import { useParams } from "react-router-dom";
import '../index.css';


export interface StockInfoItemInterface {
    name: string;
    value: string;
    prefix?: string;
    suffix?: string;
}

const StockInfoItem: React.FC<StockInfoItemInterface> = ({ name, prefix, suffix, value }) => {
    return (
        <li className="list-group-item">{name}
            <span className="align-right" id={name}>
                {value === '' || value === '0' || value === null || value === undefined ?
                    'N/A' :
                    `${prefix ? prefix + ' ' : ''}${value}${suffix ? ' ' + suffix : ''}`
                }
            </span>
        </li>
    );
}

const ScreenerStock: React.FC = () => {
    const stockId = useParams().stockId
    const [stockInfo, setStockInfo] = useState<Stock>({
        instrumentId: '',
        stockType: '',
        prevClose: 0,
        dayHigh: 0,
        dayLow: 0,
        high52weeks: 0,
        low52weeks: 0,
        dividendYield: 0,
        faceValue: 0,
        bookValue: 0,
        pros: '',
        cons: '',
        stockName: '',
        marketCap: 0,
        price: 0,
        PERatio: 0,
        about: ''
    });

    useEffect(() => {
        const fetchStockInfo = async () => {
            if (stockId !== undefined) {
                StockBaseApi.getInstance().getStock(stockId).then(
                    (response) => {
                        if (response.success && response.data) {
                            let stock = response.data
                            setStockInfo({
                                instrumentId: stock.instrumentId,
                                stockType: stock.stockType,
                                prevClose: stock.prevClose,
                                dayHigh: stock.dayHigh,
                                dayLow: stock.dayLow,
                                high52weeks: stock.high52weeks,
                                low52weeks: stock.low52weeks,
                                dividendYield: stock.dividendYield,
                                faceValue: stock.faceValue,
                                bookValue: stock.bookValue,
                                pros: stock.pros,
                                cons: stock.cons,
                                stockName: stock.stockName,
                                marketCap: stock.marketCap,
                                price: stock.price,
                                PERatio: stock.PERatio,
                                about: stock.about
                            });
                        }
                    }
                );
            }
        }
        fetchStockInfo();
    }, []);

    return (

      
        <div className="container safe-area sdsa"> 
            <div className="box-shadow box-border content-container container-details p-2">
                <div className="align company">
                    <div id="company-name-value">
                        <span id="company-name">{stockInfo.stockName}</span>
                        <span id="company-current-value">
                            <i className="fa-solid fa-indian-rupee-sign" /> {stockInfo.price === 0 ? '-' : stockInfo.price}
                        </span>
                        <span id="company-per-loss-profit">
                            {stockInfo.PERatio > 0 ? '' : stockInfo.PERatio}
                            <i className={stockInfo.PERatio >= 0 ? "fa-solid fa-arrow-up" : "fa-solid fa-arrow-down"} />
                            {stockInfo.PERatio === 0 ? ' N/A ' : stockInfo.PERatio}%
                        </span>

                    </div>
                    <a href="/portfolio" className="follow-button-link">
                        <button className="follow-button">Follow</button>
                    </a>
                </div>
                <div className="align company-about">
                    <h4><span className="second-heading">About</span></h4>
                    <div className="content-about-company">
                        {stockInfo.about === '' ? '----------------' : stockInfo.about}
                    </div>
                </div>
                <div className="stats-container">
                    <div className="card" style={{ width: '18rem' }}>
                        <ul className="list-group list-group-flush">
                            <StockInfoItem name={'Stock Type'}
                                value={stockInfo.stockType.toString()}

                            />
                            <StockInfoItem name={'Market Cap'}
                                value={stockInfo.marketCap.toString()}
                                prefix={'₹'} suffix={'Cr'}
                            />
                            <StockInfoItem name={'P/E Ratio'}
                                value={stockInfo.PERatio.toString()}
                                suffix={'%'}
                            />
                            <StockInfoItem name={'Book Value'}
                                value={stockInfo.bookValue.toString()}
                                prefix={'₹'}
                            />
                            
                        </ul>
                    </div>
                    <div className="card" style={{ width: '18rem' }}>
                        <ul className="list-group list-group-flush">
                            <StockInfoItem name={'Current Price'}
                                value={stockInfo.price.toString()}
                                prefix={'₹'}
                            />
                            <StockInfoItem name={'Day High'}
                                value={stockInfo.dayHigh.toString()}
                                prefix={'₹'}
                            />
                            <StockInfoItem name={'Day Low'}
                                value={stockInfo.dayLow.toString()}
                                prefix={'₹'}
                            />
                            <StockInfoItem name={'Previous Close'}
                                value={stockInfo.prevClose.toString()} prefix={'₹'}
                            />
                        </ul>
                    </div>
                </div>

            </div>
            <div className="card company-pro-con" style={{ width: '100%' }}>

                <div className="box-shadow box-border card-group content-container" style={{ width: '100%' }}>
                    <div className="card-body">
                        <h5 className="card-title">Pros</h5>
                        <p className="card-text">
                            {stockInfo.pros === '' ? 'No Pros' : stockInfo.pros}
                        </p>
                    </div>
                </div>

                <div className="box-shadow box-border card-group content-container" style={{ width: '100%' }}>
                    <div className="card-body">
                        <h5 className="card-title">Cons</h5>
                        <p className="card-text">
                            {stockInfo.cons === '' ? 'No Cons' : stockInfo.cons}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    
    )
}

export default ScreenerStock;