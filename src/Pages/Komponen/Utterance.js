import "./komponen.css";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { Helmet } from "react-helmet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosAdd } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { use, useState } from "react";
import axiosServer from "../../Components/Helper/axiosBackend";
import { useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import DeleteUtterance from "../../Components/Modal/warningModal/DeleteUtterance";

const Utterance = () => {
    const [utterData, setUtterData] = useState([]);
    const [id, setId] = useState();
    const [utterance, setUtterance] = useState();
    const [response, setResponse] = useState();
    const [activeForm, setActiveForm] = useState({ type: "empty" });
    const [activeModal, setActiveModal] = useState();
    const [search, setSearch] = useState("");

    // get data
    const fetchData = async () => {
        const loadingToast = toast.loading("Memuat data...");

        try {
            const utterRes = await axiosServer.get("/api/utterance");
            
            setUtterData(utterRes.data);

            // if data length is 0
            if (utterRes.data.length === 0) {
                return toast.update(loadingToast, {
                    render: "Data utterance kosong",
                    type: "info",
                    isLoading: false,
                    autoClose: 1500,
                });
            }

            toast.update(loadingToast, {
                render: "Data ditampilkan",
                type: "success",
                isLoading: false,
                autoClose: 1500
            });
        } catch (error) {
            console.log("error fetching data: ", error);
            toast.update(loadingToast, {
                render: "Gagal mengambil data",
                type: "error",
                isLoading: false,
                autoClose: 1500
            });
        }
    }

    const fetchNoToastData = async () => {
        try {
            const utterRes = await axiosServer.get("/api/utterance");
            setUtterData(utterRes.data);
        } catch (error) {
            console.log("error fetching data: ", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const filtereUtterData = utterData.filter((data) => {
        return data.utterance.toLowerCase().includes(search.toLowerCase());
    });

    const handleSearch = async (e) => {
        setSearch(e.target.value);
    }

    const handleCreateUtterance = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading("Menambahkan utterance...");

        try {
            const utterRes = await axiosServer.post("/api/utterance", {
                utterance: utterance,
                response: response,
            });

            if (utterRes.status === 200) {
                toast.update(loadingToast, {
                    render: "Utterance berhasil ditambahkan",
                    type: "success",
                    isLoading: false,
                    autoClose: 1000
                });

                setActiveForm({ type: "empty" });
                setUtterance("");
                setResponse("");
                fetchNoToastData();
            }
        } catch (error) {
            console.log("error adding utterance: ", error);
            toast.update(loadingToast, {
                render: error.response.data.msg,
                type: "error",
                isLoading: false,
                autoClose: 1500
            });
        }
    }

    const showEditUtteranceForm = async (id) => {
        try {
            const utterRes = await axiosServer.get(`/api/utterance/${id}`);

            setId(utterRes.data._id);
            setUtterance(utterRes.data.utterance);
            setResponse(utterRes.data.response);

            setActiveForm({ type: "editUtterance" });
        } catch (error) {
            console.log("error fetching utterance: ", error)
            toast.error("Gagal mengambil data utterance");
        }
    }

    const handleAddUtterance = () => {
        setActiveForm({ type: "addUtterance" });

        setId("");
        setUtterance("");
        setResponse("");
    }

    const handleEditUtterance = async (e) => {
        e.preventDefault();

        try {
            await axiosServer.patch(`/api/utterance/${id}`, {
                utterance: utterance,
                response: response,
            });

            toast.success("Utterance berhasil diubah", { autoClose: 1000 });

            setActiveForm({ type: "empty" });
            fetchNoToastData();
        } catch (error) {
            console.log("error updating utterance: ", error);
            toast.error(error.response.data.msg);
        }
    }

    const handleDeleteUtterance = async (id, utteranceName) => {
        setActiveModal(<DeleteUtterance id={id} utteranceName={utteranceName} setIsOpen={setActiveModal} fetchUtteranceData={fetchNoToastData} />);

        setActiveForm({ type: "empty" });
        setUtterance("");
        setResponse("");
    }

    return (
        <>
            <ToastContainer />
            <Helmet>
                <title>ChatLeADS</title>
                <link rel="icon" href="./assets/img/logo-fab.svg" />
            </Helmet>
            <Sidebar />
            <div className="component_container">
                <h3>ChatLeADS / Komponen / Utterance</h3>
                <line></line>
                <div className="component_content">
                    <div className="list_utterance">
                        <div className="list_utterance_header">
                            <p className="S1">List Utterance</p>
                            <button className='button_add_utterance' onClick={handleAddUtterance} disabled={activeForm.type === "addUtterance"}>
                                <IoIosAdd style={{ width: "24px", height: "24px" }} />
                                <p className="B1">Tambah Utterance</p>
                            </button>
                        </div>
                        <line></line>
                        <div className="utterance_search_container">
                            <input className="utterance_search" type="text" placeholder="Pencarian Utterance" onChange={handleSearch}></input>
                            <CiSearch className="utterance_search_icon" style={{ width: "24px", height: "24px" }} />
                        </div>
                        <div className="utterance_item_container">
                            {filtereUtterData.map((data, index) => (
                                <div className="component_item" key={index} style={{ backgroundColor: index % 2 === 0 ? " #F9FAFB" : "#EDEFFE" }}>
                                    <div className="component_desc">
                                        <p className="B4">{index + 1}.</p>
                                        <p className="B4">{data.utterance}</p>
                                    </div>
                                    <div className="component_action">
                                        <div>
                                            <FiEdit style={{
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

                                                onClick={() => showEditUtteranceForm(data._id)}
                                            />
                                            <FaRegTrashAlt style={{
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
                                                onClick={() => handleDeleteUtterance(data._id, data.utterance)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="utterance_form_container">
                        {activeForm.type === "empty" && (
                            <p style={{
                                fontSize: "32px",
                                textAlign: "center",
                                fontWeight: "400",
                                margin: "auto",
                                color: "#6D717F"
                            }}>Pilih utterance atau tambah utterance</p>
                        )}
                        {activeForm.type === "addUtterance" && (
                            <div className="add_component_form">
                                <form onSubmit={handleCreateUtterance}>
                                    <p className="S1">Tambah Utterance</p>
                                    <label>
                                        <p className="B2">Nama Utterance (Tanpa Spasi) <span style={{ color: "red" }}>*</span></p>
                                        <input
                                            placeholder="Nama Utterance"
                                            value={utterance}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\s/g, ""); // Remove all whitespaces
                                                setUtterance(value);
                                            }}
                                        ></input>
                                    </label>
                                    <label style={{ flexGrow: 1 }}>
                                        <p className="B2">Respon / Jawaban <span style={{ color: "red" }}>*</span></p>
                                        <textarea
                                            className="component_multiline_input"
                                            placeholder="Learning management system (LMS) LeADS UPNVJ merupakan...."
                                            value={response}
                                            onChange={(e) => {
                                                setResponse(e.target.value);
                                            }}
                                        />
                                    </label>
                                    <div className="component_button_ls">
                                        <button className="button_save_component" type="submit">
                                            <p>Simpan Utterance</p>
                                        </button>
                                        <button className="button_cancel_component" onClick={() => setActiveForm({ type: "empty" })}>
                                            <p>Batalkan</p>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                        {activeForm.type === "editUtterance" && (
                            <div className="add_component_form">
                                <form onSubmit={handleEditUtterance}>
                                    <p className="S1">Ubah Utterance</p>
                                    <label>
                                        <p className="B2">Nama Utterance (Tanpa Spasi) <span style={{ color: "red" }}>*</span></p>
                                        <input
                                            placeholder="Nama Utterance"
                                            value={utterance}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\s/g, ""); // Remove all whitespaces
                                                setUtterance(value);
                                            }}
                                        ></input>
                                    </label>
                                    <label style={{ flexGrow: 1 }}>
                                        <p className="B2">Respon / Jawaban <span style={{ color: "red" }}>*</span></p>
                                        <textarea
                                            className="component_multiline_input"
                                            placeholder="Learning management system (LMS) LeADS UPNVJ merupakan...."
                                            value={response}
                                            onChange={(e) => {
                                                setResponse(e.target.value);
                                            }}
                                        />
                                    </label>
                                    <div className="component_button_ls">
                                        <button className="button_save_component" type="submit">
                                            <p>Ubah Utterance</p>
                                        </button>
                                        <button className="button_cancel_component" onClick={() => setActiveForm({ type: "empty" })}>
                                            <p>Batalkan</p>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {activeModal}
        </>
    )
}

export default Utterance;