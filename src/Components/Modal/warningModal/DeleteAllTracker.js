import "./warningModal.css";
import axiosServer from "../../Helper/axiosBackend";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteAllTracker = ({ setIsOpen, fetchNoToastData }) => {
    const handleClick = async (e) => {
        e.preventDefault();
        try {
            //get tracker data
            const data = await axiosServer.get("/api/tracker");
            //if data is empty
            if (!data) return toast.error("Data kosong.");

            await axiosServer.delete(`/api/tracker/all`);

            toast.success("Semua percakapan dihapus.", { autoClose: 1000 });

            setTimeout(() => {
                setIsOpen(false);
                fetchNoToastData();
            }, 1000);
        } catch (err) {
            toast.error(err.response?.data?.msg);
        }
    };

    return (
        // <>
        //     <ToastContainer />
            <div className="warning_blurBG fade-in">
                <div className="warning_centered">
                    <div className="warning_modal">
                        <div className="desc">
                            <p className="S2">Reset Percakapan</p>
                            <p className="B3_desc">Semua data percakapan akan dihapus secara permanen baik kategori normal dan fallback, lanjutkan?</p>
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

export default DeleteAllTracker;
