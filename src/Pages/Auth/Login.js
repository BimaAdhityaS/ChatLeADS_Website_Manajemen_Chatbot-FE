import logo from '../../Assets/img/logo-chatleads.png';
import {ToastContainer, toast} from 'react-toastify';
import './auth.css';
import 'react-toastify/dist/ReactToastify.css';
import {isEmpty, isEmail} from '../../Components/Helper/Validate';
import axiosServer from '../../Components/Helper/axiosBackend';
import { NavLink } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useState } from 'react';
import { Helmet } from 'react-helmet';

const Login = () => {
    const initialState = {
        email: "",
        password: ""
    }

    const [data, setData] = useState(initialState);
    const { email, password } = data;
    const { dispatch } = useContext(AuthContext);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const activationToken = queryParams.get("ac_token");

        if (activationToken){
            const activateAccount = async () => {
                try {
                    await axiosServer.post("/api/auth/activation", { activation_token : activationToken });
                    toast.success("Akun berhasil diaktivasi, silahkan login.")

                    //refresh page to login
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 500)
                } catch (err) {
                    toast.error(err.response.data.msg)
                }
            }

            activateAccount();
        }
    })

    const handlechange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const login = async (e) => {
        e.preventDefault();
        //check field
        if (isEmpty(email) || isEmpty(password)) {
            return toast.error("Tolong isi semua field.");
        }
        //check email
        if (!isEmail(email)) {
            return toast.error("Email tidak valid");
        }
        try {
            await axiosServer.post("/api/auth/login", { email, password });
            localStorage.setItem("_appLogin", true);
            dispatch({ type: "LOGIN" });
            toast.success("Login berhasil.")
        } catch (err) {
            toast.error(err.response.data.msg,)
        }
    }

    return (
        <>
        <Helmet>
            <title>ChatLeADS</title>
        </Helmet>
            <ToastContainer />
        <div className="login">
            <div>
                <div className="login_image_container">
                    <img src={logo} alt="Foto Logo UPNVJ" />
                    <h2>ChatLeADS</h2>
                    <h5>Sistem Chatbot Bantuan Layanan Informasi LeADS</h5>
                </div>
            </div>
            <div>
                <div className="login_form_container">
                    <h3>LOGIN</h3>
                    <form onSubmit={login}>
                        <label for="Email">
                            <span>Email</span>
                            <div className="input-container">
                                <i className="fa fa-envelope icon"></i>
                                <input type="input" id="email" name="email" placeholder="Email anda" onChange={handlechange}/>
                            </div>
                        </label>
                        <label for="Password">
                            <span>Password</span>
                            <div className="input-container">
                                <i className="fa fa-lock icon"></i>
                                <input type="password" id="password" name="password" placeholder="Password anda" onChange={handlechange}/>
                            </div>
                        </label>
                        <NavLink to="/forgot-password">Lupa Password?</NavLink>
                        <button type="submit">Masuk</button>
                    </form>
                </div>
            </div>
        </div>
        </>
    )
}

export default Login;