import React from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { useState } from "react";
import useUserData from "../../hooks/useUserData";
import { useAuthStore } from "../../services/store/authStore";
function Contact() {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const [form, setform] = useState({ name: "", subject: "", message: "" })
    const handleformchange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
        setform({ name: "", subject: "", message: "" })
    }
    return (
        <>
            <Header />
            <section className="mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-9 mx-auto text-center">
                            <h1 className="fw-bold">Contact us</h1>
                        </div>
                    </div>
                </div>
            </section>
            <section className="pt-4">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-9 mx-auto">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20006.952089494294!2d75.7440647400463!3d26.854739084521633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db507b2132c65%3A0x5539e8635be15ea9!2sWard%2027%2C%20Mansarovar%20Sector%206%2C%20Mansarovar%2C%20Jaipur%2C%20Rajasthan%20302020!5e0!3m2!1sen!2sin!4v1730097805402!5m2!1sen!2sin"
                                width="600"
                                height="450"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />

                            <div className="row mt-5">
                                <div className="col-sm-6 mb-5 mb-sm-0">
                                    <h3>Address Informations</h3>
                                    <address>Aryabhata Colony, New sanganer road</address>
                                    <p>
                                        Call:{" "}
                                        <a href="/" className="text-reset">
                                            <u>+123 4567 890 (Toll-free)</u>
                                        </a>
                                    </p>
                                    <p>
                                        Email:{" "}
                                        <a href="mailto:choudharyrajat0449@gmail.com" className="text-reset">
                                            <u>choudharyrajat0449@gmail.com</u>
                                        </a>
                                    </p>
                                    <p>
                                        Support time: Monday to Saturday
                                        <br />
                                        9:30 am to 6:00 pm
                                    </p>
                                </div>
                                <div className="col-sm-6">
                                    <h3>Contact Information </h3>
                                    <p>Get in touch with us to see how we can help you with your query</p>
                                    <address>ABC XYZ</address>
                                    <p>
                                        Call:{" "}
                                        <a href="#" className="text-reset">
                                            <u>+123 4567 890 (Toll-free)</u>
                                        </a>
                                    </p>
                                    <p>
                                        Email:{" "}
                                        <a href="mailto:choudharyrajat0449@gmail.com" className="text-reset">
                                            <u>desphixs@gmail.com</u>
                                        </a>
                                    </p>
                                    <p>
                                        Support time: Monday to Saturday
                                        <br />
                                        9:00 am to 5:30 pm
                                    </p>
                                </div>
                            </div>
                            <hr className="my-5" />
                            <div className="row mb-5">
                                <div className="col-12">
                                    <h2 className="fw-bold">Send us a message</h2>
                                    <p>Please fill in the form below and we will contact you very soon. Your email address will not be published.</p>
                                    {/* Form START */}
                                    <form className="contact-form" id="contact-form" name="contactform" method="POST">
                                        {/* Main form */}
                                        <div className="row">
                                            <div className="col-md-6">
                                                {/* name */}
                                                <div className="mb-3">
                                                    <input required="" id="con-name" name="name" type="text" className="form-control" value={form.name} onChange={handleformchange} placeholder="Name" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                {/* email */}
                                                <div className="mb-3">
                                                    <input required="" id="con-email" name="email" type="email" className="form-control" disabled value={isLoggedIn() ? useUserData().email : ""} placeholder="E-mail" />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                {/* Subject */}
                                                <div className="mb-3">
                                                    <input required="" id="con-subject" name="subject" type="text" className="form-control" value={form.subject} onChange={handleformchange} placeholder="Subject" />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                {/* Message */}
                                                <div className="mb-3">
                                                    <textarea required="" id="con-message" name="message" cols={40} rows={6} className="form-control"
                                                        value={form.message} onChange={handleformchange}
                                                        placeholder="Message" />
                                                </div>
                                            </div>
                                            {/* submit button */}
                                            <div className="col-md-12 text-start">
                                                <button className="btn btn-primary w-100" type="submit" onClick={handleSubmit}>
                                                    Send Message <i className="fas fa-paper-plane"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                    {/* Form END */}
                                </div>
                            </div>
                        </div>{" "}
                        {/* Col END */}
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Contact;
