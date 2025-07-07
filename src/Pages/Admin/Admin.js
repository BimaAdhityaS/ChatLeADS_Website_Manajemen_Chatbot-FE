import React, { useContext, useEffect, useState } from 'react';
import Sidebar from "../../Components/Sidebar/Sidebar";
import { Helmet } from "react-helmet";
import { IoIosAdd } from "react-icons/io";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import InviteUser from '../../Components/Modal/successModal/InviteUser';
import './admin.css';
import dayJS from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosServer from '../../Components/Helper/axiosBackend';
import { AuthContext } from '../../context/AuthContext';
import { FaRegTrashAlt } from "react-icons/fa";
import DeleteUser from '../../Components/Modal/warningModal/DeleteUser';

const Admin = () => {
    const style = { width: "24px", height: "24px" };
    const [activeModal, setActiveModal] = useState(null);
    const [data, setData] = useState([]);
    const { token } = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 9;

    const fetchData = async () => {
        try {
            const res = await axiosServer.get("/api/auth/user", {
                headers: { Authorization: token }
            });
            setData(res.data);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || "Ada kesalahan teknis.";
            if (!toast.isActive(errorMsg)) {
                toast.error(errorMsg, { toastId: errorMsg });
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    const formatDate = (dateString) => {
        return dayJS(dateString).format("DD/MM/YYYY HH:mm");
    };

    // Pagination handlers
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <>
            <ToastContainer />
            <div>
                <Helmet>
                    <title>ChatLeADS</title>
                </Helmet>
                <Sidebar />
                <div className='admin_container'>
                    <h3>ChatLeADS / Admin</h3>
                    <line></line>
                    <button className='button_invite' onClick={() => setActiveModal('inviteUser')}>
                        <IoIosAdd style={style} />
                        <p className="B1">Undang Anggota</p>
                    </button>
                    <table className='admin_table'>
                        <thead>
                            <tr>
                                <th style={{ textAlign: "center", paddingLeft: "4px" }}>No.</th>
                                <th>Nama</th>
                                <th>Email</th>
                                <th>Peran</th>
                                <th>Tanggal Diubah</th>
                                <th>Tanggal Dibuat</th>
                                <th style={{ textAlign: "center", width: "120px" }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((item, index) => (
                                <tr
                                    key={item._id}
                                    style={{
                                        backgroundColor: index % 2 === 0 ? "rgba(0, 0, 0, 0.1)" : "white",
                                    }}
                                >
                                    <td style={{ textAlign: "center", paddingLeft: "4px" }}>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.role}</td>
                                    <td>{formatDate(item.updatedAt)}</td>
                                    <td>{formatDate(item.createdAt)}</td>
                                    <td style={{ textAlign: "center", width: "120px" }}>
                                        {/* if the role is SUPER ADMIN cannot be deleted */}
                                        {item.role !== "SUPER ADMIN" && (
                                            <FaRegTrashAlt
                                                style={{
                                                    cursor: "pointer",
                                                    color: "#EE443F",
                                                    width: "24px",
                                                    height: "24px",
                                                    margin: "auto",
                                                    transition: "color 0.3s ease-in-out",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.color = "#FF6B61"; // Change color on hover
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.color = "#EE443F"; // Reset color
                                                }}
                                                onClick={() => setActiveModal({ type: 'deleteUser', userId: item._id })}
                                            />

                                        )}
                                    </td>
                                </tr>
                            ))}
                            {/* Fill up remaining rows */}
                            {paginatedData.length < rowsPerPage &&
                                Array.from({ length: rowsPerPage - paginatedData.length }).map((_, idx) => (
                                    <tr key={`placeholder-${idx}`} style={{ backgroundColor: "#f9f9f9" }}>
                                        <td style={{ backgroundColor: (idx + paginatedData.length) % 2 === 0 ? "rgba(0, 0, 0, 0.1)" : "white", textAlign: "center" }}>
                                            {idx + paginatedData.length + 1}
                                        </td>
                                        <td colSpan={6} style={{ backgroundColor: (idx + paginatedData.length) % 2 === 0 ? "rgba(0, 0, 0, 0.1)" : "white" }}>
                                            ---
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="admin_pagination">
                        <button
                            className="admin_pagination_btn"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <FaChevronLeft />
                        </button>
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                className={`admin_pagination_number ${currentPage === index + 1 ? "active" : ""}`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                            //placeholder button
                        ))}
                        <button
                            className="admin_pagination_btn"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>

                {activeModal === 'inviteUser' && <InviteUser setIsOpen={setActiveModal} />}
                {activeModal?.type === 'deleteUser' && (
                    <DeleteUser
                        id={activeModal.userId}
                        setIsOpen={() => setActiveModal(null)}
                        fetchData={fetchData}  // Pass fetchData to DeleteUser
                    />
                )}
            </div>
        </>
    );
};

export default Admin;