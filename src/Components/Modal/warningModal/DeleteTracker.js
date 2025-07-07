
import "./warningModal.css";
import axiosServer from "../../Helper/axiosBackend";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteTracker = ({ id, setIsOpen, fetchNoToastData }) => {

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axiosServer.delete(`/api/tracker`, {
                data: { sender_id: id }
            });

            toast.success("Percakapan berhasil dihapus", { autoClose: 1000 });

            setTimeout(() => {
                setIsOpen(false);
                fetchNoToastData(); // Refresh data after closing the modal
            }, 1000);
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Error occurred');
        }
    };

    return (
        // <>
        //     <ToastContainer />
            <div className="warning_blurBG fade-in">
                <div className="warning_centered">
                    <div className="warning_modal">
                        <div className="desc">
                            <p className="S2">Penghapusan Percakapan ID_Sender:{id}</p>
                            <p className="B3_desc">Data akan dihapus secara permanen, lanjutkan?</p>
                        </div>
                        <div className="warning_button_ls">
                            <button className="warning_confirm" onClick={handleClick}>Hapus</button>
                            <button className="warning_cancel" onClick={() => setIsOpen(false)}>Batal</button>
                        </div>
                    </div>
                </div>
            </div>
        // </>
    );
};

export default DeleteTracker;
