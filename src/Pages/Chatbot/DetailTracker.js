import "./chatbot.css";
import { useState, useEffect, act } from "react";
import { useParams } from "react-router-dom";
import axiosServer from "../../Components/Helper/axiosBackend";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { Helmet } from "react-helmet";
import { ToastContainer, toast } from "react-toastify";
import dayjs from "dayjs";
import { IoMdRefresh } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import chatbot_placeholder from "../../Assets/img/chatbot_placeholder.svg";
import user_placeholder from "../../Assets/img/profile_placeholder.svg";
import DetailDeleteTracker from "../../Components/Modal/warningModal/DetailDeleteTracker";
import { formatTextWithLineBreaks } from "../../Components/Helper/trackerFormatter";

const DetailTracker = () => {
    const { id, category } = useParams(); // Access URL parameters
    const [data, setData] = useState({sender_id: ""});
    const [activeModal, setActiveModal] = useState(null);

    const fetchData = async () => {
        // const loadingToastId = toast.loading("Memanggil data..."); // Show loading toast
        try {
            const res = await axiosServer.get(`/api/tracker/${id}`);
            setData(res.data);
            // toast.update(loadingToastId, {
            //     render: "Percakapan ditampilkan.",
            //     type: "success",
            //     isLoading: false,
            //     autoClose: 1500, // Automatically close after 3 seconds
            // });
        } catch (err) {
            // toast.update(loadingToastId, {
            //     render: err.response?.data?.msg || "Error fetching data",
            //     type: "error",
            //     isLoading: false,
            //     autoClose: 5000, // Automatically close after 5 seconds
            // });
            // Handle error (optional)
            console.error("Error fetching data:", err);
        }
    };

    // Function to handle refresh button
    const handleRefresh = async () => {
        const loadingToast = toast.loading("Memperbarui data...");

        try {
            const res = await axiosServer.get(`/api/tracker/${id}`);
            setData(res.data);

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

    useEffect(() => {
        fetchData();
    }, [id]);

    const formatDate = (timestamp) => {
        return dayjs.unix(timestamp).format("DD/MM/YYYY");
    };

    const formatDateTime = (timestamp) => {
        return dayjs.unix(timestamp).format("DD/MM/YYYY  HH:mm");
    };

    return (
        <>
            <Helmet>ChatLeADS</Helmet>
            <ToastContainer />
            <Sidebar />
            <div className="detailTracker_container">
                <h3>ChatLeADS / Riwayat Chatbot / {category.charAt(0).toUpperCase() + category.slice(1)} / {data.sender_id}</h3>
                <line></line>
                {/* mapping events */}
                <div className="detailTracker_content">
                    {/* <p>{JSON.stringify(data)}</p> */}
                    {/* Map events */}
                    {data.events &&
                        data.events.map((event, index) => (
                            // Render based on event type
                            event.event === "action" ? (
                                <div key={index} className="detailTracker_action">
                                    <div
                                        className={`line ${event.name === "action_default_fallback"
                                            ? "line-red"
                                            : event.name.startsWith("action")
                                                ? "line-orange"
                                                : "line-green"
                                            }`}
                                    ></div>
                                    {event.name === "action_listen" || event.name === "action_session_start" ? (
                                        <p>{"ACTION | " + event.name.replace("utter_", "")}</p>
                                    ) : (
                                        <p>{"ACTION | " + event.name.replace("utter_", "")} | Confidence: {event.confidence} | Policy: {event.policy}</p>
                                    )}
                                    <div
                                        className={`line ${event.name === "action_default_fallback"
                                            ? "line-red"
                                            : event.name.startsWith("action")
                                                ? "line-orange"
                                                : "line-green"
                                            }`}
                                    ></div>
                                </div>
                            )
                                : event.event === "user" || event.event === "bot" ? (
                                    <div
                                        key={index}
                                        className={`tracker_bubble ${event.event === "user" ? "user" : "bot"}`}
                                    >
                                        {/* Bot Avatar */}
                                        {event.event === "bot" && (
                                            <img src={chatbot_placeholder} alt="Bot Avatar" />
                                        )}
                                        <div className="bubble_container">
                                            <div>
                                                {/* Text Message */}
                                                {event.text ? <p>{formatTextWithLineBreaks(event.text)}</p> : null}

                                                {/* Image Message */}
                                                {event.data?.attachment && !event.data?.attachment?.payload?.src && (
                                                    <img
                                                        className="output_image"
                                                        src={event.data.attachment}
                                                        alt="Bot sent visual"
                                                    />
                                                )}

                                                {/* Video Message */}
                                                {event.data?.attachment?.payload?.src && (
                                                    <video className="output_video" controls>
                                                        <source src={event.data.attachment.payload.src} type="video/mp4" />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                )}

                                                {/* File Attachment */}
                                                {event.data?.custom?.document && (
                                                    <a
                                                        className="output_file"
                                                        href={event.data.custom.document}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download
                                                    >
                                                        Download File
                                                    </a>
                                                )}

                                                <p className="B1" style={{ color: "#6D717F" }}>{formatDateTime(event.timestamp)}</p>
                                            </div>
                                            {event.event === "user" && (
                                                <p className="B1">Intent : {event.parse_data.intent.name} | Confidence : {event.parse_data.intent.confidence.toFixed(3)}</p>
                                            )}
                                        </div>
                                        {/* User Avatar */}
                                        {event.event === "user" && (
                                            <img src={user_placeholder} alt="User Avatar" />
                                        )}
                                    </div>
                                ) : (
                                    // Handle unrecognized event types (optional)
                                    <div key={index} className="detailTracker_action">
                                        <div
                                            className={`line line-blue
                                                    }`}
                                        ></div>
                                        <p>{event.event}</p>
                                        <div
                                            className={`line line-blue
                                                    }`}
                                        ></div>
                                    </div>
                                )
                        ))}
                </div>
                <line></line>
                <div className="detailTracker_footer">
                    <div className="detailTracker_footer left">
                        <button className='button_refresh_tracker' onClick={handleRefresh} >
                            <IoMdRefresh style={{ width: "24px", height: "24px" }} />
                            <p className="B1">Perbarui Percakapan</p>
                        </button>
                        <button className="button_reset_tracker" onClick={() => setActiveModal({ type: 'deleteTracker' })}>
                            <FaRegTrashAlt style={{ width: "24px", height: "24px" }} />
                            <p className="B1">Hapus Percakapan</p>
                        </button>
                    </div>
                    <div className="detailTracker_footer right">
                        <p className="S1">
                            Sumber: <span style={{ color: data.sender_id.includes("pengguna") ? "green" : "blue" }}>
                                {data.sender_id.includes("pengguna") ? "LeADS" : "ChatLeADS"}
                            </span>
                        </p>
                        {data.events && data.events.length > 0 && (
                            <p className="S1">Tanggal Disimpan: {formatDate(data.events[0].timestamp)}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Called only once */}
            {activeModal && activeModal.type === 'deleteTracker' && (
                <DetailDeleteTracker id={data.sender_id} setIsOpen={setActiveModal} />
            )}
        </>
    );
};

export default DetailTracker;
