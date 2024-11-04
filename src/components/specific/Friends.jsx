import React, { useEffect, useState } from 'react'
import Header from '../common/Header'
import Footer from '../common/Footer'
import apiInstance from '../../services/axios'
import useUserData from '../../hooks/useUserData'
import { Link } from 'react-router-dom'
export default function Friends() {
    const user_id = useUserData()?.user_id
    const [suggestions, setsuggestions] = useState([]);
    const [requests_out, setrequests_out] = useState([]);
    const [requests_in, setrequests_in] = useState([]);
    const [followings, setfollowings] = useState([]);
    const [followers, setfollowers] = useState([]);
    const handleSendRequest = async (to_id) => {
        try {
            const res = await apiInstance.patch(`request-send/${user_id}/${to_id}`);
            console.log(res.data);
        }
        catch (error) {
            console.log(error);
        }
        fetchData();
    }

    const acceptrequest = async (from_id) => {
        try {
            const res = await apiInstance.patch(`request-accept/${from_id}/${user_id}`);
            console.log(res.data);
        }
        catch (error) {
            console.log(error);
        }
        fetchData();
    }

    const rejectrequest = async (from_id, to_id = user_id) => {
        try {
            const res = await apiInstance.patch(`request-reject/${from_id}/${to_id}`);
            console.log(res.data);
        }
        catch (error) {
            console.log(error);
        }
        fetchData();
    }

    const friendremove = async (from_id, to_id) => {
        try {
            const res = await apiInstance.patch(`friend-remove/${from_id}/${to_id}`);
            console.log(res.data);
        }
        catch (error) {
            console.log(error);
        }
        fetchData();
    }

    const fetchData = async () => {
        const user = await apiInstance.get(`author/dashboard/${user_id}`);
        const suggestion_res = await apiInstance.get(`suggestions/${user_id}`);
        const follow = await apiInstance.get(`friend-following/${user_id}`);
        const requests_out = user.data.requests_out;
        const requests_in = user.data.requests_in;
        const followings_res = user.data.friends;
        const userssuggestions = [];
        const usersrequestsout = [];
        const usersrequestsin = [];
        const usersfollowerings = [];
        const userfollowers = [];


        if (suggestion_res?.data.length) {
            for (let it of suggestion_res?.data) {
                await apiInstance.get(`user/profile/${it.id}/`).then(res => userssuggestions.push(res.data));
            }
        }
        if (requests_out?.length) {
            for (let it of requests_out) {
                await apiInstance.get(`user/profile/${it.id}/`).then(res => usersrequestsout.push(res.data));
            }
        }
        if (requests_in?.length) {
            for (let it of requests_in) {
                await apiInstance.get(`user/profile/${it.id}/`).then(res => usersrequestsin.push(res.data));
            }
        }
        if (follow?.data?.length) {
            for (let it of follow.data) {
                await apiInstance.get(`user/profile/${it.id}/`).then(res => userfollowers.push(res.data));
            }
        }
        if (followings_res?.length) {
            for (let it of followings_res) {
                await apiInstance.get(`user/profile/${it.id}/`).then(res => usersfollowerings.push(res.data));
            }
        }

        setsuggestions(userssuggestions);
        setrequests_in(usersrequestsin);
        setrequests_out(usersrequestsout);
        setfollowers(userfollowers);
        setfollowings(usersfollowerings);
    }
    useEffect(() => {
        fetchData();
    }, [])
    return (
        <>
            <Header></Header>
            <section className="py-4">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-12">
                            <div className="card border bg-transparent rounded-3">
                                <div className="card-header bg-transparent border-bottom p-3">
                                    <div className="d-sm-flex justify-content-between align-items-center">
                                        <h5 className="mb-2 mb-sm-0">
                                            Friend Suggestions <span className="badge bg-primary bg-opacity-10 text-primary">{suggestions.length}</span>
                                        </h5>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3 align-items-center justify-content-between mb-3">
                                        <div className="col-md-8">

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
                                                        Friend Name
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        Image
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        About
                                                    </th>
                                                    <th scope="col" className="border-0 rounded-end">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="border-top-0">
                                                {suggestions?.map((s, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <h6 className="mt-2 mt-md-0 mb-0 ">
                                                                <Link to={`/profile/${s.id}`} className='text-decoration-none text-black'>
                                                                    {s.full_name}
                                                                </Link>
                                                            </h6>
                                                        </td>
                                                        <td>
                                                            <h6 className="mb-0">
                                                                <img src={s.image} width="100px" height="60px"></img>
                                                            </h6>
                                                        </td>
                                                        <td>
                                                            {s.about ? (s.about) : "No about mentioned yet"}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <button className="btn btn-success" onClick={(e) => handleSendRequest(s.id)}>
                                                                    <i className="fa-solid fa-share-from-square"></i> Send Request
                                                                </button>
                                                                <button className="btn btn-info" >
                                                                    <Link to={`/profile/${s.id}`} className='text-decoration-none text-white'>
                                                                        <i className="fas fa-user" /> View Profile
                                                                    </Link>
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
                        <div className="col-12">
                            <div className="card border bg-transparent rounded-3">
                                <div className="card-header bg-transparent border-bottom p-3">
                                    <div className="d-sm-flex justify-content-between align-items-center">
                                        <h5 className="mb-2 mb-sm-0">
                                            Request Sent <span className="badge bg-primary bg-opacity-10 text-primary">{requests_out.length}</span>
                                        </h5>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3 align-items-center justify-content-between mb-3">
                                        <div className="col-md-8">

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
                                                        Friend Name
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        Image
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        About
                                                    </th>
                                                    <th scope="col" className="border-0 rounded-end">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="border-top-0">
                                                {requests_out?.map((s, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <h6 className="mt-2 mt-md-0 mb-0 ">
                                                                <Link to={`/profile/${s.id}`} className='text-decoration-none text-black'>
                                                                    {s.full_name}
                                                                </Link>
                                                            </h6>
                                                        </td>
                                                        <td>
                                                            <h6 className="mb-0">
                                                                <img src={s.image} width="100px" height="60px"></img>
                                                            </h6>
                                                        </td>
                                                        <td>
                                                            {s.about ? (s.about) : "No about mentioned yet"}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <button className='btn btn-info'>
                                                                    <Link to={`/profile/${s.id}`} className='text-decoration-none text-black'>
                                                                        View Profile
                                                                    </Link>
                                                                </button>
                                                                <button className="btn btn-warning" onClick={() => rejectrequest(user_id, s.id)}>
                                                                    <i className="fas fa-undo" /> Withdraw Request
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
                        <div className="col-12">
                            <div className="card border bg-transparent rounded-3">
                                <div className="card-header bg-transparent border-bottom p-3">
                                    <div className="d-sm-flex justify-content-between align-items-center">
                                        <h5 className="mb-2 mb-sm-0">
                                            Requests Recieved <span className="badge bg-primary bg-opacity-10 text-primary">{requests_in.length}</span>
                                        </h5>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3 align-items-center justify-content-between mb-3">
                                        <div className="col-md-8">

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
                                                        Friend Name
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        Image
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        About
                                                    </th>
                                                    <th scope="col" className="border-0 rounded-end">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="border-top-0">
                                                {requests_in?.map((r, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <h6 className="mt-2 mt-md-0 mb-0 ">
                                                                <Link to={`/profile/${r.id}`} className='text-decoration-none text-black'>
                                                                    {r.full_name}
                                                                </Link>
                                                            </h6>
                                                        </td>
                                                        <td>
                                                            <h6 className="mb-0">
                                                                <img src={r.image} width="100px" height="60px"></img>
                                                            </h6>
                                                        </td>
                                                        <td>
                                                            {r.about ? (r.about) : "No about mentioned yet"}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <button className="btn btn-success" onClick={() => acceptrequest(r.id)} >
                                                                    <i className="fas fa-check" /> Accept Request
                                                                </button>
                                                                <button className="btn btn-danger" onClick={() => rejectrequest(r.id)}>
                                                                    <i className="fas fa-xmark" /> Reject Request
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
                        <div className="col-12">
                            <div className="card border bg-transparent rounded-3">
                                <div className="card-header bg-transparent border-bottom p-3">
                                    <div className="d-sm-flex justify-content-between align-items-center">
                                        <h5 className="mb-2 mb-sm-0">
                                            Followers <span className="badge bg-primary bg-opacity-10 text-primary">{followers.length}</span>
                                        </h5>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive border-0">
                                        <table className="table align-middle p-4 mb-0 table-hover table-shrink">
                                            <thead className="table-dark">
                                                <tr>
                                                    <th scope="col" className="border-0 rounded-start">
                                                        Followers Name
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        Image
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        About
                                                    </th>
                                                    <th scope="col" className="border-0 rounded-end">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="border-top-0">
                                                {followers?.map((f, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <h6 className="mt-2 mt-md-0 mb-0 ">
                                                                <Link to={`/profile/${f.id}`}></Link>
                                                                {f.full_name}
                                                            </h6>
                                                        </td>
                                                        <td>
                                                            <h6 className="mb-0">
                                                                <img src={f.image} width="100px" height="60px"></img>
                                                            </h6>
                                                        </td>
                                                        <td>
                                                            {f.about ? (f.about) : "No about mentioned yet"}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <button className="btn btn-danger" onClick={(e) => friendremove(f.id, user_id)}>
                                                                    <i className="fa-solid fa-trash"></i> Remove Follower
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
                        <div className="col-12">
                            <div className="card border bg-transparent rounded-3">
                                <div className="card-header bg-transparent border-bottom p-3">
                                    <div className="d-sm-flex justify-content-between align-items-center">
                                        <h5 className="mb-2 mb-sm-0">
                                            Following <span className="badge bg-primary bg-opacity-10 text-primary">{followings.length}</span>
                                        </h5>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3 align-items-center justify-content-between mb-3">
                                        <div className="col-md-8">

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
                                                        Following Name
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        Image
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        About
                                                    </th>
                                                    <th scope="col" className="border-0 rounded-end">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="border-top-0">
                                                {followings?.map((f, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <h6 className="mt-2 mt-md-0 mb-0 ">
                                                                {f.full_name}
                                                            </h6>
                                                        </td>
                                                        <td>
                                                            <h6 className="mb-0">
                                                                <img src={f.image} width="100px" height="60px"></img>
                                                            </h6>
                                                        </td>
                                                        <td>
                                                            {f.about ? (f.about) : "No about mentioned yet"}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <button className="btn btn-info" >
                                                                    <Link to={`/profile/${f.id}`} className='text-decoration-none text-white'>
                                                                        <i className="fas fa-user" /> View Profile
                                                                    </Link>
                                                                </button>
                                                                <button className="btn btn-danger" onClick={() => friendremove(user_id, f.id)} >
                                                                    <i className="fas fa-trash" /> Remove Following
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
            <Footer></Footer>
        </>
    )
}
