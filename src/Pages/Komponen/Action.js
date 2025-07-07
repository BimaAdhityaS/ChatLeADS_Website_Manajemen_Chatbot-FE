import "./komponen.css"
import Sidebar from "../../Components/Sidebar/Sidebar";
import { Helmet } from "react-helmet";
import { ToastContainer, toast } from "react-toastify";
import { IoIosAdd } from "react-icons/io";
import { CgSearch as CiSearch } from "react-icons/cg";
import axiosServer from "../../Components/Helper/axiosBackend";
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import DeleteAction from "../../Components/Modal/warningModal/DeleteAction";

const Action = () => {
    const [actionData, setActionData] = useState([]);
    const [id, setId] = useState("");
    const [action, setAction] = useState("");
    const [type, setType] = useState("image");
    const [response, setResponse] = useState("");
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState("");
    const [activeForm, setActiveForm] = useState({ type: "empty" });
    const [activeModal, setActiveModal] = useState("");
    const [search, setSearch] = useState("");

    const [previewUrl, setPreviewUrl] = useState("");


    const fetchData = async () => {
        const loadingToast = toast.loading("Memuat data...");

        try {
            const actionRes = await axiosServer.get("/api/action");

            setActionData(actionRes.data);

            //if length of data is 0
            if (actionRes.data.length === 0) {
                toast.update(loadingToast, {
                    render: "Data action kosong",
                    type: "info",
                    isLoading: false,
                    autoClose: 1500
                });
                return;
            }

            toast.update(loadingToast, {
                render: "Data ditampilkan",
                type: "success",
                isLoading: false,
                autoClose: 1500
            });
        } catch (error) {
            console.log(error);
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
            const actionRes = await axiosServer.get("/api/action");
            setActionData(actionRes.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = async (e) => {
        setSearch(e.target.value);
    }

    const filteredActionData = actionData.filter((data) => {
        return data.action.toLowerCase().includes(search.toLowerCase());
    });

    const handleType = (e) => {
        setResponse("");
        setFile(null);
        setType(e.target.value);
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
    };

    const handleCreateform = () => {
        // reset storage
        setId("");
        setAction("");
        setResponse("");
        setFile(null);
        setUrl("");
        setType("image");

        setActiveForm({ type: "addAction" });
    }

    const handleUpdateForm = async (e) => {
        e.preventDefault();

        if (!action) {
            return toast.error("Nama action tidak boleh kosong.");
        }

        const toastId = toast.loading("Memperbarui action…");

        const formData = new FormData();
        formData.append("action", action);
        formData.append("type", type);
        formData.append("response", response);

        if (type === "url") {
            if (!url) {
                toast.update(toastId, {
                    render: "URL tidak boleh kosong.",
                    type: "error",
                    isLoading: false,
                    autoClose: 2000
                });
                return;
            }
            formData.append("url", url);
        } else if (file) {
            formData.append("file", file);
        } else {
            // re-send the existing preview URL so backend keeps it
            formData.append("url", previewUrl);
        }

        try {
            const { data } = await axiosServer.patch(`/api/action/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            toast.update(toastId, {
                render: data.msg || "Action berhasil diubah.",
                type: "success",
                isLoading: false,
                autoClose: 1500
            });

            setActiveForm({ type: "empty" });
            fetchNoToastData();
            setId(""); setAction(""); setResponse(""); setFile(null); setUrl(""); setPreviewUrl("");
        } catch (err) {
            toast.update(toastId, {
                render: err.response?.data?.msg || err.message,
                type: "error",
                isLoading: false,
                autoClose: 2500
            });
        }
    };

    const handleDeleteAction = (id, idUrl, actionName) => {

        // reset storage
        setId("");
        setAction("");
        setResponse("");
        setType("image");
        setActiveForm({ type: "empty" });

        setActiveModal(<DeleteAction id={id} actionName={actionName} setIsOpen={setActiveModal} fetchActionData={fetchNoToastData} />);
    }

    const handleEditForm = (data) => {
        setActiveForm({ type: "editAction" });
        setId(data._id);
        setAction(data.action);
        setType(data.type);
        setResponse(data.response);
        setUrl(data.url);

        setFile(null);
        setPreviewUrl(data.url || "");
    };

    const handleCreateAction = async (e) => {
        e.preventDefault();

        if (!action) {
            return toast.error("Nama action tidak boleh kosong.");
        }

        // show loading toast
        const toastId = toast.loading("Mengupload...");

        const formData = new FormData();
        formData.append("action", action);
        formData.append("type", type);
        formData.append("response", response);

        if (type === "url") {
            if (!url) {
                toast.update(toastId, {
                    render: "URL tidak boleh kosong.",
                    type: "error",
                    isLoading: false,
                    autoClose: 2000
                });
                return;
            }
            formData.append("url", url);
        } else {
            if (!file) {
                toast.update(toastId, {
                    render: "File tidak boleh kosong.",
                    type: "error",
                    isLoading: false,
                    autoClose: 2000
                });
                return;
            }
            formData.append("file", file);
        }

        try {
            const { data } = await axiosServer.post("/api/action", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            toast.update(toastId, {
                render: data.msg,
                type: "success",
                isLoading: false,
                autoClose: 1500
            });

            setActiveForm({ type: "empty" });
            fetchNoToastData();
            // reset fields
            setAction(""); setResponse(""); setFile(null); setUrl(""); setPreviewUrl("");
        } catch (err) {
            toast.update(toastId, {
                render: err.response?.data?.msg || err.message,
                type: "error",
                isLoading: false,
                autoClose: 2500
            });
        }
    };

    return (
        <>
            <Helmet>
                <title>ChatLeADS</title>
                <link rel="icon" href="./assets/img/logo-fab.svg" />
            </Helmet>
            <Sidebar />
            <ToastContainer />
            <div className="component_container">
                <h3>ChatLeADS / Komponen / Action</h3>
                <line></line>
                <div className="component_content">
                    <div className="list_action">
                        <div className="list_action_header">
                            <p className="S1">List Action</p>
                            <button className='button_add_action' onClick={handleCreateform} disabled={activeForm.type === "addAction"}>
                                <IoIosAdd style={{ width: "24px", height: "24px" }} />
                                <p className="B1">Tambah Action</p>
                            </button>
                        </div>
                        <line></line>
                        <div className="action_search_container">
                            <input className="action_search" type="text" placeholder="Pencarian Action" onChange={handleSearch}></input>
                            <CiSearch className="action_search_icon" style={{ width: "24px", height: "24px" }} />
                        </div>
                        <div className="action_item_container">
                            {filteredActionData.map((data, index) => (
                                <div className="component_item" key={index} style={{ backgroundColor: index % 2 === 0 ? " #F9FAFB" : "#EDEFFE" }}>
                                    <div className="component_desc">
                                        <p className="B4">{index + 1}.</p>
                                        <p className="B4">{data.action}</p>
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
                                                onClick={() => handleEditForm(data)}
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
                                                onClick={() => handleDeleteAction(data._id, data.url_id, data.action)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="action_form_container">
                        {activeForm.type === "empty" && (
                            <p style={{
                                fontSize: "32px",
                                textAlign: "center",
                                fontWeight: "400",
                                margin: "auto",
                                color: "#6D717F"
                            }}>Pilih action atau tambah action</p>
                        )}
                        {activeForm.type === "addAction" && (
                            <div className="add_component_form">
                                <form onSubmit={handleCreateAction}>
                                    <p className="S1">Tambah Action</p>
                                    <label>
                                        <p className="B2">Nama Action (Tanpa Spasi) <span style={{ color: "red" }}>*</span></p>
                                        <input
                                            placeholder="Nama Action"
                                            value={action}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\s/g, ""); // Remove all whitespaces
                                                setAction(value);
                                            }}
                                        ></input>
                                    </label>

                                    <label>
                                        <p className="B2">Tipe Action <span style={{ color: "red" }}>*</span></p>
                                        <div className="component_radio_ls">
                                            <input type="radio" id="gambar" name="type" value="image" onClick={handleType} defaultChecked="true" />
                                            <label className="B1" htmlFor="gambar">Gambar</label>
                                            <input type="radio" id="video" name="type" value="video" onClick={handleType} />
                                            <label className="B1" htmlFor="video">Video</label>
                                            {/* <input type="radio" id="document" name="type" value="url" onClick={handleType} />
                                            <label className="B1" htmlFor="document">Link URL</label> */}
                                        </div>
                                        <line></line>
                                    </label>

                                    {type === "image" && (
                                        <label>
                                            <p className="B2">Upload Gambar<span style={{ color: "red" }}>*</span></p>

                                            {/* Conditionally show either dropzone or preview */}
                                            <label className="upload-container">
                                                {!file && (
                                                    <div className="dropzone">
                                                        <img
                                                            src="http://100dayscss.com/codepen/upload.svg"
                                                            alt="upload-icon"
                                                            className="upload-icon"
                                                        />
                                                    </div>
                                                )}

                                                {file && (
                                                    <div className="preview-container">
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt="preview"
                                                            className="preview-image"
                                                        />
                                                        <p className="preview-name">{file.name}</p>
                                                    </div>
                                                )}

                                                {/* Hidden file input stays active */}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="upload-input-absolute"
                                                    onChange={handleFileChange}
                                                />
                                            </label>

                                            <p className="B2">Respon/Jawaban</p>
                                            <input
                                                placeholder="Gambar diatas adalah..."
                                                value={response}
                                                onChange={(e) => {
                                                    setResponse(e.target.value);
                                                }}
                                            ></input>
                                        </label>
                                    )}

                                    {type === "video" && (
                                        <label>
                                            <p className="B2">Upload Video<span style={{ color: "red" }}>*</span></p>

                                            {/* Upload zone or preview */}
                                            {!file ? (
                                                <label className="upload-container">
                                                    <div className="dropzone">
                                                        <img
                                                            src="http://100dayscss.com/codepen/upload.svg"
                                                            alt="upload-icon"
                                                            className="upload-icon"
                                                        />
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="video/*"
                                                        className="upload-input-absolute"
                                                        onChange={handleFileChange}
                                                    />
                                                </label>
                                            ) : (
                                                <div className="preview-container">
                                                    <video
                                                        controls
                                                        src={URL.createObjectURL(file)}
                                                        className="preview-video"
                                                    />
                                                    <p className="preview-name">{file.name}</p>
                                                    <button
                                                        type="button"
                                                        className="ubah-file-button"
                                                        onClick={() => document.getElementById('video-upload').click()}
                                                    >
                                                        Ubah File
                                                    </button>
                                                    {/* Hidden input outside label to be triggered by button */}
                                                    <input
                                                        type="file"
                                                        id="video-upload"
                                                        accept="video/*"
                                                        style={{ display: "none" }}
                                                        onChange={handleFileChange}
                                                    />
                                                </div>
                                            )}

                                            <p className="B2">Respon/Jawaban</p>
                                            <input
                                                placeholder="Video diatas adalah..."
                                                value={response}
                                                onChange={(e) => {
                                                    setResponse(e.target.value);
                                                }}
                                            />
                                        </label>
                                    )}

                                    {type === "url" && (
                                        <label>
                                            <p className="B2">Link URL<span style={{ color: "red" }}>*</span></p>
                                            <input
                                                placeholder="Link harus bersifat public"
                                                value={url}
                                                onChange={(e) => {
                                                    setUrl(e.target.value);
                                                }}
                                            ></input>
                                            <p className="B3 grey">
                                                Menerima link apapun, berguna ketika ingin pengguna diarahkan ke link form atau dokumen
                                            </p>
                                            <p className="B2">Response</p>
                                            <input
                                                placeholder="Link diatas adalah..."
                                                value={response}
                                                onChange={(e) => {
                                                    setResponse(e.target.value);
                                                }}
                                            ></input>
                                        </label>
                                    )}

                                    <div className="component_button_ls">
                                        <button className="button_save_component" type="submit">
                                            <p>Simpan Action</p>
                                        </button>
                                        <button className="button_cancel_component" onClick={() => setActiveForm({ type: "empty" })}>
                                            <p>Batalkan</p>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeForm.type === "editAction" && (
                            <div className="add_component_form">
                                <form onSubmit={handleUpdateForm}>
                                    <p className="S1">Ubah Action</p>
                                    <label>
                                        <p className="B2">Nama Action (Tanpa Spasi) <span style={{ color: "red" }}>*</span></p>
                                        <input
                                            placeholder="Nama Action"
                                            value={action}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\s/g, ""); // Remove all whitespaces
                                                setAction(value);
                                            }}
                                        ></input>
                                    </label>

                                    <label>
                                        <p className="B2">Tipe Action - {type}</p>
                                        <line></line>
                                    </label>

                                    {type === "image" && (
                                        <label>
                                            <p className="B2">
                                                Upload Gambar<span style={{ color: "red" }}>*</span>
                                            </p>

                                            <label className="upload-container">
                                                <div className="preview-container">
                                                    <img
                                                        src={previewUrl}
                                                        alt="preview"
                                                        className="preview-image"
                                                    />
                                                    <p className="preview-name">
                                                        {file ? file.name : previewUrl.split("/").pop()}
                                                    </p>
                                                    {/* hidden input to re‐open file picker */}
                                                    <input
                                                        id="edit-image-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        style={{ display: "none" }}
                                                        onChange={handleFileChange}
                                                    />
                                                </div>
                                            </label>

                                            {/* Response field */}
                                            <p className="B2">Respon/Jawaban</p>
                                            <input
                                                placeholder="Gambar diatas adalah..."
                                                value={response}
                                                onChange={(e) => {
                                                    setResponse(e.target.value);
                                                }}
                                            />
                                        </label>
                                    )}

                                    {type === "video" && (
                                        <label>
                                            <p className="B2">Upload Video<span style={{ color: "red" }}>*</span></p>

                                            {/* Upload zone or preview */}
                                            <div className="preview-container">
                                                <video
                                                    controls
                                                    src={previewUrl}
                                                    className="preview-video"
                                                />
                                                <p className="preview-name">
                                                    {file ? file.name : previewUrl.split("/").pop()}
                                                </p>
                                                <button
                                                    type="button"
                                                    className="ubah-file-button"
                                                    onClick={() => document.getElementById('video-upload').click()}
                                                >
                                                    Ubah File
                                                </button>
                                                {/* Hidden input outside label to be triggered by button */}
                                                <input
                                                    type="file"
                                                    id="video-upload"
                                                    accept="video/*"
                                                    style={{ display: "none" }}
                                                    onChange={handleFileChange}
                                                />
                                            </div>

                                            <p className="B2">Respon/Jawaban</p>
                                            <input
                                                placeholder="Video diatas adalah..."
                                                value={response}
                                                onChange={(e) => {
                                                    setResponse(e.target.value);
                                                }}
                                            />
                                        </label>
                                    )}

                                    {type === "url" && (
                                        <label>
                                            <p className="B2">Link URL<span style={{ color: "red" }}>*</span></p>
                                            <input
                                                placeholder="Link harus bersifat public"
                                                value={url}
                                                onChange={(e) => {
                                                    setUrl(e.target.value);
                                                }}
                                            ></input>
                                            <p className="B3 grey">
                                                Menerima link apapun, berguna ketika ingin pengguna diarahkan ke link form atau dokumen
                                            </p>
                                            <p className="B2">Response</p>
                                            <input
                                                placeholder="Link diatas adalah..."
                                                value={response}
                                                onChange={(e) => {
                                                    setResponse(e.target.value);
                                                }}
                                            ></input>
                                        </label>
                                    )}

                                    <div className="component_button_ls">
                                        <button className="button_save_component" type="submit">
                                            <p>Ubah Action</p>
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
    );
}

export default Action;