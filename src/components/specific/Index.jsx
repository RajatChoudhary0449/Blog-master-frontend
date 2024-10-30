import React, { useState, useEffect } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Link } from "react-router-dom";
import MyCarousel from "./MyCarousel";

import apiInstance from "../../services/axios";
import Moment from "../../utils/Moment"
import '../../styles/index.css';

function Index() {
    const [posts, setPosts] = useState([])
    const [category, setcategory] = useState([]);
    const fetchPosts = async () => {
        try {
            const response_post = await apiInstance.get(`post/lists/`)
            const response_category = await apiInstance.get(`post/category/list`)

            response_post.data = response_post.data.sort((a, b) => ((b?.view || 0) - (a?.view || 0)));
            response_category.data.sort((a, b) => (b.post_count - a.post_count));
            setPosts(response_post.data)
            setcategory(response_category.data)
        }
        catch (error) {
            console.log(error);
        }
    }
    const handlesortchange = (e) => {
        const val = e.target.value;
        const newpost = [...posts];
        if (val === "Newest") {
            newpost.sort((a, b) => (new Date(b.date) - new Date(a.date)));
        }
        else if (val === "Oldest") {
            newpost.sort((a, b) => (new Date(a.date) - new Date(b.date)));
        }
        else if (val === "Title") {
            newpost.sort((a, b) => { return a.title.localeCompare(b.title); });
        }
        else if (val === "Likes") {
            newpost.sort((a, b) => { return ((b?.likes?.length || 0) - (a?.likes?.length || 0)); });
        }
        else if (val === "Views") {
            newpost.sort((a, b) => { return ((b?.view || 0) - (a?.view || 0)); });
        }
        setPosts(newpost);
    }
    useEffect(() => {
        fetchPosts();
    }, []);
    const itemsperpage = 4
    const [curpage, setcurpage] = useState(1);
    const indexoflastitem = curpage * itemsperpage;
    const indexoffirstitem = indexoflastitem - itemsperpage;
    const postItems = posts?.slice(indexoffirstitem, indexoflastitem);
    const totalPages = Math.ceil(posts?.length / itemsperpage)
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
    return (
        <div>
            <Header />
            <div className="container">
                <div className="row m-4">
                    <MyCarousel category={category.length >= 8 ? category.slice(0, 8) : category}></MyCarousel>
                </div>
            </div>


            <section className="p-0">
                <div className="container">
                    <div className="row">
                        <div className="col-md-9">
                            <h2 className="text-start d-block mt-1">Trending Articles 🔥</h2>
                        </div>
                        <div className="col-md-3">
                            <form>
                                <select onChange={handlesortchange} className="form-select z-index-9 bg-transparent" aria-label=".form-select-sm">
                                    <option value="">Sort by</option>
                                    <option value="Newest">Newest</option>
                                    <option value="Oldest">Oldest</option>
                                    <option value="Title">Title</option>
                                    <option value="Views">Views</option>
                                    <option value="Likes">Like</option>
                                </select>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-4 pb-0">
                <div className="container">
                    <div className="row">
                        {postItems?.map((post, index) => (
                            <div className="col-sm-6 col-lg-3" key={index}>
                                <div className="card mb-4">
                                    <div className="card-fold position-relative">
                                        <img className="card-img" style={{ width: "100%", height: "160px", objectFit: "cover" }} src={post.image} alt="Card image" />
                                    </div>
                                    <div className="card-body px-3 pt-3">
                                        <h4 className="card-title">
                                            <Link to={post.slug} className="btn-link text-reset stretched-link fw-bold text-decoration-none">
                                                {post.title.length > 21 ? post.title.substring(0, 21) + "..." : post.title}
                                            </Link>
                                        </h4>
                                        <ul className="mt-3 list-style-none" style={{ listStyle: "none" }}>
                                            <li>
                                                <a href="/" className="text-dark text-decoration-none">
                                                    <i className="fas fa-user"></i> {post?.user?.full_name || "ABC"}
                                                </a>
                                            </li>
                                            <li className="mt-2">
                                                <i className="fas fa-calendar"></i> {Moment(post.date)}
                                            </li>
                                            <li className="mt-2">
                                                <i className="fas fa-eye"></i> {post?.view || 0} Views
                                            </li>
                                            <li className="mt-2">
                                                <i className="fas fa-heart"></i> {post?.likes?.length || 0} Likes
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <nav className="d-flex mt-2">
                        <ul className="pagination">
                            <li className={`page-item  ${curpage == 1 ? "disabled" : ""}`}>
                                <button className="page-link text-dark fw-bold me-1 rounded" onClick={() => setcurpage(curpage - 1)}>
                                    <i className="fas fa-arrow-left me-2" />
                                    Previous
                                </button>
                            </li>
                        </ul>
                        <ul className="pagination">
                            {pageNumbers?.map((number) => (
                                <li key={number} className={`page-item  ${curpage === number ? "active" : ""}`}>
                                    <button className="page-link text-dark fw-bold rounded" onClick={() => setcurpage(number)}>{number}</button>
                                </li>
                            ))}
                        </ul>
                        <ul className="pagination">
                            <li className={`page-item  ${curpage == totalPages ? "disabled" : ""}`}>
                                <button className="page-link text-dark fw-bold ms-1 rounded" onClick={() => setcurpage(curpage + 1)}>
                                    Next
                                    <i className="fas fa-arrow-right ms-3 " />
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </section >

            <section className="bg-light pt-5 pb-5 mb-3 mt-3">
                <div className="container">
                    <div className="row g-0">
                        <div className="col-12 ">
                            <div className="mb-4">
                                <Link to="/category" className="text-decoration-none text-black">
                                    <h2>Categories</h2>
                                </Link>
                            </div>
                            <div className="d-flex flex-wrap justify-content-between">
                                {
                                    category?.map((c, index) => (
                                        <div key={index} className="mt-2">
                                            <Link to={`/category/${c.slug}`} className="text-decoration-none text-black">
                                                <div className="card bg-transparent">
                                                    <img className="card-img" src={c.image} style={{ width: "150px", height: "80px", objectFit: "cover" }} alt="card image" />
                                                    <div className="d-flex flex-column align-items-center mt-3 pb-2">
                                                        <h5 className="mb-0">{c.title}</h5>
                                                        <small>{c.post_count || "0"} Articles</small>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div >
    );
}

export default Index;
