import './auth.css';
import logo from '../../Assets/img/logo-chatleads.png';
import { NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosServer from '../../Components/Helper/axiosBackend';
import { useState } from 'react';
import { isEmail, isEmpty } from '../../Components/Helper/Validate';
import { Helmet } from 'react-helmet';

const LupaPassword = () => {
    const initialState = {
        email: ""
    }

    const [data, setData] = useState(initialState);
    const { email } = data;

    const handlechange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const forgotPassword = async (e) => {
        e.preventDefault();
        if (isEmpty(email)) {
            return toast.error("Tolong isi email anda");
        }

        if (!isEmail(email)) {
            return toast.error("Email tidak valid");
        }

        try {
            const res = await axiosServer.post("/api/auth/forgot", { email });
            toast.success(res.data.msg);
        } catch (err) {
            toast.error(err.response.data.msg);
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
                    <div className="login_form_container" onSubmit={forgotPassword}>
                        <h3>Lupa Password?</h3>
                        <p className="B1_forgot">Masukkan email yang terdaftar dengan akun anda dan kami akan mengirim email dengan password baru anda</p>
                        <form>
                            <label for="Email">
                                <span>Email</span>
                                <div className="input-container">
                                    <i className="fa fa-envelope icon"></i>
                                    <input type="text" id="email" name="email" placeholder="Email anda" onChange={handlechange} />
                                </div>
                            </label>
                            <button type="submit">Kirim Email</button>
                            <NavLink to="/" className="a_forgot">Ingat Password?</NavLink>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LupaPassword