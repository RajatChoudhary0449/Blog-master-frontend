import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from '../../assets/logo1.jpg';
import { useAuthStore } from "../../services/store/authStore";
import useUserData from "../../hooks/useUserData";
import apiInstance from "../../services/axios";
function Header() {
    const [isLoggedIn] = useAuthStore((state) => [state.isLoggedIn, state.user])
    const [profilephoto, setprofilephoto] = useState(`${import.meta.env.VITE_API_URL_MEDIA}/image/img3.jpeg`);
    const fetchProfile = () => {
        try {
            apiInstance.get(`user/profile/${useUserData()?.user_id}/`).then((res) => {
                setprofilephoto(res.data.image);
            });
        } catch (error) {

        }
    }
    useEffect(() => {
        if (isLoggedIn())
            fetchProfile();
    }, [])
    return (
        <header className="navbar-dark bg-dark navbar-sticky header-static">
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <img className="navbar-brand-item dark-mode-item" src={logo} style={{ width: "100px", height: "80px" }} alt="logo" />
                    </Link>
                    <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="h6 d-none d-sm-inline-block text-white">Menu</span>
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <div className="nav mt-3 mt-lg-0 px-4 flex-nowrap align-items-center">
                            <div className="nav-item w-100">
                                <form className="rounded position-relative">
                                    <Link to={"/search/"} className="btn bg-transparent border-0 px-2 py-0 position-absolute top-50 end-0 translate-middle-y" type="submit">
                                        <i className="bi bi-search fs-5"> </i>
                                    </Link>
                                </form>
                            </div>
                        </div>
                        <ul className="navbar-nav navbar-nav-scroll ms-auto">
                            <li className="nav-item dropdown">
                                <Link className="nav-link active" to="/">
                                    <i className="fas fa-home"></i>Home
                                </Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link text-white" to="/about/">
                                    <i className="fas fa-info-circle"></i> About
                                </Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link text-white" to="/contact/">
                                    <i className="bi bi-telephone-fill"></i>
                                    Contact
                                </Link>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link text-white" to="/category/">
                                    <i className="fa-solid fa-list"></i> Category
                                </Link>
                            </li>
                            {isLoggedIn() ? (
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle active" href="#" id="pagesMenu" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        {/* User */}
                                        <img src={profilephoto || `${import.meta.env.VITE_API_URL_MEDIA}/image/img3.jpeg`} alt="Profile" style={{ width: "35px", height: "30px", borderRadius: "50%" }} />
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="pagesMenu">
                                        <li>
                                            <Link className="dropdown-item" to="/dashboard/">
                                                <i className="fas fa-chart-line"></i> Dashboard
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to={`/profile/${useUserData().user_id}`}>
                                                <i className="fas fa-address-card"></i> Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/friends/">
                                                <i className="fas fa-handshake"></i> Friends
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/posts/">
                                                <i className="bi bi-grid-fill"></i> Posts
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/comments/">
                                                <i className="bi bi-chat-left-quote-fill"></i> Comments
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/notifications/">
                                                <i className="fas fa-bell"></i> Notifications
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            ) : (<></>)}
                            <li className="nav-item">
                                {isLoggedIn() ? (
                                    <>
                                        <Link to={"/logout/"} className="btn btn-success ms-2" href="dashboard.html">
                                            Logout <i className="fas fa-sign-in-alt"></i>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to={"/register/"} className="btn btn-success" href="dashboard.html">
                                            Register <i className="fas fa-user-plus"></i>
                                        </Link>
                                        <Link to={"/login/"} className="btn btn-success ms-2" href="dashboard.html">
                                            Login <i className="fas fa-sign-in-alt"></i>
                                        </Link>
                                    </>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header >
    );
}

export default Header;
