import Sidebar from "../../Components/Sidebar/Sidebar";
import { IoMdRefresh } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import "./chatbot.css"
import { useEffect, useState } from "react";
import axiosServer from "../../Components/Helper/axiosBackend";
import { ToastContainer, toast } from "react-toastify";
import DeleteAllTracker from "../../Components/Modal/warningModal/DeleteAllTracker";
import DeleteTracker from "../../Components/Modal/warningModal/DeleteTracker";
import 'react-toastify/dist/ReactToastify.css';
import dayjs from "dayjs";
import Helmet from "react-helmet";
import { useNavigate } from "react-router-dom";

const RiwayatChatbot = () => {
    const [normalData, setNormal] = useState([]);
    const [fallbackData, setFallback] = useState([]);
    const [userData, setUser] = useState([]);
    const [currentPageNormal, setCurrentPageNormal] = useState(1);
    const [currentPageFallback, setCurrentPageFallback] = useState(1);
    const [activeModal, setActiveModal] = useState(null);
    // Search feature
    const [searchNormal, setSearchNormal] = useState("");
    const [searchFallback, setSearchFallback] = useState("");
    const rowsPerPage = 4;
    const navigate = useNavigate();

    const fetchData = async () => {
        // Show a loading toast
        const loadingToast = toast.loading("Memuat data...");

        try {
            // Fetch both data sets concurrently
            const [normalRes, fallbackRes] = await Promise.all([
                axiosServer.get("/api/tracker/normal"),
                axiosServer.get("/api/tracker/fallback")
            ]);

            // Update state with fetched data
            setNormal(normalRes.data.data);
            setFallback(fallbackRes.data.data);

            //if normal and fallback data is empty
            if (normalRes.data.data.length === 0 && fallbackRes.data.data.length === 0) {
                return toast.update(loadingToast, {
                    render: "Data riwayat kosong",
                    type: "info",
                    isLoading: false,
                    autoClose: 1500,
                });
            }

            //if data normal length is 0
            if (normalRes.data.data.length === 0) {
                return toast.update(loadingToast, {
                    render: "Data riwayat normal kosong",
                    type: "info",
                    isLoading: false,
                    autoClose: 1500,
                });
            }

            //if data fallback length is 0
            if (fallbackRes.data.data.length === 0) {
                return toast.update(loadingToast, {
                    render: "Data riwayat fallback kosong",
                    type: "info",
                    isLoading: false,
                    autoClose: 1500,
                });
            }

            //if both data normal and fallback length is 0
            if (normalRes.data.data.length === 0 && fallbackRes.data.data.length === 0) {
                return toast.update(loadingToast, {
                    render: "Data riwayat kosong",
                    type: "info",
                    isLoading: false,
                    autoClose: 1500,
                });
            }

            // Update the toast to success
            toast.update(loadingToast, {
                render: "Data ditampilkan",
                type: "success",
                isLoading: false,
                autoClose: 1500,
            });
        } catch (err) {
            // Update the toast to error
            toast.update(loadingToast, {
                render: `Error: ${err.response?.data?.msg || "Gagal mengambil data"}`,
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    const fetchNoToastData = async () => {
        try {
            // Fetch both data sets concurrently
            const [normalRes, fallbackRes] = await Promise.all([
                axiosServer.get("/api/tracker/normal"),
                axiosServer.get("/api/tracker/fallback"),
            ]);

            // Update state with fetched data
            setNormal(normalRes.data.data);
            setFallback(fallbackRes.data.data);
        } catch (err) {
            console.error(err);
        }
    }

    // Function to handle refresh button
    const handleRefresh = async () => {
        // Show a loading toast while refreshing
        const loadingToast = toast.loading("Memperbarui data...");

        try {
            // Fetch data again
            // Fetch both data sets concurrently
            const [normalRes, fallbackRes] = await Promise.all([
                axiosServer.get("/api/tracker/normal"),
                axiosServer.get("/api/tracker/fallback"),
            ]);

            // Update state with fetched data
            setNormal(normalRes.data.data);
            setFallback(fallbackRes.data.data);

            // Show success toast for refresh completion
            toast.update(loadingToast, {
                render: "Data berhasil di-refresh.",
                type: "success",
                isLoading: false,
                autoClose: 1500,
            });
        } catch (err) {
            // Update the toast to error in case of failure during refresh
            toast.update(loadingToast, {
                render: `Error: ${err.response?.data?.msg || "Gagal melakukan refresh"}`,
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    const handleDetail = (category, id) => {
        navigate(`/riwayat/${category}/${id}`);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const formatDate = (timestamp) => {
        return dayjs.unix(timestamp).format("DD/MM/YYYY HH:mm");
    };

    const handleNormalPageChange = (page) => {
        if (page >= 1 && page <= totalPagesNormal) {
            setCurrentPageNormal(page);
        }
    };

    const handleFallbackPageChange = (page) => {
        if (page >= 1 && page <= totalPagesFallback) {
            setCurrentPageFallback(page);
        }
    };

    const handleSearchNormal = (e) => {
        setSearchNormal(e.target.value);
    };

    const handleSearchFallback = (e) => {
        setSearchFallback(e.target.value);
    }

    const filteredNormalData = normalData.filter((item) => {
        return item.sender_id.toLowerCase().includes(searchNormal.toLowerCase());
    });

    const filteredFallbackData = fallbackData.filter((item) => {
        return item.sender_id.toLowerCase().includes(searchFallback.toLowerCase());
    });

    const totalPagesNormal = Math.ceil(normalData.length / rowsPerPage);
    const paginatedNormalData = filteredNormalData.slice(
        (currentPageNormal - 1) * rowsPerPage,
        currentPageNormal * rowsPerPage
    );

    // Table 2: Fallback Data
    const totalPagesFallback = Math.ceil(fallbackData.length / rowsPerPage);
    const paginatedFallbackData = filteredFallbackData.slice(
        (currentPageFallback - 1) * rowsPerPage,
        currentPageFallback * rowsPerPage
    );

    return (
        <>
            <ToastContainer />
            <Helmet><title>ChatLeADS</title></Helmet>
            <div>
                <Sidebar />
                <div className="tracker_container">
                    <h3>ChatLeADS / Riwayat Chatbot</h3>
                    <line></line>
                    <div className="tracker_button_ls">
                        <button className='button_refresh_tracker' onClick={handleRefresh}>
                            <IoMdRefresh style={{ width: "24px", height: "24px" }} />
                            <p className="B1">Perbarui Riwayat</p>
                        </button>
                        <button className="button_reset_tracker" onClick={() => setActiveModal({ type: 'deleteAllTracker' })}>
                            <FaRegTrashAlt style={{ width: "24px", height: "24px" }} />
                            <p className="B1">Reset Riwayat</p>
                        </button>
                    </div>
                    <h5 style={{ color: "#131927" }}>
                        List Riwayat Percakapan Chatbot Kategori <span style={{ color: "#43B75D" }}>Normal</span>
                    </h5>
                    <div className="tracker_search_container">
                        <input className="tracker_search" type="text" placeholder="Cari percakapan normal..." onChange={handleSearchNormal}></input>
                        <CiSearch className="tracker_search_icon" style={{ width: "24px", height: "24px" }} />
                    </div>
                    <table className="tracker_table">
                        <thead>
                            <tr>
                                <th style={{ textAlign: "center", paddingLeft: "4px" }}>No.</th>
                                <th>User</th>
                                <th>Sumber</th>
                                <th>Tanggal Pesan Terbaru</th>
                                <th>Tanggal Disimpan</th>
                                <th style={{ textAlign: "center", width: "120px" }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedNormalData.map((item, index) => (
                                <tr key={item._id} style={{ backgroundColor: index % 2 === 0 ? "rgba(0, 0, 0, 0.1)" : "white" }}>
                                    <td style={{ textAlign: "center", paddingLeft: "4px" }}>{(currentPageNormal - 1) * rowsPerPage + index + 1}</td>
                                    <td>{item.sender_id}</td>
                                    <td>
                                        <p style={{ color: item.sender_id.includes("pengguna") ? "green" : "blue" }}>
                                            {item.sender_id.includes("pengguna") ? "LeADS" : "ChatLeADS"}
                                        </p>
                                    </td>
                                    <td>
                                        {formatDate(item.latest_event_time)}
                                    </td>
                                    <td>
                                        {/* Getting the first timestamp on the events as create_at*/}
                                        {formatDate(item.events[0].timestamp)}
                                    </td>
                                    <td
                                        style={{
                                            width: "120px",
                                            display: "flex",
                                            flexDirection: "row",
                                            gap: "16px", // Adjusted gap to make it smaller
                                            justifyContent: "center",
                                            alignItems: "center", // Align items properly within the container
                                        }}
                                    >
                                        <MdOutlineRemoveRedEye
                                            style={{
                                                cursor: "pointer",
                                                color: "#0095FF",
                                                width: "24px",
                                                height: "24px",
                                                transition: "color 0.3s ease-in-out",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.color = "#00B4FF"; // Change color on hover
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.color = "#0095FF"; // Reset color
                                            }}
                                            onClick={() => handleDetail('normal', item._id)}
                                        />
                                        <FaRegTrashAlt
                                            style={{
                                                cursor: "pointer",
                                                color: "#EE443F",
                                                width: "24px",
                                                height: "24px",
                                                transition: "color 0.3s ease-in-out",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.color = "#FF6B61"; // Change color on hover
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.color = "#EE443F"; // Reset color
                                            }}
                                            onClick={() => setActiveModal({ type: 'deleteTracker', trackerId: item.sender_id })}
                                        />
                                    </td>
                                </tr>
                            ))}

                            {/* Fill up the remaining rows of normal tracker */}
                            {paginatedNormalData.length < rowsPerPage &&
                                Array.from({ length: rowsPerPage - paginatedNormalData.length }).map((_, idx) => (
                                    <tr key={`placeholder-${idx}`} style={{ backgroundColor: (idx + paginatedNormalData.length) % 2 === 0 ? "rgba(0, 0, 0, 0.1)" : "white" }}>
                                        <td style={{ textAlign: "center" }}>
                                            {idx + paginatedNormalData.length + 1}
                                        </td>
                                        <td colSpan={6} >
                                            ---
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                    {/* Pagination controls for normal table */}
                    <div className="tracker_pagination">
                        <button
                            className="tracker_pagination_btn"
                            onClick={() => handleNormalPageChange(currentPageNormal - 1)}
                            disabled={currentPageNormal === 1}
                        >
                            <FaChevronLeft />
                        </button>
                        {Array.from({ length: totalPagesNormal }).map((_, index) => (
                            <button
                                key={index}
                                className={`tracker_pagination_number ${currentPageNormal === index + 1 ? "active" : ""}`}
                                onClick={() => handleNormalPageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            className="tracker_pagination_btn"
                            onClick={() => handleNormalPageChange(currentPageNormal + 1)}
                            disabled={currentPageNormal === totalPagesNormal}
                        >
                            <FaChevronRight />
                        </button>
                    </div>

                    <h5 style={{ color: "#131927" }}>
                        List Riwayat Percakapan Chatbot Kategori <span style={{ color: "#EE443F" }}>Fallback</span>
                    </h5>

                    <div className="tracker_search_container">
                        <input className="tracker_search" type="text" placeholder="Cari percakapan fallback..." onChange={handleSearchFallback}></input>
                        <CiSearch className="tracker_search_icon" style={{ width: "24px", height: "24px" }} />
                    </div>

                    {/* Table for fallback data */}
                    <table className="tracker_table">
                        <thead>
                            <tr>
                                <th style={{ textAlign: "center", paddingLeft: "4px" }}>No.</th>
                                <th>User</th>
                                <th>Sumber</th>
                                <th>Tanggal Pesan Terbaru</th>
                                <th>Tanggal Disimpan</th>
                                <th style={{ textAlign: "center", width: "120px" }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedFallbackData.map((item, index) => (
                                <tr key={item._id} style={{ backgroundColor: index % 2 === 0 ? "rgba(0, 0, 0, 0.1)" : "white" }}>
                                    <td style={{ textAlign: "center", paddingLeft: "4px" }}>{(currentPageFallback - 1) * rowsPerPage + index + 1}</td>
                                    <td>{item.sender_id}</td>
                                    <td>
                                        <p style={{ color: item.sender_id.includes("pengguna") ? "green" : "blue" }}>
                                            {item.sender_id.includes("pengguna") ? "LeADS" : "ChatLeADS"}
                                        </p>
                                    </td>
                                    <td>
                                        {formatDate(item.latest_event_time)}
                                    </td>
                                    <td>
                                        {formatDate(item.events[0].timestamp)}
                                    </td>
                                    <td
                                        style={{
                                            width: "120px",
                                            display: "flex",
                                            flexDirection: "row",
                                            gap: "16px",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <MdOutlineRemoveRedEye
                                            style={{
                                                cursor: "pointer",
                                                color: "#0095FF",
                                                width: "24px",
                                                height: "24px",
                                                transition: "color 0.3s ease-in-out",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.color = "#00B4FF";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.color = "#0095FF";
                                            }}
                                            onClick={() => handleDetail('fallback', item._id)}
                                        />
                                        <FaRegTrashAlt
                                            style={{
                                                cursor: "pointer",
                                                color: "#EE443F",
                                                width: "24px",
                                                height: "24px",
                                                transition: "color 0.3s ease-in-out",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.color = "#FF6B61";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.color = "#EE443F";
                                            }}
                                            onClick={() => setActiveModal({ type: 'deleteTracker', trackerId: item.sender_id })}
                                        />
                                    </td>
                                </tr>
                            ))}

                            {/* Fill up the remaining rows of fallback tracker */}
                            {paginatedFallbackData.length < rowsPerPage &&
                                Array.from({ length: rowsPerPage - paginatedFallbackData.length }).map((_, idx) => (
                                    <tr key={`placeholder-${idx}`} style={{ backgroundColor: (idx + paginatedFallbackData.length) % 2 === 0 ? "rgba(0, 0, 0, 0.1)" : "white" }}>
                                        <td style={{ textAlign: "center" }}>
                                            {idx + paginatedFallbackData.length + 1}
                                        </td>
                                        <td colSpan={6} >
                                            ---
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                    {/* Pagination controls for fallback table */}
                    <div className="tracker_pagination">
                        <button
                            className="tracker_pagination_btn"
                            onClick={() => handleFallbackPageChange(currentPageFallback - 1)}
                            disabled={currentPageFallback === 1}
                        >
                            <FaChevronLeft />
                        </button>
                        {Array.from({ length: totalPagesFallback }).map((_, index) => (
                            <button
                                key={index}
                                className={`tracker_pagination_number ${currentPageFallback === index + 1 ? "active" : ""}`}
                                onClick={() => handleFallbackPageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            className="tracker_pagination_btn"
                            onClick={() => handleFallbackPageChange(currentPageFallback + 1)}
                            disabled={currentPageFallback === totalPagesFallback}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>

                {activeModal?.type === 'deleteAllTracker' && (
                    <DeleteAllTracker
                        setIsOpen={() => setActiveModal(null)}
                        fetchNoToastData={fetchNoToastData}
                    />
                )}
                {activeModal?.type === 'deleteTracker' && (
                    <DeleteTracker
                        id={activeModal.trackerId}
                        setIsOpen={() => setActiveModal(null)}
                        fetchNoToastData={fetchNoToastData}
                    />
                )}
            </div>
        </>
    );
}

export default RiwayatChatbot;