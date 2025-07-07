import "./successModal.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isEmail, isEmpty, isLength } from "../../Helper/Validate";
import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axiosServer from "../../Helper/axiosBackend";

const InviteUser = ({ setIsOpen }) => {
    const initialState = {
        email: "",
        name: "",
        password: ""
    }
    
    const [data, setData] = useState(initialState);
    const { email, name, password } = data;
    const { token } = useContext(AuthContext)

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const inviteUserSubmit = async (e) => {
        e.preventDefault();
        //check field
        if (isEmpty(email) || isEmpty(name) || isEmpty(password)) {
            return toast.error("Tolong isi semua field.");
        }

        //check email
        if (!isEmail(email)) {
            return toast.error("Email tidak valid.");
        }

        //check password length
        if (password.length <= 8) {
            return toast.error("Password minimal 8 karakter.");
        }

        try {
            await axiosServer.post("/api/auth/invite", {
                name,
                email,
                password
            }, {
                headers: { Authorization: token }
            })

            //success
            toast.success("Undangan berhasil dikirim.")

            //close modal after 2s
            setTimeout(() => {
                setIsOpen(false)
            }, 2000)
        } catch (err) {
            toast.error(err.response.data.msg)
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="success_blurBG fade-in">
                <div className="success_blurBG fade-in">
                    <div className="success_centered">
                        <div className="success_modal">
                            <p className="S1">Undang Anggota Sebagai Admin</p>
                            <form className="success_form" onSubmit={inviteUserSubmit}>
                                <label>
                                    <p className="B3">Email<span style={{ color: "red" }}>*</span></p>
                                    <input type="text" name="email" placeholder="Email" onChange={handleChange}/>
                                </label>
                                <label>
                                    <p className="B3">Nama Lengkap<span style={{ color: "red" }}>*</span></p>
                                    <input type="text" name="name" placeholder="Nama Lengkap" onChange={handleChange}/>
                                </label>
                                <label>
                                    <p className="B3">Password<span style={{ color: "red" }}>*</span></p>
                                    <input type="password" name="password" placeholder="********" onChange={handleChange}/>
                                </label>
                                <div className="success_button_ls">
                                    <button className="success_confirm" type="submit">Undang</button>
                                    <button className="success_cancel" onClick={() => setIsOpen(false)}>Batalkan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InviteUser;