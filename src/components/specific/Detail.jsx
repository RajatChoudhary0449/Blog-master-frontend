import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { useParams, useNavigate } from "react-router-dom";
import apiInstance from "../../services/axios";
import Moment from "../../utils/Moment";
import Toast from "../../utils/Toast";
import useUserData from "../../hooks/useUserData";
import { useAuthStore } from "../../services/store/authStore";
import { Link } from "react-router-dom";
function Detail() {
    const [post, setPost] = useState({});
    const [tags, setTags] = useState([]);
    const [like, setlike] = useState(false);
    const [bookmark, setbookmark] = useState(false);
    const [createcomment, setcreatecomment] = useState({ full_name: useUserData() ? useUserData().full_name : "", email: useUserData() ? useUserData().email : "", comment: "" })
    const param = useParams();
    const user_id = useUserData()?.user_id;
    const [image, setimage] = useState(`${import.meta.env.VITE_API_URL_MEDIA}image/img4.jpg`);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const [canreply, setcanreply] = useState(false);
    const [reply, setreply] = useState("");
    const nav = useNavigate();
    const fetchPost = async () => {
        try {
            let response = await apiInstance.get(`post/detail/${param.slug}`)
            response = response.data;
            fetchProfile(response.user.id);
            const likedids = response?.likes?.map(r => r?.id)
            if (likedids.includes(user_id)) {
                setlike(true);
            }
            else {
                setlike(false);
            }
            response.comments = response?.comments.filter(c => (c.post.slug === param.slug));
            setPost(response);
            const tagArray = response?.tags?.split(",")
            if (isLoggedIn()) {
                setcanreply(response.user.id === user_id);
            }
            setTags(tagArray);
        } catch (error) {
            if (error.status === 500) {
                nav("/")
            }
        }
    }
    const fetchProfile = (id) => {
        apiInstance.get(`user/profile/${id}/`).then((res) => {
            setimage(res?.data?.image);
        });
    }
    const fetchbookmarks = async () => {
        const bookmark_res = await apiInstance.get(`author/dashboard/bookmark-list/${user_id}/`)
        const result = bookmark_res.data.find((bm) => (bm.user.id === user_id && bm.post.slug === param.slug));
        setbookmark(result ? true : false);
    }
    useEffect(() => {
        fetchPost();
        if (isLoggedIn())
            fetchbookmarks();
    }, [])

    const handleSubmitReply = async (commentid) => {
        try {
            await apiInstance.post(`author/dashboard/reply-comment/`, { comment_id: commentid, reply: reply });
            fetchPost();
            Toast("success", "Reply sent");
            setreply("");
        } catch (error) {
            console.log(error)
        }
    }
    const handleCreateCommentChange = (e) => {
        let name = e.target.name
        let value = e.target.value
        setcreatecomment({
            ...createcomment, [name]: value
        });
    }
    const handleCreateCommentSubmit = async (e) => {
        e.preventDefault();
        const json = {
            post_id: post?.id,
            name: createcomment.full_name,
            email: createcomment.email,
            comment: createcomment.comment
        }
        try {
            await apiInstance.post(`post/comment-post/`, json);
        } catch (error) {
            console.log(error);
        }
        Toast("success", "Comment Posted");
        fetchPost()
        setcreatecomment({ full_name: useUserData() ? useUserData().full_name : "", email: useUserData() ? useUserData().email : "", comment: "" })
    }
    const handleLikePost = async () => {
        const json = {
            user_id: user_id,
            post_id: post?.id,
        }
        try {
            const response = await apiInstance.post(`post/like-post/`, json)
            Toast("success", response.data.message);
        }
        catch (error) {
            console.log(error)
        }
        fetchPost();
    };
    const handleBookmarkPost = async () => {
        const json = {
            user_id: user_id,
            post_id: post?.id,
        };
        try {
            const response = await apiInstance.post(`post/bookmark-post/`, json);
            fetchPost();
            fetchbookmarks();
            Toast("success", response.data.message);
        } catch (error) {

        }
    }
    return (
        <>
            <Header />
            <section className=" mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <a href={`/category/${post?.category?.slug}`} className="badge bg-primary mb-2 text-decoration-none">
                                <i className="small fw-bold " />
                                {post?.category?.title || "ABC"}
                            </a>
                            <h1 className="text-center">{post.title}</h1>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-0">
                <div className="container position-relative" data-sticky-container="">
                    <div className="row">
                        <div className="col-lg-2">
                            <div className="text-start text-lg-center mb-5" data-sticky="" data-margin-top={80} data-sticky-for={991}>
                                <div className="">
                                    <Link to={`/profile/${post?.user?.id}`} className="h5 fw-bold text-dark text-decoration-none mb-0 d-block">
                                        <div className="avatar avatar-xl">
                                            <img className="avatar-img" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }} src={image} alt="avatar" />
                                        </div>
                                        By {post?.user?.full_name}
                                    </Link>
                                    <a href="#" className="h5 fw-bold text-dark text-decoration-none mt-2 mb-0 d-block">
                                    </a>
                                    <p>{post?.profile?.bio || ""}</p>
                                </div>

                                <hr className="d-none d-lg-block " />

                                <ul className="list-inline list-unstyled">
                                    <li className="list-inline-item d-lg-block my-lg-2 text-start">
                                        <i className="fas fa-calendar"></i> {Moment(post.date)}
                                    </li>
                                    <li className="list-inline-item d-lg-block my-lg-2 text-start">
                                        <a href="#" className="text-body">
                                            <i className="fas fa-heart me-1" />
                                        </a>
                                        {post?.likes?.length} Likes
                                    </li>
                                    <li className="list-inline-item d-lg-block my-lg-2 text-start">
                                        <i className="fas fa-eye" />
                                        {post.view} Views
                                    </li>
                                </ul>
                                {/* Tags */}
                                <ul className="list-inline text-primary-hover mt-0 mt-lg-3 text-start">
                                    {tags?.length > 0 ? (
                                        tags?.map((tag, index) => (<li className="list-inline-item" key={index}>
                                            <a className="text-body text-decoration-none fw-bold" href="/" >
                                                #{tag}
                                            </a>
                                        </li>))
                                    ) : (
                                        <p>No tags</p>
                                    )
                                    }
                                </ul>
                                {isLoggedIn() ? (
                                    <>
                                        <button onClick={handleLikePost} title={`${like ? "UnLike" : "Like"}`} className="btn btn-primary me-2"><i className={`fa-${like ? "solid" : "regular"} fa-thumbs-up`}></i>
                                            {post?.likes?.length}
                                        </button>
                                        <button onClick={handleBookmarkPost} title={`${bookmark ? "Unbookmark" : "Bookmark"}`} className="btn btn-danger ms-2"><i className={`fa-${bookmark ? "solid" : "regular"} fa-bookmark`}></i></button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={handleLikePost} disabled className="btn btn-primary me-2"><i className="fa-regular fa-thumbs-up"></i>
                                            {post?.likes?.length}
                                        </button>
                                        <button onClick={handleBookmarkPost} disabled className="btn btn-danger ms-2"><i className="fa-regular fa-bookmark"></i></button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-10 mb-5">
                            <p>
                                {post.description}
                            </p>
                            <hr />

                            <div>
                                <h3>{post?.comments?.length} comments</h3>
                                {post?.comments?.map((c, index) => (
                                    <div className="my-4 d-flex bg-light p-3 mb-3 rounded" key={index}>

                                        <div>
                                            <div className="mb-2">
                                                <h5 className="m-0">{c?.name}</h5>
                                                <span className="me-3 small">{Moment(c?.date)}</span>
                                            </div>
                                            <p className="fw-bold">{c?.comment}</p>
                                            <div className="" style={{ display: canreply ? "block" : "none" }}>
                                                <p className="mt-2">
                                                    <span className="fw-bold me-2">
                                                        Response <i className="fas fa-arrow-right"></i>
                                                    </span>
                                                    {c?.reply || "No reply sent yet"}
                                                </p>
                                                <p>
                                                    <button className="btn btn-outline-secondary" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseExample${c.id.toString()}`} aria-expanded="false" aria-controls="collapseExample">
                                                        Send Response
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
                                            <form>

                                            </form>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {isLoggedIn() ? (
                                <div className="bg-light p-3 rounded">
                                    <h3 className="fw-bold">Leave a comment</h3>
                                    <small>Your email address will not be published. Required fields are marked *</small>
                                    <form className="row g-3 mt-2" onSubmit={handleCreateCommentSubmit}>
                                        <div className="col-md-6">
                                            <label className="form-label">Name *</label>
                                            <input type="text" name="full_name" className="form-control" aria-label="First name" disabled value={createcomment.full_name} onChange={handleCreateCommentChange} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Email *</label>
                                            <input type="email" name="email" className="form-control" value={createcomment.email} disabled onChange={handleCreateCommentChange} />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Write Comment *</label>
                                            <textarea className="form-control" name="comment" rows={4} value={createcomment.comment} onChange={handleCreateCommentChange} />
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="btn btn-primary">
                                                Post comment <i className="fas fa-paper-plane"></i>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
            </section >
            <Footer />
        </>
    );
}

export default Detail;
