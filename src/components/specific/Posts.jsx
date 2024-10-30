import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Link } from "react-router-dom";
import useUserData from "../../hooks/useUserData";
import apiInstance from "../../services/axios";
import moment from "moment";

function Posts() {
    const [posts, setPost] = useState([])
    const user_id = useUserData()?.user_id;
    const fetchPost = async () => {
        try {
            const posts_res = await apiInstance.get(`author/dashboard/post-list/${user_id}/`)
            setPost(posts_res?.data)
        }
        catch (error) {
            console.log(error);
        }
    }
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase()
        if (query === "") {
            fetchPost();
        }
        else {
            const filtered = posts.filter((p) => p.title.toLowerCase().includes(query))
            setPost(filtered);
        }
    }
    const handleDelete = async (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await apiInstance.delete(`author/dashboard/post-delete/${user_id}/${postId}`);
                fetchPost();
            } catch (error) {
                console.error("Error deleting the post:", error);
                alert("Failed to delete post. Please try again.");
            }
        }
    };

    const handleSortChange = (e) => {
        const sortValue = e.target.value
        const sortedPosts = [...posts]
        if (sortValue === "Newest") {
            sortedPosts.sort((a, b) => new Date(b.date) - new Date(a.date))
        }
        else if (sortValue === "Oldest") {
            sortedPosts.sort((a, b) => new Date(a.date) - new Date(b.date))
        }
        setPost(sortedPosts);
    }
    useEffect(() => { fetchPost() }, [])
    return (
        <>
            <Header />
            <section className="py-4">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-12">
                            <div className="card border bg-transparent rounded-3">
                                <div className="card-header bg-transparent border-bottom p-3">
                                    <div className="d-sm-flex justify-content-between align-items-center">
                                        <h5 className="mb-2 mb-sm-0">
                                            Your Posts <span className="badge bg-primary bg-opacity-10 text-primary">{posts?.length}</span>
                                        </h5>
                                        <div className="ms-auto">
                                            <a href="/add-post/" className="btn btn-md btn-primary mb-0 me-2">
                                                <i className="fas fa-plus"></i> Add New
                                            </a>
                                            <a href="/bookmark-post/" className="btn btn-md btn-primary mb-0">
                                                <i className="fas fa-bookmark"></i> Bookmarks
                                            </a>
                                        </div>
                                    </div>


                                </div>
                                <div className="card-body">
                                    <div className="row g-3 align-items-center justify-content-between mb-3">
                                        <div className="col-md-8">
                                            <form className="rounded position-relative">
                                                <input onChange={(e) => handleSearch(e)} className="form-control pe-5 bg-transparent" type="search" placeholder="Search Articles" aria-label="Search" />
                                                <button className="btn bg-transparent border-0 px-2 py-0 position-absolute top-50 end-0 translate-middle-y" type="submit">
                                                    <i className="fas fa-search fs-6 " />
                                                </button>
                                            </form>
                                        </div>
                                        <div className="col-md-3">
                                            <form>
                                                <select onChange={handleSortChange} className="form-select z-index-9 bg-transparent" aria-label=".form-select-sm">
                                                    <option value="">Sort by</option>
                                                    <option value="Newest">Newest</option>
                                                    <option value="Oldest">Oldest</option>
                                                </select>
                                            </form>
                                        </div>
                                    </div>
                                    {/* Search and select END */}
                                    {/* Blog list table START */}
                                    <div className="table-responsive border-0">
                                        <table className="table align-middle p-4 mb-0 table-hover table-shrink">
                                            {/* Table head */}
                                            <thead className="table-dark">
                                                <tr>
                                                    <th scope="col" className="border-0 rounded-start">
                                                        Article Name
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        Views
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        Published Date
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        Category
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="border-0 rounded-end">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="border-top-0">
                                                {posts?.map((p, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <h6 className="mt-2 mt-md-0 mb-0 ">
                                                                <Link to={`/${p?.slug}`} className="text-dark text-decoration-none">
                                                                    {p?.title}
                                                                </Link>
                                                            </h6>
                                                        </td>
                                                        <td>
                                                            <h6 className="mb-0">
                                                                <Link to={`/${p?.slug}`} className="text-dark text-decoration-none">
                                                                    {p?.view} Views
                                                                </Link>
                                                            </h6>
                                                        </td>
                                                        <td>{moment(p.date).format("DD MMM YYYY")}.</td>
                                                        <td>{p?.category?.title}</td>
                                                        <td>
                                                            <span className="badge bg-primary text-white  mb-2">{p?.status}</span>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                {/* <a href="#" className="btn-round mb-0 btn btn-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete">
                                                                    <i className="bi bi-trash" />
                                                                </a> */}
                                                                <button className="btn btn-danger" onClick={() => handleDelete(p?.id)}>
                                                                    <i className="bi bi-trash" />
                                                                </button>
                                                                <Link to={`/edit-post/${user_id}/${p?.id}/`} className="btn btn-primary btn-round mb-0" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit">
                                                                    <i className="bi bi-pencil-square" />
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
            <Footer />
        </>
    );
}

export default Posts;
