import React from "react";
import logo from "../../assets/logo1.jpg";
function Footer() {
    return (
        <footer>
            <div className="row bg-dark py-5 mx-0 card card-header  flex-row align-items-center text-center text-md-start">
                <div className="col-md-5 mb-3 mb-md-0">
                    <div className="text-primary-hover text-white">
                        2019 - 2024{" "}
                        Rajat
                        | All rights reserved
                    </div>
                </div>
                <div className="col-md-3 mb-3 mb-md-0">
                    <img src={logo} style={{ width: "100px", height: "80px" }} alt="footer logo" />
                </div>
                <div className="col-md-4">
                    <ul className="nav text-primary-hover justify-content-center justify-content-md-end">
                        <li className="nav-item">
                            <a className="nav-link text-white px-2 fs-5" href="https://facebook.com/">
                                <i className="fab fa-facebook-square" />
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white px-2 fs-5" href="https://twitter.com/">
                                <i className="fab fa-twitter-square" />
                            </a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link text-white px-2 fs-5" href="https://youtube.com/">
                                <i className="fab fa-youtube-square" />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
