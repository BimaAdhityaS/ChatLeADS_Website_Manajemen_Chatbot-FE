import Sidebar from "../../Components/Sidebar/Sidebar";
import { Helmet } from "react-helmet";
import { IoIosAdd } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import axiosServer from "../../Components/Helper/axiosBackend";
import { ToastContainer, toast } from "react-toastify";
import DeletePercakapan from "../../Components/Modal/warningModal/DeletePercakapan";
import CreatePercakapan from "../../Components/Modal/successModal/CreatePercakapan";
import { useNavigate } from "react-router-dom";
import './percakapan.css';

const Percakapan = () => {
    const [percakapanData, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [activeModal, setActiveModal] = useState();

    const navigate = useNavigate();

    const fetchData = async () => {
        //show a loading toast
        const loadingToast = toast.loading("Memuat data...");

        try {
            //fetch data from API
            const response = await axiosServer.get('/api/percakapan');

            setData(response.data.percakapan);

            if (response.data.percakapan.length === 0) {
                return toast.update(loadingToast, {
                    render: "Data percakapan kosong",
                    type: "info",
                    isLoading: false,
                    autoClose: 1500,
                });
            }

            //show success toast
            toast.update(loadingToast, {
                render: "Data ditampilkan",
                type: "success",
                isLoading: false,
                autoClose: 1500,
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.update(loadingToast, {
                render: `${error.response?.data?.msg || "Gagal mengambil data"}`,
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    }

    const fetchDataNoToast = async () => {
        try {
            const response = await axiosServer.get('/api/percakapan');
            setData(response.data.percakapan);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error(`${error.response?.data?.msg || "Gagal mengambil data"}`);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    }

    const filteredData = percakapanData.filter(item =>
        item.data.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const showDeletePercakapanModal = (id, name, type) => {
        setActiveModal(
            <DeletePercakapan
                id={id}
                percakapanName={name}
                type={type}
                setIsOpen={setActiveModal}
                fetchPercakapanData={fetchDataNoToast}
            />
        );
    }

    const showCreatePercakapanModal = () => {
        setActiveModal(
            <CreatePercakapan
                setIsOpen={setActiveModal}
                DataPercakapan={percakapanData}
            />
        );
    }

    const handleEditPercakapan = async (id, type, name) => {
        try {
            const response = await axiosServer.get(`/api/percakapan/${id}`);

            navigate(`/percakapan/edit/${type}/${name}`, {
                state: response.data,
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <>
            <Helmet>
                <title>ChatLeADS</title>
            </Helmet>
            <Sidebar />
            <ToastContainer />
            <div className="percakapan_container">
                <h3>ChatLeADS / Percakapan</h3>
                <line></line>
                <div className="first_container">
                    <button className='button_create_percakapan' onClick={showCreatePercakapanModal}>
                        <IoIosAdd style={{ color: "white", width: "24px", height: "24px" }} />
                        <p className="B1">Tambah Percakapan</p>
                    </button>
                    <div className="percakapan_search_container">
                        <input className="percakapan_search" type="text" placeholder="Cari percakapan"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <CiSearch className="percakapan_search_icon" style={{ width: "24px", height: "24px" }} />
                    </div>
                </div>

                <div className="percakapan_table_container">
                    <table className="percakapan_table">
                        <thead>
                            <tr>
                                <th>Nama Percakapan</th>
                                <th>Tipe</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item) => (
                                    <tr key={item.data.id}>
                                        <td>{item.data.name}</td>
                                        <td>{item.type}</td>
                                        <td>
                                            <div className="action_buttons">
                                                <button className="icon_button">
                                                    <FiEdit
                                                        style={{
                                                            color: "black",
                                                            width: "16px",
                                                            height: "16px",
                                                            transition: "color 0.3s ease-in-out"
                                                        }}
                                                        onMouseEnter={(e) => (e.target.style.color = "gray")}
                                                        onMouseLeave={(e) => (e.target.style.color = "black")}
                                                        onClick={() => handleEditPercakapan(item.data.id, item.type, item.data.name)}
                                                    />
                                                </button>
                                                <button className="icon_button">
                                                    <FaRegTrashAlt
                                                        style={{
                                                            color: "#EE443F",
                                                            width: "16px",
                                                            height: "16px",
                                                            transition: "color 0.3s ease-in-out"
                                                        }}
                                                        onMouseEnter={(e) => (e.target.style.color = "#FF6B61")}
                                                        onMouseLeave={(e) => (e.target.style.color = "#EE443F")}
                                                        onClick={() => showDeletePercakapanModal(item.data.id, item.data.name, item.type)}
                                                    />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="no_data">Tidak ada data ditemukan</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="percakapan_pagination">
                    <button
                        className="percakapan_pagination_btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <FaChevronLeft />
                    </button>
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            className={`percakapan_pagination_btn ${currentPage === index + 1 ? "active" : ""}`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        className="percakapan_pagination_btn"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            </div>
            {activeModal && activeModal}
        </>
    );
};

export default Percakapan;