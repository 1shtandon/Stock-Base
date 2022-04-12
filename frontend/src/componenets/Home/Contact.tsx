import React from 'react';

const Contact = () => {
    return (
        <section className="text-center content-section" id="contact">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <h2>Contact us</h2>
                        <p>Feel free to Contact Us!</p>
                        <ul className="list-inline banner-social-buttons">
                            <li className="list-inline-item">
                                <button className="btn btn-primary btn-lg btn-default"
                                        type="button"><i className="fa fa-google-plus fa-fw"/>
                                    <span className="network-name">&nbsp;Google+</span>
                                </button>
                            </li>
                            <li className="list-inline-item">
                                <button className="btn btn-primary btn-lg btn-default"
                                        type="button"><i className="fa fa-twitter fa-fw"/><span
                                    className="network-name">&nbsp;Twitter</span>
                                </button>
                            </li>
                            <li className="list-inline-item">
                                <button className="btn btn-primary btn-lg btn-default" type="button">
                                    <i className="fa fa-github fa-fw"/>
                                    <span className="network-name" ><a id="git"href="https://github.com/1shtandon/Stock-Base" target="">&nbsp;github</a></span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact;