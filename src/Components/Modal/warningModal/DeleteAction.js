import "./warningModal.css";
import axiosServer from "../../Helper/axiosBackend";
import ConflictWarning from "./ConflictWarning";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

const DeleteAction = ({ id, actionName, setIsOpen, fetchActionData }) => {
    const [conflictData, setConflictData] = useState(null);

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axiosServer.delete(`/api/action/${id}`);

            //toast only for 1 sec
            toast.success('Action berhasil dihapus', {
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
            });

            setTimeout(() => {
                setIsOpen(false);
                fetchActionData();
            }, 1000);
        } catch (err) {
            const status = err.response?.status;
            const data = err.response?.data;

            if (status === 412 || (data?.rules || data?.stories)) {
                // Show conflict modal
                setConflictData(data);
            } else {
                toast.error(data?.msg || 'Error occurred');
            }
        }
    };

    if (conflictData) {
        return (
            <ConflictWarning
                data={conflictData}
                onClose={() => setConflictData(null)}
            />
        );
    }

    return (
        <div className="warning_blurBG fade-in">
            <div className="warning_centered">
                <div className="warning_modal">
                    <div className="desc">
                        <p className="S2">Penghapusan Action: {actionName}</p>
                        <p className="B3_desc">Data akan dihapus secara permanen, lanjutkan?</p>
                    </div>
                    <div className="warning_button_ls">
                        <button className="warning_confirm" onClick={handleClick}>Hapus</button>
                        <button className="warning_cancel" onClick={() => setIsOpen(false)}>Batal</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteAction;
