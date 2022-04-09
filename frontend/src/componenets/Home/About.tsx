import React from 'react';

const About = () => {
    return (
        <section className="text-center content-section" id="about">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <h2>About StockBase</h2>


                        <p>A website that lets a user keep track of the values of stocks and portfolio of stocks that
                            the user owns.

                            The system will interact with an external database , which would be the
                            source of stock price data that is external to the system. The user will be able to look at
                            several possible views that
                            the system can display and will be able to build a strong portfolio by adding and removing
                            stock according to the user's
                            choice.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About;