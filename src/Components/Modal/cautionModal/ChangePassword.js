import { useContext, useState } from "react"
import "./cautionModal.css"
import { AuthContext } from "../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axiosServer from "../../Helper/axiosBackend";

const ChangePassword = ({ setIsOpen }) => {
    const initialState = {
        old_password: "",
        new_password: "",
        conf_password: ""
    }

    const [data, setData] = useState(initialState);
    const { old_password, new_password, conf_password } = data;
    const { token } = useContext(AuthContext);

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }


    const updatePassword = async (e) => {
        e.preventDefault();
        //check field
        if (old_password === "" || new_password === "" || conf_password === "") {
            return toast.error("Tolong isi semua field.");
        }

        //compare new password and confirm password
        if (new_password !== conf_password) {
            return toast.error("Password baru dan konfirmasi password tidak sama.");
        }

        //check password length
        if (new_password.length < 8) {
            return toast.error("Password minimal 8 karakter.");
        }

        try {
            await axiosServer.patch("/api/auth/password", {
                old_password,
                new_password
            }, {
                headers: { Authorization: token }
            })

            //success
            toast.success("Password berhasil diubah.", {autoClose: 1000})

            //close modal after 2s
            setTimeout(() => {
                setIsOpen(false)
            }, 1500)
        } catch (err) {
            toast.error(err.response.data.msg)
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="caution_blurBG fade-in">
                <div className="caution_blurBG fade-in">
                    <div className="caution_centered">
                        <div className="caution_modal">
                            <p className="S1">Ubah Password</p>
                            <form className="caution_form" onSubmit={updatePassword} >
                                <label>
                                    <p className="B3">Password Lama<span style={{ color: "red" }}>*</span></p>
                                    <input type="password" name="old_password" id="old_password" placeholder="********" onChange={handleChange} />
                                </label>
                                <label>
                                    <p className="B3">Password Baru<span style={{ color: "red" }}>*</span></p>
                                    <input type="password" name="new_password" id="new_password" placeholder="********" onChange={handleChange} />
                                </label>
                                <label>
                                    <p className="B3">Konfirmasi Password Baru<span style={{ color: "red" }}>*</span></p>
                                    <input type="password" name="conf_password" id="conf_password" placeholder="********" onChange={handleChange} />
                                </label>
                                <div className="caution_button_ls">
                                    <button className="caution_confirm" type="submit">Ganti Password</button>
                                    <button className="caution_cancel" onClick={() => setIsOpen(false)}>Batalkan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChangePassword;