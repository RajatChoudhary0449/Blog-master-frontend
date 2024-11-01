import React, { useState, useEffect } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import apiInstance from "../../services/axios";
import useUserData from "../../hooks/useUserData";
import Toast from "../../utils/Toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../services/store/authStore";
import moment from "moment";
function Profile() {
    const [profileData, setProfileData] = useState({
        image: null,
        full_name: "",
        about: "",
        bio: "",
        facebook: "",
        twitter: "",
        country: "",
    });
    const [userData, setUserData] = useState({});
    const [posts, setPost] = useState([]);
    const userId = useParams()?.id;
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const [disabled, setdisabled] = useState(true);
    const nav = useNavigate();
    const handleDelete = async (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await apiInstance.delete(`author/dashboard/post-delete/${userId}/${postId}`);
                fetchProfile();
            } catch (error) {
                console.error("Error deleting the post:", error);
                alert("Failed to delete post. Please try again.");
            }
        }
    };
    const fetchProfile = async () => {
        if (isLoggedIn() && useUserData().user_id === Number(userId)) {
            setdisabled(false);
        }
        try {
            await apiInstance.get(`user/profile/${userId}/`).then((res) => {
                setProfileData({
                    image: res.data.image || null,
                    full_name: res.data.full_name || "",
                    about: res.data.about || "",
                    bio: res.data.bio || "",
                    facebook: res.data.facebook || "",
                    twitter: res.data.twitter || "",
                    country: res.data.country || "",
                });
            });
            const user = await apiInstance.get(`author/dashboard/${userId}`);
            setUserData(user.data);
            const posts_res = await apiInstance.get(`author/dashboard/post-list/${userId}/`)
            if (!(isLoggedIn() && useUserData().user_id === Number(userId))) {
                posts_res.data = posts_res.data.filter(data => data.status === "Active");
            }
            setPost(posts_res?.data)
            // console.log(user.data);
            // console.log(posts_res.data);
        }
        catch (error) {
            if (error.status === 500) {
                nav("/dashboard");
            }
            console.log(error);
        }
    };
    const handleDeleteProfile = async () => {
        if (window.confirm("Are you sure you want to delete the profile (It will delete all your data permanently)")) {
            try {
                await apiInstance.delete(`user/profile-delete/${userData.id}/`);
                Toast("success", "Profile Deleted Successfully");
                nav("/logout");
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <>
            <Header />
            <section className="pt-5 pb-5">
                <div className="container">
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12">
                            {/* Card */}
                            <div className="card">
                                {/* Card header */}
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h3 className="mb-0">Profile</h3>
                                    <button className="btn btn-warning" disabled={disabled}>
                                        <Link to={`/edit-profile/${userId}`} className="text-decoration-none text-black">
                                            <i className="fas fa-pencil"></i> Edit Profile
                                        </Link>
                                    </button>
                                </div>

                                {/* Card body */}
                                <div className="justify-content-end align-item-right d-flex">
                                    <button className="btn btn-danger p-2 m-3" disabled={disabled} onClick={handleDeleteProfile}>
                                        <i className="bi bi-trash"> Delete Profile</i>
                                    </button>
                                </div>
                                <div className="card-body text-center">
                                    <div className="d-lg-flex align-items-center justify-content-center">
                                        <img
                                            src={profileData?.image}
                                            id="img-uploaded"
                                            className="avatar-xl rounded-circle"
                                            alt="avatar"
                                            style={{
                                                width: "150px",
                                                height: "150px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </div>
                                    <br className="my-5" />
                                    <h2 title={"Name"}>{profileData?.full_name}</h2>
                                    <br></br>
                                    {profileData?.about ? (<h4 title={"About"}>{profileData?.about}</h4>) : (<></>)}
                                    <br></br>
                                    {profileData?.bio ? (<h4 title={"About"}>{profileData?.bio}</h4>) : (<></>)}
                                    <br></br>
                                    {profileData?.country ? (<p>Belongs to {profileData?.country}</p>) : (<></>)}
                                    <br></br>
                                    {profileData?.facebook && <p>You could connect with me at facebook {profileData?.facebook}</p>}
                                    {profileData?.twitter && <p>Its high time to visit Twitter {profileData?.twitter}</p>}
                                </div>

                                {/*Card Header */}
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h3 className="mb-0">Posts</h3>
                                </div>

                                {/* Card body */}
                                <div className="card-body">
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
                                                {posts?.length > 0 ? (posts?.map((p, index) => (
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
                                                                <button className="btn btn-danger" disabled={disabled} onClick={() => handleDelete(p?.id)}>
                                                                    <i className="bi bi-trash" />
                                                                </button>
                                                                <button className="btn btn-primary" disabled={disabled}>
                                                                    <Link to={`/edit-post/${userId}/${p?.id}/`} className="text-white">
                                                                        <i className="bi bi-pencil-square" />
                                                                    </Link>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))) : (<tr>
                                                    <td colSpan="6" className="text-center">No Posts available</td>
                                                </tr>)}

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

export default Profile;