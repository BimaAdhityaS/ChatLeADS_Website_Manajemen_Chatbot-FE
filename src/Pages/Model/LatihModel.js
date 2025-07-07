import Sidebar from "../../Components/Sidebar/Sidebar";
import axiosServer from "../../Components/Helper/axiosBackend";
import axiosRasa from "../../Components/Helper/axiosRasa";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { MdOutlineRocket } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import dayjs from "dayjs";
import './latihModel.css';

const LatihModel = () => {
    const { user } = useContext(AuthContext);
    const [riwayatPelatihan, setRiwayatPelatihan] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [apiDuration, setApiDuration] = useState();
    const [apiStatus, setApiStatus] = useState();
    const [isloading, setIsLoading] = useState(false);
    const [statusCode, setStatusCode] = useState(null); // Add this line


    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState(null); // 'success' or 'error'
    const [alertMessage, setAlertMessage] = useState("");

    const rowHeight = 50; // Adjust based on your actual row height
    const visibleRows = 2;

    const formatDate = (dateString) => {
        return dayjs(dateString).format("DD/MM/YYYY HH:mm");
    };

    const fetchData = async () => {
        try {
            const response = await axiosServer.get("/api/riwayat-pelatihan");
            //sort data by createdAt in descending order
            response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setRiwayatPelatihan(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Gagal mendapatkan data riwayat");
        }
    }

    // Filter data based on search query
    const filteredRiwayat = riwayatPelatihan.filter(item =>
        item.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        fetchData();
    }, []);

    const displayAlert = (type, message, code = null) => {
        setAlertType(type);
        setAlertMessage(message);
        setStatusCode(code); // Set the status code
        setShowAlert(true);
    };

    const handleTrainModel = async () => {
        setIsLoading(true);
        const loadingToast = toast.loading("Memulai pelatihan model...");
        const trainingStartTime = new Date(); // Add this line to track start time

        try {
            // 1. Get training data as raw YAML
            const { data: yamlData } = await axiosServer.get(
                "/api/rasa/generate-training-data-yaml",
                {
                    headers: { 'Accept': 'application/x-yaml' },
                    responseType: 'text'
                }
            );

            if (!yamlData || yamlData.trim().length === 0) {
                throw new Error("Data training kosong atau tidak valid");
            }

            // 2. Train model with Rasa API
            const response = await axiosRasa.post(
                "/model/train",
                yamlData,
                {
                    params: {
                        save_to_default_model_directory: true,
                        force_training: false,
                        augmentation: 20,
                        num_threads: 2
                    },
                    headers: {
                        'Content-Type': 'application/x-yaml',
                    }
                }
            );

            const trainingEndTime = new Date();
            const trainingDuration = ((trainingEndTime - trainingStartTime) / 1000).toFixed(2);

            setApiDuration(`${(trainingDuration / 60).toFixed(0)} menit`);
            setApiStatus("SUKSES");

            toast.dismiss(loadingToast);
            displayAlert(
                "success",
                `Model berhasil dilatih dalam ${(trainingDuration / 60).toFixed(0)} menit`
            );

            // after training create riwayat percakapan
            const userId = user._id;
            const userName = user.name;
            const role = user.role;
            const status = "SUKSES";
            const durasiPelatihan = `${(trainingDuration / 60).toFixed(0)} menit`;
            const createdAt = new Date();

            await axiosServer.post("/api/riwayat-pelatihan", {
                userId,
                userName,
                role,
                status,
                durasiPelatihan,
                createdAt
            })
        } catch (error) {
            console.error("Error in training:", error);
            toast.dismiss(loadingToast);

            let errorMsg = "Terjadi kesalahan saat pelatihan";
            let statusCode = null;

            if (error.response) {
                // Handle Rasa error response format
                if (error.response.data && error.response.data.message) {
                    errorMsg = error.response.data.message;
                    statusCode = error.response.data.code || error.response.status;
                } else {
                    errorMsg = error.response.statusText || `Error ${error.response.status}`;
                    statusCode = error.response.status;
                }
            } else if (error.message) {
                errorMsg = error.message;
            }

            displayAlert(
                "error",
                errorMsg,
                statusCode
            );

            // after training create riwayat percakapan
            const userId = user._id;
            const userName = user.name;
            const role = user.role;
            const status = "GAGAL";
            const durasiPelatihan = `--`;
            const createdAt = new Date();

            await axiosServer.post("/api/riwayat-pelatihan", {
                userId,
                userName,
                role,
                status,
                durasiPelatihan,
                createdAt
            })
        } finally {
            setIsLoading(false);
            fetchData(); // Refresh training history
        }
    };

    const AlertBox = () => {
        const [isVisible, setIsVisible] = useState(false);

        useEffect(() => {
            if (showAlert) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        }, [showAlert]);

        if (!isVisible) return null;

        const alertClasses = {
            success: "alert-success",
            error: statusCode === 500 ? "alert-error-500" : "alert-error",
            info: "alert-info"
        };

        const alertIcons = {
            success: <FaCheckCircle className="alert-icon" />,
            error: <FaTimesCircle className="alert-icon" />,
            info: <FaInfoCircle className="alert-icon" />
        };

        const handleClose = () => {
            setIsVisible(false);
            setTimeout(() => setShowAlert(false), 300); // Wait for animation to complete
        };

        return (
            <div
                className={`alert-box ${alertClasses[alertType]}`}
                onAnimationEnd={() => !isVisible && setShowAlert(false)}
            >
                <div className="alert-content">
                    {alertIcons[alertType]}
                    <div className="alert-message">
                        <p className="alert-title">
                            {alertType === 'success' ? 'Success' :
                                statusCode === 500 ? 'Server Error' : 'Error'}
                        </p>
                        {statusCode && <p className="alert-code">Error code: {statusCode}</p>}
                    </div>
                </div>
                <button
                    className="alert-close"
                    onClick={handleClose}
                >
                    <FaTimes />
                </button>
            </div>
        );
    };


    return (
        <>
            <Helmet>
                <title>ChatLeADS</title>
            </Helmet>
            <ToastContainer />
            <Sidebar />
            <div className="latih_container">
                <h3>ChatLeADS / Latih Model</h3>
                <line></line>
                <div className="latih_content">
                    <div className="latih_model_container">
                        <div className="latih_model_header">
                            <h5 style={{ color: "black" }}>Latih Model</h5>
                            <p className="B3">Tekan tombol dibawah untuk memulai pelatihan model ChatLeADS</p>
                        </div>
                        <div className="huge_train_button">
                            <button
                                onClick={handleTrainModel}
                                disabled={isloading}
                            >
                                <MdOutlineRocket style={{ height: "150px", width: "150px", color: "white" }} />
                            </button>
                        </div>
                        {/* Custom alert if the status sukses or not */}
                        <AlertBox />
                    </div>
                    <div className="riwayat_pelatihan_container">
                        <p className="S1" style={{ textAlign: "center" }}>Riwayat Pelatihan</p>
                        <line></line>
                        <div className="search_container">
                            <input
                                className="search"
                                type="text"
                                placeholder="Pencarian Nama User"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <CiSearch className="search_icon" style={{ width: "24px", height: "24px" }} />
                        </div>
                        <div style={{ maxHeight: `${rowHeight * visibleRows}px`, overflowY: "auto" }}>
                            {/* Table content */}
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid #E0E0E0" }}>
                                        <th style={{ textAlign: "left", padding: "8px", color: "black", fontSize: "16px", paddingTop: "4px", paddingBottom: "4px", fontWeight: "400" }}>No.</th>
                                        <th style={{ textAlign: "left", padding: "8px", color: "black", fontSize: "16px", paddingTop: "4px", paddingBottom: "4px", fontWeight: "400" }}>User</th>
                                        <th style={{ textAlign: "left", padding: "8px", color: "black", fontSize: "16px", paddingTop: "4px", paddingBottom: "4px", fontWeight: "400" }}>Role</th>
                                        <th style={{ textAlign: "left", padding: "8px", color: "black", fontSize: "16px", paddingTop: "4px", paddingBottom: "4px", fontWeight: "400" }}>Status</th>
                                        <th style={{ textAlign: "left", padding: "8px", color: "black", fontSize: "16px", paddingTop: "4px", paddingBottom: "4px", fontWeight: "400" }}>Durasi Pelatihan</th>
                                        <th style={{ textAlign: "left", padding: "8px", color: "black", fontSize: "16px", paddingTop: "4px", paddingBottom: "4px", fontWeight: "400" }}>Tanggal Pelatihan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRiwayat.length > 0 ? (
                                        filteredRiwayat.map((item, index) => (
                                            <tr
                                                key={item._id}
                                                style={{
                                                    backgroundColor: index % 2 !== 0 ? '#C8CEFC' : '#EDEFFE',
                                                    borderBottom: "1px solid #E0E0E0"
                                                }}
                                            >
                                                <td style={{ padding: "8px", textAlign: "left" }}>{index + 1}</td>
                                                <td style={{ padding: "8px", textAlign: "left" }}>{item.userName}</td>
                                                <td style={{ padding: "8px", textAlign: "left" }}>{item.role}</td>
                                                <td style={{ padding: "8px", textAlign: "left" }}>
                                                    <span style={{
                                                        color: item.status === "SUKSES" ? "#0A6535" : "#9A2B26"
                                                    }}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "8px", textAlign: "left" }}>{item.durasiPelatihan}</td>
                                                <td style={{ padding: "8px", textAlign: "left" }}>{formatDate(item.createdAt)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" style={{ padding: "16px", textAlign: "center" }}>
                                                {searchQuery ? "Tidak ditemukan hasil pencarian" : "Tidak ada data riwayat pelatihan"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LatihModel;