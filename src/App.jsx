import { Route, Routes, BrowserRouter } from "react-router-dom";
import MainWrapper from "./components/layout/MainWrapper"
import Index from "./components/specific/Index";
import Detail from "./components/specific/Detail"
import Category from "./components/specific/Category";
import About from "./components/specific/About";
import Contact from "./components/specific/Contact";
import Register from "./components/specific/Register";
import Login from "./components/specific/Login";
import Logout from "./components/specific/Logout";
import ForgotPassword from "./components/specific/ForgotPassword";
import CreatePassword from "./components/specific/CreatePassword";
import Dashboard from "./components/specific/Dashboard";
import Posts from "./components/specific/Posts";
import AddPost from "./components/specific/AddPost";
import EditPost from "./components/specific/EditPost";
import Comments from "./components/specific/Comments";
import Notifications from "./components/specific/Notifications";
import Profile from "./components/specific/Profile";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import SubCategory from "./components/specific/SubCategory";
import Bookmark from "./components/specific/Bookmark";
import AddCategory from "./components/specific/AddCategory";
import UpdateCategory from "./components/specific/UpdateCategory";
import Friends from "./components/specific/Friends";
import EditProfile from "./components/specific/Edit-Profile";

function App() {

  return (
    <>
      <BrowserRouter>
        <MainWrapper>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/:slug/" element={<Detail />} />
            <Route path="/category/" element={<Category />} />
            <Route path="/category/:slug" element={<SubCategory />} />

            {/* Authentication */}
            <Route path="/register/" element={<Register />} />
            <Route path="/login/" element={<Login />} />
            <Route path="/logout/" element={<Logout />} />
            <Route path="/forgot-password/" element={<ForgotPassword />} />
            <Route path="/create-password/" element={<CreatePassword />} />
            <Route path="/profile/:id" element={<Profile></Profile>}></Route>
            {/* Dashboard */}
            <Route path="/dashboard" element={<ProtectedRoutes element={<Dashboard />} />} />
            <Route path="/posts" element={<ProtectedRoutes element={<Posts />} />} />
            <Route path="/add-post" element={<ProtectedRoutes element={<AddPost />} />} />
            <Route path="/add-category" element={<ProtectedRoutes element={<AddCategory />} />} />
            <Route path="/edit-category/:slug" element={<ProtectedRoutes element={<UpdateCategory />} />} />
            <Route path="/bookmark-post" element={<ProtectedRoutes element={<Bookmark />} />} />
            <Route path="/edit-post/:user_id/:id" element={<ProtectedRoutes element={<EditPost />} />} />
            {/* <Route path="/profile" element={<ProtectedRoutes element={<Profile />} />} /> */}
            <Route path="/comments" element={<ProtectedRoutes element={<Comments />} />} />
            <Route path="/notifications" element={<ProtectedRoutes element={<Notifications />} />} />
            <Route path="/edit-profile/:id" element={<ProtectedRoutes element={<EditProfile />} />} />
            <Route path="/friends" element={<ProtectedRoutes element={<Friends />} />} />


            {/* Pages */}
            <Route path="/about/" element={<About />} />
            <Route path="/contact/" element={<Contact />} />
          </Routes>
        </MainWrapper>
      </BrowserRouter>
    </>
  )
}

export default App
