import "./komponen.css"
import Sidebar from "../../Components/Sidebar/Sidebar";
import DeleteIntent from "../../Components/Modal/warningModal/DeleteIntent";
import { ToastContainer, toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { IoIosAdd } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import axiosServer from "../../Components/Helper/axiosBackend";

const Intent = () => {
    const [intentData, setData] = useState([]);
    const [intentSearch, setSearch] = useState("");
    const [activeForm, setActiveForm] = useState({ type: "empty" });
    const [activeModal, setActiveModal] = useState();
    const [id, setId] = useState("");
    const [intent, setIntent] = useState("");
    const [examples, setExample] = useState([]);
    const [newExample, setNewExample] = useState("");

    const fetchData = async () => {
        //show a loading toast
        const loadingToast = toast.loading("Memuat data....");

        try {
            //fetch data from API
            const intentRes = await axiosServer.get("/api/intent");

            //store data to state
            setData(intentRes.data);

            //if data length is 0, show a message
            if (intentRes.data.length === 0) {
                return toast.update(loadingToast, {
                    render: "Data intent kosong",
                    type: "info",
                    isLoading: false,
                    autoClose: 1500,
                });
            }

            //update the toast to success
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
            //fetch data from API
            const intentRes = await axiosServer.get("/api/intent");
            //store data to state
            setData(intentRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = async (e) => {
        setSearch(e.target.value);
    }

    const filteredIntentData = intentData.filter((data) => {
        return data.intent.toLowerCase().includes(intentSearch.toLowerCase());
    });

    const handleAddExample = async (e) => {
        if (newExample === "") {
            return toast.error("Example tidak boleh kosong");
        }

        setExample([...examples, newExample]);
        setNewExample("");
    }

    const handleRemoveExample = async (index) => {
        const newExamples = examples.filter((_, i) => i !== index);
        setExample(newExamples);
    }

    const handleCreateIntent = async (e) => {
        e.preventDefault();

        if (!intent.trim()) {
            return toast.error("Nama intent tidak boleh kosong");
        }

        if (examples.length === 0) {
            return toast.error("Minimal 1 sampel kalimat");
        }

        //create the payload
        const payload = {
            intent,
            examples,
        };

        try {
            //send the data to the server
            await axiosServer.post("/api/intent", payload);

            //show success toast
            toast.success("Intent berhasil ditambahkan", { autoClose: 1000 });

            //fetch the data again
            fetchDataNoToast();

            //reset the form
            setIntent("");
            setExample([]);
            setActiveForm({ type: "empty" });
        } catch (error) {
            console.error("Error creating intent:", error);
            toast.error(`${error.response?.data?.msg || "Gagal menambahkan intent"}`);
        }
    }

    const ShowAddIntentForm = () => {
        setActiveForm({ type: "addIntent" });

        //reset the storage
        setIntent("");
        setExample([]);
        setNewExample("");
    }

    const ShowUpdateIntentForm = async (id) => {
        try {
            const intentSpecific = await axiosServer.get(`/api/intent/${id}`);

            setId(intentSpecific.data._id);
            setIntent(intentSpecific.data.intent);
            setExample(intentSpecific.data.examples);
            setNewExample("");

            setActiveForm({ type: "updateIntent" });
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error(`${error.response?.data?.msg || "Gagal mengambil data"}`);
        }
    }

    const handleUpdateIntent = async (id, e) => {
        e.preventDefault();

        if (!intent.trim()) {
            return toast.error("Nama intent tidak boleh kosong");
        }

        if (examples.length === 0) {
            return toast.error("Minimal 1 sampel kalimat");
        }

        //create the payload
        const payload = {
            intent,
            examples,
        };

        try {
            //send the data to the server
            await axiosServer.patch(`/api/intent/${id}`, payload);

            //show success toast
            toast.success("Intent berhasil diupdate", { autoClose: 1000 });

            //fetch the data again
            fetchDataNoToast();

            //reset the form
            setIntent("");
            setExample([]);
            setActiveForm({ type: "empty" });
        } catch (error) {
            console.error("Error updating intent:", error);
            toast.error(`${error.response?.data?.msg || "Gagal mengupdate intent"}`);
        }
    }

    const showDeleteIntentModal = (id, intentName) => {

        // reset storage
        setId("");
        setIntent("");
        setExample([]);
        setNewExample("");
        setActiveForm({ type: "empty" });

        setActiveModal(<DeleteIntent id={id} intentName={intentName} setIsOpen={setActiveModal} fetchIntentData={fetchDataNoToast} />);
    }

    return (
        <>
            <Helmet>
                <title>ChatLeADS</title>
                <link rel="icon" href="./assets/img/logo-fab.svg" />
            </Helmet>
            <Sidebar />
            <ToastContainer />
            <div className="component_container">
                <h3>ChatLeADS / Komponen / Intent</h3>
                <line></line>
                <div className="component_content">
                    <div className="list_intent">
                        <div className="list_intent_header">
                            <p className="S1">List Intent</p>
                            <button className='button_add_intent' onClick={ShowAddIntentForm} disabled={activeForm.type === "addIntent"}>
                                <IoIosAdd style={{ width: "24px", height: "24px" }} />
                                <p className="B1">Tambah Intent</p>
                            </button>
                        </div>
                        <line></line>
                        <div className="intent_search_container">
                            <input className="intent_search" type="text" placeholder="Pencarian Intent" onChange={handleSearch}></input>
                            <CiSearch className="intent_search_icon" style={{ width: "24px", height: "24px" }} />
                        </div>
                        <div className="component_item_container">
                            {filteredIntentData.map((data, index) => (
                                <div className="component_item" key={index} style={{ backgroundColor: index % 2 === 0 ? " #F9FAFB" : "#EDEFFE" }}>
                                    <div className="component_desc">
                                        <p className="B4">{index + 1}.</p>
                                        <p className="B4">{data.intent}</p>
                                    </div>
                                    <div className="component_action">
                                        <p className="B1 grey">{data.examples.length}</p>
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
                                                onClick={() => ShowUpdateIntentForm(data._id)}
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
                                                onClick={() => showDeleteIntentModal(data._id, data.intent)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="intent_form">
                        {activeForm.type === "empty" && (
                            <p style={{
                                fontSize: "32px",
                                textAlign: "center",
                                fontWeight: "400",
                                margin: "auto",
                                color: "#6D717F"
                            }}>Pilih intent atau Tambah intent</p>
                        )}
                        {activeForm.type === "addIntent" && (
                            <div className="add_component_form">
                                <form onSubmit={handleCreateIntent}>
                                    <p className="S1">Tambah Intent</p>
                                    <label>
                                        <p className="B2">Nama Intent (Tanpa Spasi) <span style={{ color: "red" }}>*</span></p>
                                        <input
                                            placeholder="Nama Intent"
                                            value={intent}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\s/g, ""); // Remove all whitespaces
                                                setIntent(value);
                                            }}
                                        ></input>
                                    </label>
                                    <div className="example_container">
                                        <p className="B2">Sampel Kalimat / Example (Min. 1 Sampel Kalimat)<span style={{ color: "red" }}>*</span></p>
                                        <line></line>
                                        {/* Ini mapping nanti */}
                                        <div className="example_item_container">
                                            {examples.map((example, index) => (
                                                <div key={index} className="example_item">
                                                    <p className="B2" style={{ wordWrap: "break-word", whiteSpace: "normal" }}>{example}</p>
                                                    <FaRegTrashAlt style={{
                                                        cursor: "pointer",
                                                        color: "#EE443F",
                                                        width: "24px",
                                                        height: "24px",
                                                        margin: "auto",
                                                        marginRight: "0px",
                                                        transition: "color 0.3s ease-in-out",
                                                    }}
                                                        onMouseEnter={(e) => {
                                                            e.target.style.color = "#FF6B61"; // Change color on hover
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.color = "#EE443F"; // Reset color
                                                        }}
                                                        onClick={() => handleRemoveExample(index)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <label className="add_example">
                                            <input
                                                type="text"
                                                placeholder="Sampel kalimat"
                                                value={newExample}
                                                onChange={(e) => setNewExample(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault(); // Prevent form submission
                                                        handleAddExample(); // Call the function to add the example
                                                    }
                                                }}
                                            />
                                            <button onClick={handleAddExample} type="button">
                                                <IoIosAdd style={{ width: "24px", height: "24px" }} />
                                            </button>
                                        </label>

                                        {/* Dropdown Entity */}
                                        <p className="B3 grey">
                                            Sampel kalimat atau example adalah contoh kalimat yang mewakili suatu tujuan atau intent. Misalnya, untuk intent pengertian_leADS, sampel kalimatnya bisa berupa "Apa itu pengertian LeADS?" Kalimat tersebut digunakan untuk mengidentifikasi atau memicu respon sesuai dengan tujuan tersebut dalam sistem.
                                        </p>
                                    </div>
                                    <div className="component_button_ls">
                                        <button className="button_save_component" type="submit">
                                            <p>Simpan Intent</p>
                                        </button>
                                        <button className="button_cancel_component" onClick={() => setActiveForm({ type: "empty" })}>
                                            <p>Batalkan</p>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                        {activeForm.type === "updateIntent" && (
                            <div className="add_component_form">
                                <form onSubmit={handleUpdateIntent.bind(this, id)}>
                                    <p className="S1">Ubah Intent</p>
                                    <label>
                                        <p className="B2">Nama Intent (Tanpa Spasi) <span style={{ color: "red" }}>*</span></p>
                                        <input
                                            placeholder="Nama Intent"
                                            value={intent}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\s/g, ""); // Remove all whitespaces
                                                setIntent(value);
                                            }}
                                        ></input>
                                    </label>
                                    <div className="example_container">
                                        <p className="B2">Sampel Kalimat / Example (Min. 1 Sampel Kalimat)<span style={{ color: "red" }}>*</span></p>
                                        <line></line>
                                        {/* Ini mapping nanti */}
                                        <div className="example_item_container">
                                            {examples.map((example, index) => (
                                                <div key={index} className="example_item">
                                                    <p className="B2" style={{ wordWrap: "break-word", whiteSpace: "normal" }}>{example}</p>
                                                    <FaRegTrashAlt style={{
                                                        cursor: "pointer",
                                                        color: "#EE443F",
                                                        width: "24px",
                                                        height: "24px",
                                                        margin: "auto",
                                                        marginRight: "0px",
                                                        transition: "color 0.3s ease-in-out",
                                                    }}
                                                        onMouseEnter={(e) => {
                                                            e.target.style.color = "#FF6B61"; // Change color on hover
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.color = "#EE443F"; // Reset color
                                                        }}
                                                        onClick={() => handleRemoveExample(index)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <label className="add_example">
                                            <input
                                                type="text"
                                                placeholder="Sampel kalimat"
                                                value={newExample}
                                                onChange={(e) => setNewExample(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault(); // Prevent form submission
                                                        handleAddExample(); // Call the function to add the example
                                                    }
                                                }}
                                            />
                                            <button onClick={handleAddExample} type="button">
                                                <IoIosAdd style={{ width: "24px", height: "24px" }} />
                                            </button>
                                        </label>

                                        {/* Dropdown Entity */}
                                        <p className="B3 grey">
                                            Sampel kalimat atau example adalah contoh kalimat yang mewakili suatu tujuan atau intent. Misalnya, untuk intent pengertian_leADS, sampel kalimatnya bisa berupa "Apa itu pengertian LeADS?" Kalimat tersebut digunakan untuk mengidentifikasi atau memicu respon sesuai dengan tujuan tersebut dalam sistem.
                                        </p>
                                    </div>
                                    <div className="component_button_ls">
                                        <button className="button_save_component" type="submit">
                                            <p>Ubah Intent</p>
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

export default Intent;