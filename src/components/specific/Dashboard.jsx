import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Link } from "react-router-dom";
import useUserData from "../../hooks/useUserData";
import apiInstance from "../../services/axios";
import moment from "moment";

function Dashboard() {
    const user_id = useUserData()?.user_id;
    const [stats, setStats] = useState([])
    const [posts, setPost] = useState([])
    const [likes, setlikes] = useState(0);
    const [comments, setComment] = useState([])
    const [noti, setNoti] = useState([])
    const fetchDashboardData = async () => {
        try {
            const stats_res = await apiInstance.get(`author/dashboard/stats/${user_id}`);
            setStats(stats_res?.data[0])

            const posts_res = await apiInstance.get(`author/dashboard/post-list/${user_id}/`)
            setPost(posts_res?.data)

            const likedby = posts_res?.data?.reduce((acc, cur) => acc + cur?.likes?.length, 0);
            setlikes(likedby);

            const comment_res = await apiInstance.get(`author/dashboard/comment-list/${user_id}/`)
            setComment(comment_res?.data)

            const noti_res = await apiInstance.get(`author/dashboard/noti-list/${user_id}/`);
            setNoti(noti_res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchDashboardData();
    }, [])

    return (
        <>
            <Header />
            <section className="py-4">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-12">
                            <div className="row g-4">
                                <div className="col-sm-6 col-lg-3">
                                    <div className="card card-body border p-3">
                                        <div className="d-flex align-items-center">
                                            <div className="icon-xl fs-1 p-3 bg-success bg-opacity-10 rounded-3 text-success">
                                                <i className="bi bi-people-fill" />
                                            </div>
                                            <div className="ms-3">
                                                <h3>{stats?.views}</h3>
                                                <h6 className="mb-0">Total Views</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-lg-3">
                                    <div className="card card-body border p-3">
                                        <div className="d-flex align-items-center">
                                            <div className="icon-xl fs-1 p-3 bg-primary bg-opacity-10 rounded-3 text-primary">
                                                <i className="bi bi-file-earmark-text-fill" />
                                            </div>
                                            <div className="ms-3">
                                                <h3>{stats?.posts}</h3>
                                                <h6 className="mb-0">Posts</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-lg-3">
                                    <div className="card card-body border p-3">
                                        <div className="d-flex align-items-center">
                                            <div className="icon-xl fs-1 p-3 bg-danger bg-opacity-10 rounded-3 text-danger">
                                                <i className="bi bi-suit-heart-fill" />
                                            </div>
                                            <div className="ms-3">
                                                <h3>{likes}</h3>
                                                <h6 className="mb-0">Likes</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-lg-3">
                                    <div className="card card-body border p-3">
                                        <div className="d-flex align-items-center">
                                            <div className="icon-xl fs-1 p-3 bg-info bg-opacity-10 rounded-3 text-info">
                                                <i className="bi bi-tag" />
                                            </div>
                                            <div className="ms-3">
                                                <h3>{stats?.bookmarks}</h3>
                                                <h6 className="mb-0">Bookmarks</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-xxl-4">
                            <div className="card border h-100">
                                <div className="card-header border-bottom d-flex justify-content-between align-items-center  p-3">
                                    <h5 className="card-header-title mb-0">Latest Posts</h5>
                                    <div className="dropdown text-end">
                                        <Link to="/posts/">
                                            <i className="bi bi-grid-fill text-danger fas fa-post" title="posts" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="card-body p-3">
                                    <div className="row">
                                        {posts?.slice(0, 3)?.map((p, index) => (
                                            <React.Fragment key={index}>
                                                <div className="col-12">
                                                    <div className="d-flex position-relative">
                                                        <img className="w-60 rounded" src={p?.image} style={{ width: "100px", height: "110px", objectFit: "cover", borderRadius: "10px" }} alt="product" />
                                                        <div className="ms-3">
                                                            <Link to={`/ ${p?.slug}`} className="h6 stretched-link text-decoration-none text-dark">
                                                                {p.title}
                                                            </Link>
                                                            <p className="small mb-0 mt-3">
                                                                <i className="fas fa-calendar me-2"></i>{moment(p.date).format("DD MMM, YYYY")}
                                                            </p>
                                                            <p className="small mb-0">
                                                                <i className="fas fa-eye me-2"></i>{p.view} Views
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr className="my-3" />
                                            </React.Fragment>
                                        ))}


                                    </div>
                                </div>
                                <div className="card-footer border-top text-center p-3">
                                    <Link to="/posts/" className="fw-bold text-decoration-none text-dark">
                                        View all Posts
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xxl-4">
                            <div className="card border h-100">
                                <div className="card-header border-bottom d-flex justify-content-between align-items-center  p-3">
                                    <h5 className="card-header-title mb-0">Recent Comments</h5>
                                    <div className="dropdown text-end">
                                        <Link to={`/comments/`}>
                                            <i className="bi bi-chat-left-quote-fill text-success fa-fw" title={"comments"} />
                                        </Link>
                                    </div>
                                </div>
                                <div className="card-body p-3">
                                    <div className="row">

                                        {comments?.slice(0, 3)?.map((c, index) => (
                                            <React.Fragment key={index}>
                                                <div className="col-12" >
                                                    <div className="d-flex align-items-center position-relative">
                                                        <div className="avatar avatar-lg flex-shrink-0">
                                                            <img className="avatar-img" src={`${import.meta.env.VITE_API_URL_MEDIA}/image/img4.jpg`} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }} alt="avatar" />
                                                        </div>
                                                        <div className="ms-3">
                                                            <p className="mb-1 h6 stretched-link text-decoration-none text-dark">
                                                                {" "}{c?.comment}{" "}
                                                            </p>
                                                            <div className="d-flex justify-content-between">
                                                                <p className="small mb-0">
                                                                    <i>by</i> <b>{c?.name}</b> <i>on post titled </i>"<b>{c?.post?.title}</b>"
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr className="my-3" />
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>

                                <div className="card-footer border-top text-center p-3">
                                    <Link to="/comments/" className="fw-bold text-decoration-none text-dark">
                                        View all Comments
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xxl-4">
                            <div className="card border h-100">
                                <div className="card-header border-bottom d-flex justify-content-between align-items-center  p-3">
                                    <h5 className="card-header-title mb-0">Notifications</h5>
                                    <div className="dropdown text-end">
                                        <Link className="btn border-0 p-0 mb-0" to={`/notifications/`} title={`notifications`}>
                                            <i className="fas fa-bell text-warning fa-fw" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="card-body p-3">
                                    <div className="custom-scrollbar h-350">
                                        <div className="row">
                                            {noti?.slice(0, 3)?.map((n, index) => (
                                                <React.Fragment key={index}>
                                                    <div className="col-12">
                                                        <div className="d-flex justify-content-between position-relative">
                                                            <div className="d-sm-flex">
                                                                <div className="icon-lg bg-opacity-15 rounded-2 flex-shrink-0">
                                                                    {
                                                                        n?.type === "Like" ? (<i className="fas fa-thumbs-up text-primary fs-5" />) : (<></>)
                                                                    }
                                                                    {
                                                                        n?.type === "Reply" ? (<i className="fas fa-reply text-primary fs-5" />) : (<></>)
                                                                    }
                                                                    {
                                                                        n?.type === "Comment" ? (<i className="fas fa-comment text-success fs-5" />) : (<></>)
                                                                    }
                                                                    {
                                                                        n?.type === "Bookmark" ? (<i className="fas fa-bookmark text-danger fs-5" />) : (<></>)
                                                                    }
                                                                    {
                                                                        n?.type === "New Post" ? (<i className="fas fa-plus text-danger fs-5" />) : (<></>)
                                                                    }
                                                                </div>
                                                                <div className="ms-0 ms-sm-3 mt-2 mt-sm-0">
                                                                    <h6 className="mb-0">{n?.type}</h6>
                                                                    <p className="stretched-link text-decoration-none text-dark fw-bold">

                                                                    </p>
                                                                    <p className="mb-0">
                                                                        {n?.type === "Like" && (<>Someone liked your post <b>{n?.post?.title?.slice(0, 30)}...</b></>)}
                                                                    </p>
                                                                    <span className="small">{moment(n.date).format("DD MMM YYYY")}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr className="my-3" />
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer border-top text-center p-3">
                                    <a href="/notifications/" className="fw-bold text-decoration-none text-dark">
                                        View all Notifications
                                    </a>
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

export default Dashboard;
