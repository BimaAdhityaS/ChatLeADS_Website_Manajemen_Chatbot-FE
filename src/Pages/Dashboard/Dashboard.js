import Sidebar from "../../Components/Sidebar/Sidebar";
import axiosServer from "../../Components/Helper/axiosBackend";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Helmet } from "react-helmet";
import './dashboard.css';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        intent_count: 0,
        total_examples: 0,
        utterance_count: 0,
        action_count: 0,
        dialog_count: 0,
        tracker_count: 0,
        action_stats: [],
        categorized_trackers: []
    });
    const { isLoggedIn } = useContext(AuthContext);

    const fetchData = async () => {
        const loadingToast = toast.loading("Loading data...");

        try {
            const response = await axiosServer.get("/api/dashboard");
            setDashboardData(response.data);
            toast.update(loadingToast, {
                render: "Data berhasil ditampilkan.",
                type: "success",
                isLoading: false,
                autoClose: 1500,
            });
        } catch (error) {
            console.error(error);
            toast.update(loadingToast, {
                render: "Error fetching data:",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
            fetchData();
        }
    }, [isLoggedIn]);

    return (
        <>
            <Helmet>
                <title>ChatLeADS</title>
            </Helmet>
            <ToastContainer />
            <Sidebar />
            <div className="dashboard_container">
                <h3>ChatLeADS / Dashboard</h3>
                <line></line>
                <div className="dashboard_content">
                    <div className="data_count_container">
                        <div className="data_count_card" style={{ backgroundColor: "#4E61F6" }}>
                            <h4>Intent</h4>
                            <h3>{dashboardData.intent_count}</h3>
                        </div>
                        <div className="data_count_card" style={{ backgroundColor: "#3745AF" }}>
                            <h4>Example</h4>
                            <h3>{dashboardData.total_examples}</h3>
                        </div>
                        <div className="data_count_card" style={{ backgroundColor: "#D93E39" }}>
                            <h4>Utterance</h4>
                            <h3>{dashboardData.utterance_count}</h3>
                        </div>
                        <div className="data_count_card" style={{ backgroundColor: "#E89B00" }}>
                            <h4>Action</h4>
                            <h3>{dashboardData.action_count}</h3>
                        </div>
                        <div className="data_count_card" style={{ backgroundColor: "#3DA755" }}>
                            <h4>Rules & Stories</h4>
                            <h3>{dashboardData.dialog_count}</h3>
                        </div>
                        {/* <div className="data_count_card" style={{ backgroundColor: "#00528C" }}>
                            <h4>Riwayat</h4>
                            <h3>{dashboardData.tracker_count}</h3>
                        </div> */}
                    </div>
                    <div className="data_list_container">
                        <div className="data_list_action">
                            <div className="data_list_action_header">
                                <h5 style={{ color: "black" }}>Daftar Action/Utterance</h5>
                                <p className="S2" style={{ color: "#6D717F", fontSize: "13px", fontWeight: "500" }}>Daftar action/utterance yang sering dipanggil oleh ChatLeADS</p>
                                <line></line>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", maxHeight: "440px" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ borderBottom: "1px solid #E0E0E0" }}>
                                            <th style={{ textAlign: "left", color: "black", fontSize: "14px", padding: "8px 4px", width: "50px" }}>No.</th>
                                            <th style={{ textAlign: "left", color: "black", fontSize: "14px", padding: "8px 4px" }}>Nama</th>
                                            <th style={{ textAlign: "right", color: "black", fontSize: "14px", padding: "8px 4px" }}>Jumlah Panggilan</th>
                                        </tr>
                                    </thead>
                                </table>
                                <div style={{ overflowY: "auto", flex: 1 }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <tbody>
                                            {isLoggedIn ? (
                                                dashboardData.action_stats.map((action, index) => (
                                                    <tr key={action.name} style={{ borderBottom: "1px solid #F0F0F0" }}>
                                                        <td style={{ color: "#6D717F", padding: "8px 4px", width: "50px" }}>{index + 1}</td>
                                                        <td style={{ color: "#2D3748", padding: "8px 4px" }}>{action.name}</td>
                                                        <td style={{ textAlign: "right", color: "#2D3748", padding: "8px 4px" }}>{action.count}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" style={{ textAlign: "center", color: "#6D717F", padding: "16px 4px" }}>
                                                        Tidak ada data
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="data_list_riwayat">
                            <div className="data_list_riwayat_header">
                                <h5 style={{ color: "black" }}>Riwayat Percakapan : {dashboardData.tracker_count}</h5>
                                <p className="S2" style={{ color: "#6D717F", fontSize: "13px", fontWeight: "500" }}>Daftar riwayat percakapan pengguna dengan ChatLeADS</p>
                                <line></line>
                            </div>

                            <div style={{
                                maxHeight: "440px", // Adjust height as needed
                                overflowY: "auto"
                            }}>
                                <table style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    position: "relative" // Needed for sticky header
                                }}>
                                    {/* Sticky Header */}
                                    <thead style={{
                                        position: "sticky",
                                        top: 0,
                                        background: "white",
                                        zIndex: 1,
                                    }}>
                                        <tr>
                                            <th style={{
                                                textAlign: "left",
                                                color: "black",
                                                fontSize: "14px",
                                                padding: "8px 12px", // Increased padding
                                                borderBottom: "1px solid #E0E0E0"
                                            }}>User</th>
                                            <th style={{
                                                textAlign: "right",
                                                color: "black",
                                                fontSize: "14px",
                                                padding: "8px 12px",
                                                borderBottom: "1px solid #E0E0E0"
                                            }}>Kategori</th>
                                        </tr>
                                    </thead>

                                    {/* Scrollable Body */}
                                    <tbody>
                                        {isLoggedIn ? (
                                            dashboardData.categorized_trackers.map((tracker, index) => (
                                                <tr key={tracker._id} style={{ borderBottom: "1px solid #F0F0F0" }}>
                                                    <td style={{
                                                        color: "#2D3748",
                                                        padding: "8px 12px",
                                                        whiteSpace: "nowrap" // Prevent text wrapping
                                                    }}>
                                                        {tracker.sender_id}
                                                    </td>
                                                    <td style={{
                                                        textAlign: "right",
                                                        padding: "8px 12px",
                                                        color: tracker.category === "Normal" ? "#38A169" : "#E53E3E", // Better color contrast
                                                        fontWeight: 500 // Slightly bolder text
                                                    }}>
                                                        {tracker.category}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="2" style={{
                                                    textAlign: "center",
                                                    color: "#6D717F",
                                                    padding: "16px",
                                                    fontStyle: "italic"
                                                }}>
                                                    Tidak ada data
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;