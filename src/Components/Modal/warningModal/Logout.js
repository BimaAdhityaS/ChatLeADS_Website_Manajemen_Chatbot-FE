import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import "./warningModal.css"
import axiosServer from "../../Helper/axiosBackend";

const Logout = ({setIsOpen}) => {
    const { dispatch } = useContext(AuthContext); 

    const handleClick = async (e) => {
        e.preventDefault();
        try{
            await axiosServer.get("/api/auth/logout");
            localStorage.removeItem("_appLogin");
            dispatch({ type: "LOGOUT" });
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="warning_blurBG fade-in">
            <div className="warning_centered">
                <div className="warning_modal">
                    <div className="desc">
                        <p className="S2">Keluar Akun</p>
                        <p className="B3_desc">Anda akan keluar dari website ini, apa anda yakin?</p>
                    </div>
                    <div className="warning_button_ls">
                        <button className="warning_confirm" onClick={handleClick}>Iya</button>
                        <button className="warning_cancel" onClick={() => setIsOpen(false)}>Tidak</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Logout