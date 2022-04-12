import React from 'react';

const Tool: React.FC<{ toolName: string, link: string }> = ({toolName, link}) => {
    return (
        <li className="list-inline-item">
            <a href={link}>
                <button className="btn btn-primary btn-lg btn-default" type="button">
                    <span className="network-name">{toolName}</span>
                </button>
            </a>
        </li>
    );
}

const Tools = () => {
    return (
        <section className="text-center content-section" id="tools">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <h2>Tools By StockBase</h2>
                        <ul className="list-inline banner-social-buttons">
                            <Tool toolName="Stock Screener" link="/screener"/>
                            <Tool toolName={"Portfolio Manager"} link={"/portfolio"} />
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Tools;

