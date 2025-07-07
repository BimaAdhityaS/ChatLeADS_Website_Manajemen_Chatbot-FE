import { useContext, useEffect, useState } from "react"
import "./normalModal.css"
import { AuthContext } from "../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axiosServer from "../../Helper/axiosBackend";
import { isEmpty } from "../../Helper/Validate";

const UpdateProfile = ({ setIsOpen }) => {
    const initialState = {
        name: ""
    }

    const [data, setData] = useState(initialState);
    const { name } = data;
    const { user, token, dispatch } = useContext(AuthContext);

    //setData based on default value
    useEffect(() => {
        setData({ name: user.name });
    }, [user.name]);
    

    const handlechange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const updateProfile = async (e) => {
        e.preventDefault();

        //check field
        if (isEmpty(name)) {
            return toast.error("Tolong isi semua field.");
        }

        try{
            await axiosServer.patch("/api/auth/account", {
                name : name ? name : user.name
            }, {
                headers: {Authorization: token}
            })

            //get updated user
            const updatedUser = await axiosServer.get("/api/auth/account", {
                headers: {Authorization: token}
            })
            dispatch({type: "GET_USER", payload: updatedUser.data})

            //success
            toast.success("Data berhasil diubah.", {autoClose: 1000})

            //close modal after 2s
            setTimeout(() => {
                setIsOpen(false)
            }, 1500)
        } catch (err){
            toast.error(err.response.data.msg)
        }
    }


    return (
        <>
            <ToastContainer />
            <div className="normal_blurBG fade-in">
                <div className="normal_centered">
                    <div className="normal_modal">
                        <p className="S1">Ubah Data Diri</p>
                        <form onSubmit={updateProfile} className="normal_form">
                            <label>
                                <p className="B3">Nama Lengkap<span style={{ color: "red" }}>*</span></p>
                                <input type="text" name="name" id="name" defaultValue={user.name} onChange={handlechange} onClick={handlechange}/>
                            </label>
                            <div className="normal_button_ls">
                                <button className="normal_confirm" type="submit">Ubah</button>
                                <button className="normal_cancel" onClick={() => setIsOpen(false)}>Batalkan</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpdateProfile