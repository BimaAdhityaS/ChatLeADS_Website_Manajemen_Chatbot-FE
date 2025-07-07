import "./warningModal.css";
import axiosServer from "../../Helper/axiosBackend";
import { ToastContainer, toast } from "react-toastify";

const DeletePercakapan = ({ id, percakapanName, type, setIsOpen, fetchPercakapanData }) => {
    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axiosServer.delete(`/api/${type}/${id}`);

            toast.success('Percakapan berhasil dihapus', {
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
            });

            setTimeout(() => {
                setIsOpen(false);
                fetchPercakapanData();
            }, 1000);
        } catch (err) {
            const status = err.response?.status;
            const data = err.response?.data;

            toast.error(data?.msg);
        }
    }

    return (
        <div className="warning_blurBG fade-in">
            <div className="warning_centered">
                <div className="warning_modal">
                    <div className="desc">
                        <p className="S2">Penghapusan Percakapan: {percakapanName}</p>
                        <p className="B3_desc">Data akan dihapus secara permanen, lanjutkan?</p>
                    </div>
                    <div className="warning_button_ls">
                        <button className="warning_confirm" onClick={handleClick}>Hapus</button>
                        <button className="warning_cancel" onClick={() => setIsOpen(false)}>Batal</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default DeletePercakapan;