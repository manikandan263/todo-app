import React, { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from "../Axios/axios.js";
import TokenContext from '../context/TokenContext.js';

function Login() {
    const [formData, setFormData] = useState({});
    const { userToken, tokenDispatch, userDispatch } = useContext(TokenContext);
    const [error, setError] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post("/user/login", formData);
            tokenDispatch({ type: "SET_TOKEN", payload: result.data.token });
            userDispatch({ type: "SET_USER", payload: result.data.user });
            localStorage.setItem("authToken", JSON.stringify(result.data.token));
        } catch (error) {
            console.log(error);
            setError({ message: error.response?.data?.message || "Login failed" });
        }
    };

    const handleGoogleSubmit = () => {
        window.open("http://localhost:8000/auth/google", "_self");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    if (userToken) return <Navigate to="/" />;

    return (
        <div>
            <section className="login-container">
                <div className="px-6 h-full text-gray-800">
                    <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
                        <div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="w-full" alt="Sample" />
                        </div>
                        <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
                            <form onSubmit={handleSubmit}>
                                {error && (
                                    <div className="text-center border-2 border-green-600 p-2 mb-2 rounded-md bg-red-200 shadow-2xl">
                                        {error.message}
                                    </div>
                                )}

                                {/* Email input */}
                                <div className="mb-6">
                                    <input
                                        type="text"
                                        name="email"
                                        onChange={handleChange}
                                        className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white border border-gray-300 rounded transition focus:border-blue-600 focus:outline-none"
                                        placeholder="Email address"
                                    />
                                </div>

                                {/* Password input */}
                                <div className="mb-6">
                                    <input
                                        type="password"
                                        name="password"
                                        onChange={handleChange}
                                        className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white border border-gray-300 rounded transition focus:border-blue-600 focus:outline-none"
                                        placeholder="Password"
                                    />
                                </div>

                                <div className="flex justify-between items-center mb-6">
                                    <Link to="/forgotPassword">Forgot Password?</Link>
                                </div>

                                <div className="text-center lg:text-left flex flex-col gap-3">
                                    <button
                                        type="submit"
                                        className="px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 transition"
                                    >
                                        Login
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleGoogleSubmit}
                                        className="px-7 py-3 bg-red-500 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-red-600 transition"
                                    >
                                        Sign in with Google
                                    </button>

                                    <p className="text-sm font-semibold mt-2 pt-1 mb-0">
                                        Don't have an account?
                                        <Link to="/register" className="text-red-600 hover:text-red-700 ml-2">
                                            Register
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Login;
