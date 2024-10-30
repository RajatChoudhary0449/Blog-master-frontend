import React, { useEffect, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Link, Navigate, useNavigate } from "react-router-dom";
import apiInstance from "../../services/axios";
import useUserData from "../../hooks/useUserData";
import Toast from "../../utils/Toast";
import Swal from "sweetalert2";
import "../../styles/AddPost.css"
import { useParams } from "react-router-dom";
function UpdateCategory() {
    const [category, setUpdateCategory] = useState({ image: "", title: "" });
    const [imagePreview, setImagePreview] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const nav = useNavigate();
    const params = useParams();
    const handleUpdateCategoryChange = (event) => {
        setUpdateCategory({
            ...category,
            [event.target.name]: event.target.value,
        });
    };
    const fetchCategory = async () => {
        const response = await apiInstance.get(`post/category/list/`);
        response.data = response.data.filter(c => c.slug === params.slug);
        setUpdateCategory({
            image: response.data[0].image || null,
            title: response.data[0].title || "",
        })
    }
    useEffect(() => {
        fetchCategory();
    }, [])
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        const reader = new FileReader();

        setUpdateCategory({
            ...category,
            image: {
                file: event.target.files[0],
                preview: reader.result,
            },
        });
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        if (selectedFile) {
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleUpdateCategory = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        if (!category.title) {
            Toast("error", "Title is necessary");
            setIsLoading(false);
            return;
        }

        const formdata = new FormData();
        formdata.append("title", category.title);

        if (!category.image.file) {
            const existingImageUrl = category.image; // existing image URL
            const response = await fetch(existingImageUrl);
            const blob = await response.blob(); // Fetch the image as a blob
            formdata.append("image", blob);
        } else {
            formdata.append("image", category.image.file); // Append the new file
        }
        try {
            await apiInstance.patch(`author/dashboard/category-update/${params.slug}`, formdata, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire({
                icon: "success",
                title: "Category Updated successfully.",
            });
            setIsLoading(false);
            nav(`/category/${params.slug}`);

        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
        finally {
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
                            <>
                                <section className="py-4 py-lg-6 bg-primary rounded-3">
                                    <div className="container">
                                        <div className="row">
                                            <div className="offset-lg-1 col-lg-10 col-md-12 col-12">
                                                <div className="d-lg-flex align-items-center justify-content-between">
                                                    <div className="mb-4 mb-lg-0">
                                                        <h1 className="text-white mb-1">Update Blog Category</h1>
                                                        <p className="mb-0 text-white lead">Use the article builder below to write your article.</p>
                                                    </div>
                                                    <div>
                                                        <Link to="/category/" className="btn" style={{ backgroundColor: "white" }}>
                                                            {" "}
                                                            <i className="fas fa-arrow-left"></i> Back to Category
                                                        </Link>
                                                        <button onClick={handleUpdateCategory} className="btn btn-dark ms-2">
                                                            Save Changes <i className="fas fa-check-circle"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <form onSubmit={handleUpdateCategory} className="pb-8 mt-5">
                                    <div className="card mb-3">
                                        {/* Basic Info Section */}
                                        <div className="card-header border-bottom px-4 py-3">
                                            <h4 className="mb-0">Basic Information</h4>
                                        </div>
                                        <div className="card-body">
                                            <label htmlFor="postThumbnail" className="form-label">
                                                Preview
                                            </label>
                                            <img style={{ width: "100%", height: "330px", objectFit: "cover", borderRadius: "10px" }} className="mb-4" src={imagePreview || category.image || "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"} alt="" />
                                            <div className="mb-3">
                                                <label htmlFor="postThumbnail" className="form-label">
                                                    Thumbnail<i className="fas fa-asterisk red-asterisk"></i>
                                                </label>
                                                <input onChange={handleFileChange} name="image" id="postThumbnail" className="form-control" type="file" />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Title<i className="fas fa-asterisk red-asterisk"></i></label>
                                                <input onChange={handleUpdateCategoryChange} name="title" className="form-control" type="text" placeholder="" value={category?.title} />
                                                <small>Write a category title (Max. 60).</small>
                                            </div>

                                        </div>
                                    </div>
                                    {isLoading === true ? (
                                        <button className="btn btn-lg btn-secondary w-100 mt-2" disabled>
                                            Updating Category... <i className="fas fa-spinner fa-spin"></i>
                                        </button>
                                    ) : (
                                        <button className="btn btn-lg btn-success w-100 mt-2" type="submit">
                                            Update Category <i className="fas fa-check-circle"></i>
                                        </button>
                                    )}
                                </form>
                            </>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default UpdateCategory;