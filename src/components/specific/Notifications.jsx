import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { useNavigate } from "react-router-dom";
import useUserData from "../../hooks/useUserData";
import apiInstance from "../../services/axios";
import Moment from "../../utils/Moment";
import Toast from "../../utils/Toast";
function Notifications() {
    const user_id = useUserData()?.user_id;
    const navigate = useNavigate;
    if (!user_id) navigate(`/login`);
    const [noti, setNoti] = useState([]);
    const fetchNoti = async () => {
        try {
            const noti_res = await apiInstance.get(`author/dashboard/noti-list/${user_id}/`);
            setNoti(noti_res.data);
            console.log(noti_res.data);
        }
        catch (error) {
            console.log(error)
        }
    };
    useEffect(() => {
        fetchNoti();
    }, []);
    const handleMarkNotification = async (noti_id) => {
        try {
            await apiInstance.post(`author/dashboard/noti-mark-seen/`, { noti_id: noti_id })
            fetchNoti()
            Toast("success", "Notification Seen");
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <Header />
            <section className="pt-5 pb-5">
                <div className="container">
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12">
                            <div className="card mb-4">
                                <div className="card-header d-lg-flex align-items-center justify-content-between">
                                    <div className="mb-3 mb-lg-0">
                                        <h3 className="mb-0">Notifications</h3>
                                        <span>Manage all your notifications from here</span>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <ul className="list-group list-group-flush">
                                        {noti?.map((n, index) => (< li className="list-group-item p-4 shadow rounded-3 mt-4" key={index}>
                                            <div className="d-flex">
                                                <div className="ms-3 mt-2">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div>
                                                            {n.type === "Like" && <><h4 className="mb-0 fw-bold">
                                                                <i className="fas fa-thumbs-up text-primary"></i> New Like
                                                            </h4>
                                                                <p className="mt-3">
                                                                    Someone just liked your post <b>{n?.post?.title}</b>
                                                                </p>
                                                            </>}
                                                            {n.type === "Reply" && <><h4 className="mb-0 fw-bold">
                                                                <i className="fas fa-reply text-primary"></i> New Reply
                                                            </h4>
                                                                <p className="mt-3">
                                                                    Someone just replied on your comment <b>{n?.comment?.comment}</b> for the post <b>{n?.post?.title}</b>
                                                                </p>
                                                            </>}
                                                            {n.type === "Comment" && <>
                                                                <h4 className="mb-0 fw-bold">
                                                                    <i className="fas fa-comment text-success"></i> New Comment
                                                                </h4>
                                                                <p className="mt-3">
                                                                    Someone just commented on your post <b>{n?.post?.title}</b>
                                                                </p>
                                                            </>}
                                                            {n.type === "Bookmark" && <>
                                                                <h4 className="mb-0 fw-bold">
                                                                    <i className="fas fa-bookmark text-danger "></i> New Bookmark
                                                                </h4>
                                                                <p className="mt-3">
                                                                    Someone just bookmarked your post <b>{n?.post?.title}</b>
                                                                </p>
                                                            </>}
                                                            {n.type === "New Post" && <>
                                                                <h4 className="mb-0 fw-bold">
                                                                    <i className="fas fa-plus text-danger "></i> New Post
                                                                </h4>
                                                                <p className="mt-3">
                                                                    {n?.post?.user?.full_name} just added a new post
                                                                </p>
                                                            </>}
                                                        </div>
                                                    </div>
                                                    <div className="mt-2">
                                                        <p className="mt-1">
                                                            <span className="me-2 fw-bold">
                                                                Date: <span className="fw-light">{Moment(n?.date)}</span>
                                                            </span>
                                                        </p>
                                                        <p>
                                                            <button onClick={() => handleMarkNotification(n?.id)} className="btn btn-outline-secondary" type="button">
                                                                Mark as Seen <i className="fas fa-check"></i>
                                                            </button>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>))}
                                        {noti?.length < 1 && <p>No notifications yet</p>}
                                    </ul>
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

export default Notifications;
