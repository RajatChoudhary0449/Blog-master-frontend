import React, { useEffect, useState } from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import useUserData from '../../hooks/useUserData'
import apiInstance from '../../services/axios'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Toast from "../../utils/Toast";
export default function Bookmark() {
    const [bookmark, setBookmark] = useState([])
    const user_id = useUserData()?.user_id;
    const fetchbookmarks = async () => {
        try {
            const bookmark_res = await apiInstance.get(`author/dashboard/bookmark-list/${user_id}/`)
            bookmark_res.data = bookmark_res?.data.map((cur) => cur.post);
            setBookmark(bookmark_res?.data);
        }
        catch (error) {
            console.log(error);
        }
    }
    const handleSearch = (e) => {
        const cur = e.target.value.toLowerCase();
        if (cur === "") {
            fetchbookmarks();
        }
        else
            setBookmark(bookmark.filter(bm => bm.title.toLowerCase().includes(cur)));
    }
    const handleDelete = async (postId) => {
        if (window.confirm("Are you sure you want to remove this bookmark?")) {
            const json = {
                user_id: user_id,
                post_id: postId,
            };
            try {
                await apiInstance.post(`post/bookmark-post/`, json);
                fetchbookmarks();
                Toast("success", "Deleted successfully");
            } catch (error) {
                console.error("Error deleting the bookmark:", error);
                alert("Failed to delete bookmark. Please try again.");
            }
        }
    };
    useEffect(() => {
        fetchbookmarks();
    }, [])
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
                                            Bookmarks <span className="badge bg-primary bg-opacity-10 text-primary">{bookmark?.length}</span>
                                        </h5>
                                        <a href="/" className="btn btn-sm btn-primary mb-0">
                                            <i className="fas fa-plus"></i> Add New
                                        </a>
                                        <a href="/posts/" className="btn btn-sm btn-info mb-0">
                                            <i className="fas fa-plus"></i> All Posts
                                        </a>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3 align-items-center justify-content-between mb-3">
                                        <div className="col-md-8">
                                            <form className="rounded position-relative">
                                                <input onChange={handleSearch} className="form-control pe-5 bg-transparent" type="search" placeholder="Search Post Title" id="search" aria-label="Search" />
                                                <button className="btn bg-transparent border-0 px-2 py-0 position-absolute top-50 end-0 translate-middle-y" type="submit">
                                                    <i className="fas fa-search fs-6 " />
                                                </button>
                                            </form>
                                        </div>
                                        <div className="col-md-3">
                                            <form>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="table-responsive border-0">
                                        <table className="table align-middle p-4 mb-0 table-hover table-shrink">
                                            <thead className="table-dark">
                                                <tr>
                                                    <th scope="col" className="border-0 rounded-start">
                                                        Post Title
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        Views
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        Published Date
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        Post Description
                                                    </th>
                                                    <th scope="col" className="border-0 rounded-end">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="border-top-0">
                                                {bookmark?.map((p, index) => (
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
                                                        <td>{moment(p?.date).format("DD MMM YYYY")}.</td>
                                                        <td>
                                                            <span className="badge  text-black  mb-2">{p?.description.length > 30 ? p?.description.substring(0, 30) : p?.description}</span>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <button className="btn btn-danger" title="Delete Bookmark" onClick={() => handleDelete(p?.id)}>
                                                                    <i className="bi bi-bookmark" />
                                                                </button>
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
    )
}
