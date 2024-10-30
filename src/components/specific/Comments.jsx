import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Link } from "react-router-dom";
import apiInstance from "../../services/axios";
import useUserData from "../../hooks/useUserData";
import Moment from "../../utils/Moment"
import Toast from "../../utils/Toast"
function Comments() {
    const [comments, setComments] = useState([])
    const [reply, setreply] = useState("")
    const user_id = useUserData().user_id;
    const fetchComments = async () => {
        try {
            const response = await apiInstance.get(`author/dashboard/comment-list/${user_id}/`)
            // console.log(response.data);
            setComments(response?.data);
        } catch (error) {
            console.log(error);
        }
    }
    const handleDelete = async (c_id) => {
        if (window.confirm("Are you sure you want to delete this comment")) {
            try {
                await apiInstance.delete(`author/dashboard/comment-delete/${c_id}/`);
                fetchComments();
            }
            catch (error) {
                console.log(error);
            }
        }

    }
    useEffect(() => {
        fetchComments()
        fetchbookmarkpost();
    }, [])
    const fetchbookmarkpost = async () => {
        await apiInstance.get(`author/dashboard/bookmark-list/${user_id}`)
    }
    const handleSubmitReply = async (commentid) => {
        try {
            await apiInstance.post(`author/dashboard/reply-comment/`, { comment_id: commentid, reply: reply });
            fetchComments();
            Toast("success", "Reply sent");
            setreply("");
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <Header />
            <section className="pt-5 pb-5">
                <div className="container">
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12">
                            {/* Card */}
                            <div className="card mb-4">
                                {/* Card header */}
                                <div className="card-header d-lg-flex align-items-center justify-content-between">
                                    <div className="mb-3 mb-lg-0">
                                        <h3 className="mb-0">Comments</h3>
                                        <span>You have full control to manage the comments on your post.</span>
                                    </div>
                                </div>
                                {/* Card body */}
                                <div className="card-body">
                                    {/* List group */}
                                    <ul className="list-group list-group-flush">
                                        {/* List group item */}
                                        {comments?.map((c, index) => (
                                            <li key={index} className="list-group-item p-4 shadow rounded-3 mb-3">
                                                <div className="d-flex">
                                                    <div className="ms-3 mt-2">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div>
                                                                <h4 className="mb-0">{c.name}</h4>
                                                                <span>{Moment(c.date)}</span>
                                                            </div>
                                                            <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>
                                                                <i className="bi bi-trash" />
                                                            </button>
                                                        </div>
                                                        <div className="mt-2">
                                                            <p className="mt-2">
                                                                <span className="fw-bold me-2">
                                                                    Comment <i className="fas fa-arrow-right"></i>
                                                                </span>
                                                                {c.comment}
                                                            </p>
                                                            <p className="mt-2">
                                                                <span className="fw-bold me-2">
                                                                    on Post titled <i className="fas fa-arrow-right"></i>
                                                                </span>
                                                                <Link to={`/${c.post.slug}`} className="text-decoration-none text-black" title={`/${c.post.slug}`}>
                                                                    {c.post.title}
                                                                </Link>
                                                            </p>
                                                            <p className="mt-2">
                                                                <span className="fw-bold me-2">
                                                                    Response <i className="fas fa-arrow-right"></i>
                                                                </span>
                                                                {c.reply || "No reply sent yet"}
                                                            </p>
                                                            <p>
                                                                <button className="btn btn-outline-secondary" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseExample${c.id.toString()}`} aria-expanded="false" aria-controls="collapseExample">
                                                                    Toggle Response
                                                                </button>
                                                            </p>
                                                            <div className="collapse" id={`collapseExample${c.id.toString()}`}>
                                                                <div className="card card-body">
                                                                    <form onSubmit={(e) => { e.preventDefault() }}>
                                                                        <div className="mb-3">
                                                                            <label htmlFor="exampleInputEmail1" className="form-label">
                                                                                Write Response
                                                                            </label>
                                                                            <textarea name="" id="" cols="30" className="form-control" rows="4" value={reply} onChange={(e) => setreply(e.target.value)}></textarea>
                                                                        </div>

                                                                        <button type="submit" className="btn btn-primary" onClick={() => handleSubmitReply(c.id)}>
                                                                            Send Response <i className="fas fa-paper-plane"> </i>
                                                                        </button>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Comments;
