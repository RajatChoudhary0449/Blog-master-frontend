import { useState, useEffect } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Link } from "react-router-dom";
import apiInstance from "../../services/axios";
import { useAuthStore } from "../../services/store/authStore";
import useUserData from "../../hooks/useUserData";

function Category() {
    const [category, setcategory] = useState([]);
    const [filteredcategory, setfilteredcategory] = useState([]);
    const [likes, setlikes] = useState({});
    const [views, setviews] = useState({});
    const [comments, setcomments] = useState({});
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const categoryperpage = 8;
    const [allpages, setallpages] = useState([]);
    const [page, setpage] = useState(1);
    const user_id = useUserData().user_id
    const [disabled, setdisabled] = useState(true);
    const fetchCategories = async () => {
        const response = await apiInstance.get(`post/category/list`)
        let allpages2 = [];
        for (let i = 1; i <= (response.data.length + categoryperpage - 1) / categoryperpage; i++) {
            allpages2.push(i);
        }
        setallpages(allpages2);
        setpage(1);
        setfilteredcategory(response.data.slice(0, Math.min(response.data.length, categoryperpage)))
        setcategory(response.data);
    };
    const fetchUser = async () => {
        const user = await apiInstance.get(`author/dashboard/${user_id}`);
        console.log(user.data);
        if (user.data.is_superuser) {
            setdisabled(false);
        }
    }
    const handlepagechange = (pagenumber) => {
        setpage(pagenumber);
        setfilteredcategory(category.slice(categoryperpage * (pagenumber - 1), Math.min(category.length, categoryperpage * (pagenumber))));
    }
    useEffect(() => {
        handlepagechange(1);
        if (isLoggedIn())
            fetchUser();
    }, [category])
    const fetchPost = async () => {
        const response = await apiInstance.get(`post/lists`);
        const customized_view = { ...views };
        const customized_likes = { ...likes };
        const customized_comment = { ...comments };
        for (let it of response.data) {
            if (customized_view[it.category.title]) {
                customized_view[it.category.title] += it.views;
                customized_likes[it.category.title] += it.likes.length;
                customized_comment[it.category.title] += it.comments.length;
            }
            else {
                customized_view[it.category.title] = it.view;
                customized_likes[it.category.title] = it.likes.length;
                customized_comment[it.category.title] = it.comments.length;
            }
        }
        setviews(customized_view);
        setlikes(customized_likes);
        setcomments(customized_comment);
    }

    const handleDelete = async (curcategory) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await apiInstance.delete(`author/dashboard/category-delete/${curcategory?.slug}`);
                fetchPost();
                fetchCategories();
            } catch (error) {
                console.error("Error deleting the post:", error);
                alert("Failed to delete post. Please try again.");
            }
        }
    };
    useEffect(() => {
        fetchCategories();
        fetchPost();
        handlepagechange(1);
    }, []);


    const handlechangesort = (e) => {
        const val = e.target.value;
        if (val === "Post_Count") {
            const newcategory = [...category].sort((a, b) => { return b.post_count - a.post_count; });
            setcategory(newcategory);
        }
        else if (val === "Title") {
            const newcategory = [...category].sort((a, b) => { return a.title.localeCompare(b.title); });
            setcategory(newcategory);
        }
        else if (val === "Likes") {
            const newcategory = [...category].sort((a, b) => { return ((likes[b.title] || 0) - (likes[a.title] || 0)); });
            setcategory(newcategory);
        }
        else if (val === "Views") {
            const newcategory = [...category].sort((a, b) => { return ((views[b.title] || 0) - (views[a.title] || 0)); });
            setcategory(newcategory);
        }
        else if (val === "Comments") {
            const newcategory = [...category].sort((a, b) => { return ((comments[b.title] || 0) - (comments[a.title] || 0)); });
            setcategory(newcategory);
        }
        handlepagechange(page);
    }
    return (
        <div>
            <Header />
            <section className="p-0">
                <div className="container">
                    <div className="row g-3 align-items-center justify-content-between mb-3 mt-3">
                        <div className="col-md-8">
                            <h2>
                                <i className="bi bi-grid-fill me-2"></i>
                                <span className="text-start fw-bold">
                                    Categories
                                </span>

                            </h2>
                        </div>
                        <div className="col-md-3">
                            <select className="form-select" aria-label="Sort By" onChange={handlechangesort} defaultValue={""}>
                                <option value="">Sort By</option>
                                <option value="Post_Count" >Post_Count</option>
                                <option value="Title">Title</option>
                                <option value="Likes">Like</option>
                                <option value="Views">View</option>
                                <option value="Comments">Comment</option>
                            </select>
                            <button className="btn btn-sm btn-primary p-2 mt-2" disabled={disabled}>
                                <Link to='/add-category' className="text-white text-decoration-none ">
                                    <i className="fas fa-plus ms-1"></i>Add New
                                </Link>
                            </button>
                            {/* <a href="/add-category/" className="btn btn-sm btn-primary p-2 mt-2" style={{ display: 'flow-root', alignItems: 'center', fontWeight: "bold" }} >
                            </a> */}
                        </div>
                        <h2 className="d-flex align-items-center justify-content-between mt-3">
                            <div className="d-flex align-items-center">
                            </div>
                        </h2>
                    </div>
                </div>
            </section>

            <section className="pt-4 pb-0 mt-4">
                <div className="container">
                    <div className="row">
                        {filteredcategory?.map((c, index) => (
                            <div className="col-sm-6 col-lg-3" key={index}>
                                <div className="card mb-4">
                                    <div className="card-fold position-relative">
                                        <img className="card-img" style={{ width: "100%", height: "160px", objectFit: "cover" }} src={c.image} alt={c.title} />
                                    </div>
                                    <div className="card-body px-3 pt-3">
                                        <h4 className="card-title">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <Link to={`${c.slug}`} className="fw-bold text-decoration-none text-black">
                                                    {c.title?.length > 24 ? c?.title?.slice(0, 24) + "..." : c?.title}
                                                </Link>
                                                <div className="d-flex">
                                                    <Link to={`/edit-category/${c.slug}`} className="me-2">
                                                        <button className="btn btn-primary" disabled={disabled}>
                                                            <i className="bi bi-pencil" />
                                                        </button>
                                                    </Link>
                                                    <button className="btn btn-danger" disabled={disabled} onClick={() => handleDelete(c)}>
                                                        <i className="bi bi-trash" />
                                                    </button>
                                                </div>

                                            </div>
                                        </h4>
                                        <ul className="mt-3 list-style-none" style={{ listStyle: "none" }}>
                                            <li>
                                                <i className="fas fa-solid fa-globe"></i> {c?.post_count} Post{c?.post_count > 1 ? "s" : ""}
                                            </li>
                                            <li className="mt-2">
                                                <i className="fa-solid fa-heart"></i> {likes[c.title] || 0} Likes
                                            </li>
                                            <li className="mt-2">
                                                <i className="fa-solid fa-eye"></i> {views[c.title] || 0} Views
                                            </li>
                                            <li className="mt-2">
                                                <i className="fa-solid fa-comment"></i> {comments[c.title] || 0} Comments
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <nav className="d-flex mt-5">
                        <ul className="pagination">
                            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                                <button className="page-link me-1" onClick={() => handlepagechange(page - 1)}>
                                    <i className="bi bi-arrow-left" />
                                </button>
                            </li>
                        </ul>
                        <ul className="pagination">
                            {allpages.map((number) => (
                                <li key={number} className={`page-item ${page === number ? "active" : ""}`}>
                                    <button className="page-link text-decoration-none text-black" onClick={() => handlepagechange(number)}>
                                        {number}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <ul className="pagination">
                            <li className={`page-item ${page === allpages.at(-1) ? "disabled" : ""}`}>
                                <button className="page-link ms-1" onClick={() => handlepagechange(page + 1)}>
                                    <i className="bi-arrow-right" />
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Category;