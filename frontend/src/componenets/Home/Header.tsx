const Header = () => {
    return (
        <header className="masthead" style={{backgroundImage: `url('/static/img/intro-bg.jpg')`}}>
            <div className="intro-body">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto">
                            <h1 className="brand-heading">StockBase</h1>
                            
                            <p className="intro-text">A Portfolio Manager and Stock Screener tool for Investors.</p>
                            <p className="promo-text">KYA AAPKE SCREENER ME PORTFOLIO MANAGER HAI?</p>
                            <a className="btn btn-link btn-circle" role="button" href={"#about"}>
                                <i className="fa fa-angle-double-down animated"/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;