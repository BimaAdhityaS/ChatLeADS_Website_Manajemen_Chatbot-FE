import Sidebar from "../../Components/Sidebar/Sidebar";
import LogoutModal from "../../Components/Modal/warningModal/Logout";
import UpdateProfile from "../../Components/Modal/normalModal/UpdateProfile";
import ChangePassword from "../../Components/Modal/cautionModal/ChangePassword";
import { Helmet } from "react-helmet";
import { RiFileEditLine } from "react-icons/ri";
import { MdLockOutline } from "react-icons/md";
import { RxExit } from "react-icons/rx";
import './profile.css';
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import dayJS from "dayjs";

const Profile = () => {
    const style = { width: "24px", height: "24px" };
    const [activeModal, setActiveModal] = useState(null); // Track active modal
    const { user } = useContext(AuthContext);

    const formatDate = (dateString) => {
        return dayJS(dateString).format("DD/MM/YYYY HH:mm"); // Format to "DD/MM/YYYY HH:mm"
    };

    return (
        <div>
            <Helmet>
                <title>ChatLeADS</title>
            </Helmet>
            <Sidebar />
            <div className="profile_container">
                <h3>ChatLeADS / Profile</h3>
                <line></line>
                <h4>Detail Akun</h4>
                <p className="B1">Nama : <span className="B2">{user.name}</span></p>
                <p className="B1">Email : <span className="B2">{user.email}</span></p>
                <p className="B1">Role : <span className="B2">{user.role}</span></p>
                <p className="B1">Tanggal Diubah : <span className="B2">{formatDate(user.updatedAt)}</span></p>
                <p className="B1">Tanggal Dibuat : <span className="B2">{formatDate(user.createdAt)}</span></p>
                <button className="button_edit" onClick={() => setActiveModal('updateProfile')}>
                    <RiFileEditLine style={style} />
                    <p className="B1">Ubah data diri</p>
                </button>
                <button className="button_change_password" onClick={() => setActiveModal('changePassword')}>
                    <MdLockOutline style={style} />
                    <p className="B1">Ubah password</p>
                </button>
                <button className="button_logout" onClick={() => setActiveModal('logout')}>
                    <RxExit style={style} />
                    <p className="B1">Keluar</p>
                </button>

                {/* Render the correct modal based on activeModal */}
                {activeModal === 'logout' && <LogoutModal setIsOpen={setActiveModal} />}
                {activeModal === 'updateProfile' && <UpdateProfile setIsOpen={setActiveModal} />}
                {activeModal === 'changePassword' && <ChangePassword setIsOpen={setActiveModal} />}
            </div>
        </div>
    );
}

export default Profile;
