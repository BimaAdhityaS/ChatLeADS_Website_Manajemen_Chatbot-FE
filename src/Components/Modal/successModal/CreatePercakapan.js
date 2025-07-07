import "./successModal.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const CreatePercakapan = ({ setIsOpen, DataPercakapan }) => {
    const [percakapanName, setPercakapanName] = useState("");
    const [percakapanType, setPercakapanType] = useState("rule");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        //if input is empty
        if (percakapanName === "") {
            return toast.error("Nama percakapan tidak boleh kosong");
        }

        //Percakapan harus unik
        const isPercakapanExist = DataPercakapan.some(
            (item) => item.data.name === percakapanName
        );

        if (isPercakapanExist) {
            return toast.error("Nama percakapan harus unik.");
        }


        navigate(`/percakapan/${percakapanType}/${percakapanName}`)
        setIsOpen(false);
    }

    return (
        <>
            <ToastContainer />
            <div className="success_blurBG fade-in">
                <div className="success_blurBG fade-in">
                    <div className="success_centered">
                        <div className="success_modal">
                            <p className="S1">Tambah Percakapan</p>
                            <form className="success_form" onSubmit={handleSubmit}>
                                <label>
                                    <p className="B3">Nama Percakapan<span style={{ color: "red" }}>*</span></p>
                                    <input type="text" name="percakapan_name" placeholder="Nama Percakapan" value={percakapanName} onChange={(e) => {
                                        const noSpaces = e.target.value.replace(/\s/g, "");
                                        setPercakapanName(noSpaces);
                                    }} />
                                </label>
                                <label>
                                    <p className="B3">Tipe Percakapan<span style={{ color: "red" }}>*</span></p>
                                    <select name="percakapan_type" id="percakapan_type" value={percakapanType} onChange={(e) => setPercakapanType(e.target.value)}>
                                        <option value="rule">Rule</option>
                                        <option value="story">Story</option>
                                    </select>
                                </label>
                                <div style={{ display: "flex", gap: "1px", flexDirection: "column" }}>
                                    <p style={{ fontSize: "12px", color: "#9EA2AE" }}>Story : Menangani percakapan yang kompleks dan bervariasi</p>
                                    <p style={{ fontSize: "12px", color: "#9EA2AE" }}>Rule : Menentukan respons yang pasti dan konsisten</p>
                                </div>
                                <div className="success_button_ls">
                                    <button className="success_confirm" type="submit">Tambahkan</button>
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

export default CreatePercakapan;