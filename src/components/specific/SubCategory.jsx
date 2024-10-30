import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiInstance from '../../services/axios';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Moment from '../../utils/Moment';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../services/store/authStore';
export default function SubCategory() {
    const param = useParams();
    const [posts, setposts] = useState([]);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const [category, setcategory] = useState({});
    const nav = useNavigate();
    const fetchposts = async () => {
        try {
            const response = await apiInstance.get(`post/category/post/${param.slug}`);
            setposts(response.data);
        }
        catch (error) {
            if (error.status === 500) {
                nav("/category");
            }
            console.log(error);
        }
    }
    const fetchcategory = async () => {
        try {
            let response = await apiInstance.get(`post/category/list`);
            response = response?.data?.filter((c) => c.slug === param.slug);
            setcategory(response[0]);
        }
        catch (error) {
            if (error.status === 500) {
                nav("/category");
            }
            console.log(error);
        }
    }
    const postperpage = 4;
    const [page, setpage] = useState(1);
    const [croppedpost, setcroppedpost] = useState(posts.slice(0, Math.min(postperpage, posts.length)));
    useEffect(() => {
        handlepagechange(page);
    }, [posts, page])
    const handlepagechange = (pagenumber) => {
        setpage(pagenumber);
        const firstpost = (postperpage) * (pagenumber - 1);
        const lastpost = Math.min(firstpost + postperpage - 1, posts.length - 1);
        setcroppedpost(posts.slice(firstpost, lastpost + 1));
    }
    const totalPages = Math.ceil(posts.length / postperpage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    useEffect(() => {
        fetchcategory();
        fetchposts();
    }, [])
    return (
        <>
            <Header ></Header>
            <div className="container">
                <div className="row m-4">
                    <div className='col-md-4'></div>
                    <div className="col-md-4">
                        <img
                            src={category?.image}
                            alt={category?.title || 'Category Image'}
                            style={{ height: '35vh', width: '100%', objectFit: 'cover' }}
                        />

                    </div>
                    <div className="col-md-4 d-flex align-items-center justify-content-end">
                        <div className="d-flex align-items-center mb-4">
                            <Link to="/category/" className="btn btn-light d-flex align-items-center me-3 shadow-sm">
                                <i className="fas fa-arrow-left me-2"></i>
                                Back to Categories
                            </Link>
                            <Link to={`/edit-category/${param.slug}`} className="btn btn-primary d-flex align-items-center shadow-sm">
                                <i className="fas fa-edit me-2"></i>
                                Update
                            </Link>
                        </div>
                        {/* <Link to="/category/" className="btn btn-light d-flex align-items-center">
                            <i className="fas fa-arrow-left me-2"></i>
                            Back to Categories
                        </Link>
                        <Link to={`/edit-category`}>Update</Link> */}
                    </div>
                </div>
            </div>
            <section className="p-0">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            {posts.length ? <h2 className="text-start d-block mt-1">Articles 🔥</h2> : (<h2>No articles to show, <span><Link to={isLoggedIn() ? "/add-post/" : "/login/"}>{isLoggedIn() ? "Add" : "Login"}</Link> to {isLoggedIn() ? "watch" : "add"} them
                            </span> </h2>)}

                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-4 pb-0">
                <div className="container">
                    <div className="row">
                        {croppedpost?.map((post, index) => (
                            <div className="col-sm-6 col-lg-3" key={index}>
                                <div className="card mb-4">
                                    <div className="card-fold position-relative">
                                        <img className="card-img" style={{ width: "100%", height: "160px", objectFit: "cover" }} src={post.image} alt="Card image" />
                                    </div>
                                    <div className="card-body px-3 pt-3">
                                        <h4 className="card-title">
                                            <Link to={`/${post.slug}`} className="btn-link text-reset stretched-link fw-bold text-decoration-none">
                                                {post.title.length > 21 ? post.title.substring(0, 21) + "..." : post.title}
                                            </Link>
                                        </h4>
                                        {isLoggedIn() ? (
                                            <>
                                                <button disabled style={{ border: "none", background: "none" }}>
                                                    <i className="fas fa-bookmark text-danger"></i>
                                                </button>
                                                <button disabled style={{ border: "none", background: "none" }}>
                                                    <i className="fas fa-thumbs-up text-primary"></i>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                            </>
                                        )}

                                        <ul className="mt-3 list-style-none" style={{ listStyle: "none" }}>
                                            <li>
                                                <a href="#" className="text-dark text-decoration-none">
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
                                                <i className="fas fa-heart"></i> {post?.like?.length || 0} Likes
                                            </li>
                                            <li className="mt-2">
                                                <i className="fas fa-comment"></i> {post?.comments?.length || 0} Comments
                                            </li>

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='row' style={{ display: totalPages > 0 ? "block" : "none" }}>
                        <nav className="d-flex mt-2">
                            <ul className="pagination">
                                <li className={`page-item  ${page == 1 ? "disabled" : ""}`}>
                                    <button className="page-link text-dark fw-bold me-1 rounded" onClick={() => handlepagechange(page - 1)}>
                                        <i className="fas fa-arrow-left me-2" />
                                        Previous
                                    </button>
                                </li>
                            </ul>
                            <ul className="pagination">
                                {pageNumbers?.map((number) => (
                                    <li key={number} className={`page-item  ${page === number ? "active" : ""}`}>
                                        <button className="page-link text-dark fw-bold rounded" onClick={() => handlepagechange(number)}>{number}</button>
                                    </li>
                                ))}
                            </ul>
                            <ul className="pagination">
                                <li className={`page-item  ${page == totalPages ? "disabled" : ""}`}>
                                    <button className="page-link text-dark fw-bold ms-1 rounded" onClick={() => handlepagechange(page + 1)}>
                                        Next
                                        <i className="fas fa-arrow-right ms-3 " />
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </section >

            <Footer></Footer>
        </>
    )
}
