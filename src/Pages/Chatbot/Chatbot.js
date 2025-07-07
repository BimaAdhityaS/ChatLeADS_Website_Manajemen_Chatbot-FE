import React, { useEffect, useContext, useState, useRef } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { FaRegPaperPlane } from "react-icons/fa";
import chatbot_placeholder from "../../Assets/img/chatbot_placeholder.svg";
import user_placeholder from "../../Assets/img/profile_placeholder.svg";
import axiosRasa from "../../Components/Helper/axiosRasa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './chatbot.css';
import { AuthContext } from "../../context/AuthContext";
import Helmet from "react-helmet";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const { user } = useContext(AuthContext);
    const initialized = useRef(false);
    const messagesEndRef = useRef(null);

    // Function to handle message submission
    const sendMessage = async (e) => {
        e.preventDefault();

        if (!userInput.trim()) {
            return toast.error("Field masih kosong.");
        }

        const userMessage = {
            sender: "user",
            text: userInput,
        };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        try {
            const response = await axiosRasa.post(
                "/webhooks/rest/webhook",
                {
                    sender: user.name,
                    message: userInput,
                }
            );

            if (response.data.length === 0) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        sender: "bot",
                        text: "Fallback Terpanggil\nSilahkan periksa riwayat percakapan anda untuk mencoba mengetahui penyebabnya",
                    },
                ]);
            } else {
                const rasaMessages = response.data.map((msg) => ({
                    sender: "bot",
                    text: msg.text || null,
                    image: msg.image || null,
                    attachment: msg.attachment || null,
                }));

                setMessages((prevMessages) => [...prevMessages, ...rasaMessages]);
            }
        } catch (error) {
            console.error("Error communicating with Rasa:", error);
            toast.error("Terjadi kesalahan saat menghubungi server Rasa.");
        }

        setUserInput("");
    };

    // Format text with line breaks
    const formatText = (text) => {
        if (!text) return null;
        return text.split('\n').map((line, i) => (
            <React.Fragment key={i}>
                {line}
                {i < text.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));
    };

    //send message to rasa for introduction when page is loaded
    const customActionTrigger = async () => {
        try {
            const restartResponse = await axiosRasa.post(
                "/webhooks/rest/webhook",
                {
                    sender: user.name,
                    message: "/restart",
                }
            );

            const response = await axiosRasa.post(
                "/webhooks/rest/webhook",
                {
                    sender: user.name,
                    message: "start",
                }
            );

            const rasaMessages = response.data.map((msg) => ({
                sender: "bot",
                text: msg.text || null,
                image: msg.image || null,
                attachment: msg.attachment || null,
            }));

            setMessages((prevMessages) => [...prevMessages, ...rasaMessages]);
        } catch (error) {
            console.error("Error communicating with Rasa:", error);
            toast.error("Terjadi kesalahan saat menghubungi server Rasa.", { autoClose: 1000 });
        }
    };

    // Auto-scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            customActionTrigger();
        }
    }, []);

    return (
        <>
            <ToastContainer />
            <Helmet>
                <title>ChatLeADS</title>
            </Helmet>
            <div>
                <Sidebar />
                <div className="chatbot_container">
                    <h3>ChatLeADS / Chatbot</h3>
                    <line></line>
                    <div className="chatbot_content">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`chatbot_bubble ${msg.sender === "user" ? "user" : "chatbot"
                                    }`}
                            >
                                {msg.sender === "bot" && (
                                    <img src={chatbot_placeholder} alt="Bot Avatar" />
                                )}
                                <div>
                                    {/* Text Message */}
                                    {msg.text && <p>{formatText(msg.text)}</p>}

                                    {/* Image Message */}
                                    {msg.image && (
                                        <img
                                            className="output_image"
                                            src={msg.image}
                                            alt="Bot sent visual"
                                        />
                                    )}

                                    {/* Video Message */}
                                    {msg.attachment && msg.attachment.type && (
                                        <video className="output_video" controls>
                                            <source src={msg.attachment.payload.src} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                </div>
                                {msg.sender === "user" && (
                                    <img src={user_placeholder} alt="User Avatar" />
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Container */}
                    <div className="chatbot_input_container">
                        <form onSubmit={sendMessage}>
                            <input
                                className="chatbot_input"
                                type="text"
                                placeholder="Silahkan tulis perintah anda disini..."
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                            />
                            <button type="submit" className="chatbot_submit">
                                <FaRegPaperPlane />
                            </button>
                        </form>
                        <p className="B3 grey">
                            Halaman untuk melakukan pengujian pada chatbot yang dibangun, silahkan
                            berkomunikasi dengan chatbot
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatbot;