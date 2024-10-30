import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiInstance from "../../services/axios";
import useUserData from "../../hooks/useUserData";
import Toast from "../../utils/Toast";
import Swal from "sweetalert2";
import "../../styles/AddPost.css"
function EditPost() {
    const [post, setEditPost] = useState({ image: "", title: "", description: "", category: "", tags: "", status: "" });
    const [imagePreview, setImagePreview] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const userId = useUserData()?.user_id;
    const navigate = useNavigate();
    const param = useParams();

    const fetchCategory = async () => {
        if (userId != param.user_id) {
            navigate("/dashboard");
        }
        try {
            const response = await apiInstance.get(`post/category/list/`);
            setCategoryList(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCategory();
        fetchPost();
    }, []);

    const fetchPost = async () => {
        try {
            const response = await apiInstance.get(`author/dashboard/post-detail/${userId}/${param?.id}`);
            setEditPost({
                ...response.data,
                category: response.data.category.id,
                image: response.data.image,
            });
            setImagePreview(response.data.image);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCreatePostChange = (event) => {
        setEditPost({
            ...post,
            [event.target.name]: event.target.value,
        });
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImagePreview(reader.result);
            setEditPost({
                ...post,
                image: {
                    file: selectedFile,
                    preview: reader.result,
                },
            });
        };
        console.log(post);
        if (selectedFile) {
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleCreatePost = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        if (!post.image) {
            Toast("error", "Image is necessary");
            setIsLoading(false);
            return;
        }
        if (!post.title) {
            Toast("error", "Title is necessary");
            setIsLoading(false);
            return;
        }
        if (!post.category) {
            Toast("error", "Category is necessary");
            setIsLoading(false);
            return;
        }
        if (!post.status) {
            Toast("error", "Status is necessary");
            setIsLoading(false);
            return;
        }

        const formdata = new FormData();
        formdata.append("user_id", userId);
        formdata.append("title", post.title);
        formdata.append("image", post.image.file);
        formdata.append("description", post.description);
        formdata.append("tags", post.tags);
        formdata.append("category", post.category);
        formdata.append("post_status", post.status);

        try {
            if (post.category !== -1)
                await apiInstance.patch(`author/dashboard/post-detail/${userId}/${param?.id}`, formdata, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            setIsLoading(false);
            Swal.fire({
                icon: "success",
                title: "Post updated successfully.",
            });
            navigate("/posts/");
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <section className="pt-5 pb-5">
                <div className="container">
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12">
                            <section className="py-4 py-lg-6 bg-primary rounded-3">
                                <div className="container">
                                    <div className="row">
                                        <div className="offset-lg-1 col-lg-10 col-md-12 col-12">
                                            <div className="d-lg-flex align-items-center justify-content-between">
                                                <div className="mb-4 mb-lg-0">
                                                    <h1 className="text-white mb-1">Edit Blog Post</h1>
                                                    <p className="mb-0 text-white lead">Use the article builder below to edit your article.</p>
                                                </div>
                                                <div>
                                                    <Link to="/posts/" className="btn" style={{ backgroundColor: "white" }}>
                                                        <i className="fas fa-arrow-left"></i> Back to Posts
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <form onSubmit={handleCreatePost} className="pb-8 mt-5">
                                <div className="card mb-3">
                                    <div className="card-header border-bottom px-4 py-3">
                                        <h4 className="mb-0">Basic Information</h4>
                                    </div>
                                    <div className="card-body">
                                        <label htmlFor="postThumbnail" className="form-label">Preview</label>
                                        <img style={{ width: "100%", height: "330px", objectFit: "cover", borderRadius: "10px" }} className="mb-4" src={imagePreview} alt="" />
                                        <div className="mb-3">
                                            <label htmlFor="postThumbnail" className="form-label">Thumbnail</label>
                                            <input onChange={handleFileChange} name="image" id="postThumbnail" className="form-control" type="file" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Title<i className="fas fa-asterisk red-asterisk"></i></label>
                                            <input onChange={handleCreatePostChange} value={post?.title} name="title" className="form-control" type="text" placeholder="" />
                                            <small>Write a post title (Max. 60).</small>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Posts category<i className="fas fa-asterisk red-asterisk"></i></label>
                                            <select name="category" value={post.category} onChange={handleCreatePostChange} className="form-select">
                                                <option value="">-------------</option>
                                                {categoryList.map((c, index) => (
                                                    <option key={index} value={c.id}>{c.title}</option>
                                                ))}
                                            </select>
                                            <small>Help people categorize your post.</small>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Post Description</label>
                                            <textarea onChange={handleCreatePostChange} name="description" value={post?.description} className="form-control" cols="30" rows="10"></textarea>
                                            <small>A brief summary of your posts.</small>
                                        </div>
                                        <label className="form-label">Tags</label>
                                        <input onChange={handleCreatePostChange} name="tags" value={post?.tags} className="form-control" type="text" placeholder="health, medicine, fitness" />
                                        <div className="mb-3">
                                            <label className="form-label">Status<i className="fas fa-asterisk red-asterisk"></i></label>
                                            <select onChange={handleCreatePostChange} value={post?.status} name="status" className="form-select">
                                                <option value="">-------</option>
                                                <option value="Active">Active</option>
                                                <option value="Draft">Draft</option>
                                                <option value="Disabled">Disabled</option>
                                            </select>
                                            Help you to keep the status of the post.
                                        </div>
                                    </div>
                                </div>
                                <button className={`btn btn-lg w-100 mt-2 ${isLoading ? "btn-secondary" : "btn-success"}`} type="submit" disabled={isLoading}>
                                    {isLoading ? "Saving Post... " : "Save Changes"} <i className={isLoading ? "fas fa-spinner fa-spin" : "fas fa-check-circle"}></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default EditPost;
