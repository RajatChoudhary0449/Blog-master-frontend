import React, { useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { register } from "../../services/auth/auth";
import validator from "validator";
import { useAuthStore } from "../../services/store/authStore";
import "../../styles/Register.css"
function Register() {
    const [biodata, setBioData] = useState({ full_name: "", email: "", password: "", password2: "" })
    const [isloading, setisloading] = useState(false);
    const navigate = useNavigate();
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    if (isLoggedIn()) {
        alert("You are logged in, To continue please logout");
        return (<Navigate to="/dashboard"></Navigate>);
    }
    const handlebiodatachange = (e) => {
        setBioData({
            ...biodata,
            [e.target.name]: e.target.value
        })
    }
    const resetForm = () => {
        setBioData({ full_name: "", email: "", password: "", password2: "" })
    }
    function checkforcapital(str) {
        for (let i = 0; i < str.length; i++) if (str[i] >= 'A' && str[i] <= 'Z') return true;
        return false;
    }
    function checkforsmall(str) {
        for (let i = 0; i < str.length; i++) if (str[i] >= 'a' && str[i] <= 'z') return true;
        return false;
    }
    function checkforspecial(str) {
        for (let i = 0; i < str.length; i++) if (!checkforcapital(str[i]) && !checkforsmall(str[i])) return true;
        return false;
    }
    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validator.isEmail(biodata.email)) {
            alert("Invalid email");
            setBioData({ ...biodata, email: "" });
            document.getElementById("email").focus();
            return;
        }
        if (biodata.password !== biodata.password2) {
            alert("Your password does not matches");
            setBioData({ ...biodata, password: "", password2: "" });
            return;
        }
        if (biodata.password.length < 8) {
            alert("Your password must atleast of 8 letters");
            setBioData({ ...biodata, password: "", password2: "" });
            document.getElementById("password").focus();
            return;
        }
        if (!checkforcapital(biodata.password)) {
            alert("Your password must contain atleast 1 capital letter");
            setBioData({ ...biodata, password: "", password2: "" });
            document.getElementById("password").focus();
            return;
        }
        if (!checkforsmall(biodata.password)) {
            alert("Your password must contain atleast 1 small letter");
            setBioData({ ...biodata, password: "", password2: "" });
            document.getElementById("password").focus();
            return;
        }
        if (!checkforspecial(biodata.password)) {
            alert("Your password must contain atleast 1 special character");
            setBioData({ ...biodata, password: "", password2: "" });
            document.getElementById("password").focus();
            return;
        }
        setisloading(true);
        const { data, error } = await register(biodata.full_name, biodata.email, biodata.password, biodata.password2);
        if (error) {
            console.log(error);
            setisloading(false);
        }
        else {
            navigate("/dashboard");
        }
    }
    return (
        <>
            <Header />
            <section className="container d-flex flex-column vh-100" style={{ marginTop: "80px" }}>
                <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
                    <div className="col-lg-5 col-md-8 py-8 py-xl-0">
                        <div className="card shadow">
                            <div className="card-body p-6">
                                <div className="mb-4">
                                    <h1 className="mb-1 fw-bold">Sign up</h1>
                                    <span className="d-flex justify-content-between align-items-center">
                                        <div>
                                            Already have an account?
                                            <Link to="/login/" className="d-inline ms-1">
                                                Sign In
                                            </Link>
                                        </div>
                                        <button className="eraser-btn btn btn-medium" onClick={resetForm}>
                                            <i className="fas fa-eraser"></i> Clear
                                        </button>
                                    </span>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleRegister} className="needs-validation" noValidate="">
                                    {/* Username */}
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Full Name
                                        </label>
                                        <input type="text" onChange={handlebiodatachange} value={biodata.full_name} id="full_name" className="form-control" name="full_name" placeholder="John Doe" required="" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Email Address
                                        </label>
                                        <input type="email" id="email" className="form-control" onChange={handlebiodatachange} value={biodata.email} name="email" placeholder="johndoe@gmail.com" required="" />
                                    </div>

                                    {/* Password */}
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">
                                            Password
                                        </label>
                                        <input type="password" id="password" className="form-control" onChange={handlebiodatachange} name="password" value={biodata.password} placeholder="**************" required="" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">
                                            Confirm Password
                                        </label>
                                        <input type="password" id="password2" className="form-control" onChange={handlebiodatachange} name="password2" value={biodata.password2} placeholder="**************" required="" />
                                    </div>
                                    <div>
                                        <div className="d-grid">
                                            {isloading === true ? (
                                                <button disabled type="submit" className="btn btn-primary">
                                                    Processing <i className="fas fa-spinner fa-spin"></i>
                                                </button>
                                            ) : (
                                                <button type="submit" className="btn btn-primary">
                                                    Sign Up <i className="fas fa-user-plus"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Register;
