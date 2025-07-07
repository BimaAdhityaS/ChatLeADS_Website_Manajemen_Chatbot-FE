import Sidebar from "../../Components/Sidebar/Sidebar";
import { FaRegTrashAlt } from "react-icons/fa";
import axiosServer from "../../Components/Helper/axiosBackend";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import './percakapan.css';
import { useNavigate, useParams, useLocation } from "react-router-dom";

const DetailPercakapan = () => {
    const { type, name } = useParams();
    const [intentData, setIntentData] = useState();
    const [utteranceData, setUtteranceData] = useState();
    const [actionData, setActionData] = useState();
    const [percakapanName, setPercakapanName] = useState(name);
    const [steps, setSteps] = useState([]);

    const location = useLocation();
    const percakapanData = location.state
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [intentResponse, utteranceResponse, actionResponse] = await Promise.all([
                axiosServer.get(`api/intent`),
                axiosServer.get(`api/utterance`),
                axiosServer.get(`api/action`)
            ]);

            setIntentData(intentResponse.data);
            setUtteranceData(utteranceResponse.data);
            setActionData(actionResponse.data);

            if (percakapanData?.steps?.length) {
                setSteps(percakapanData.steps.map(step => ({
                    type: step.type,
                    value: step.value,
                    refModel: step.refModel
                })));
            } else {
                setSteps([{ type: "intent", value: "", refModel: "Intent" }]);
            }

        } catch (error) {
            toast.error("Gagal mengambil data");
        }
    };

    const handleCancel = () => {
        navigate("/percakapan", { replace: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosServer.patch(`api/${type}/${percakapanData._id}`, {
                name: percakapanName,
                steps,
            });

            toast.success("Percakapan berhasil diperbarui");

            setTimeout(() => {
                navigate("/percakapan", { replace: true });
            }, 1000);
        } catch (error) {
            toast.error(error.response.data.msg);
        }
    };

    return (
        <>
            <Sidebar />
            <ToastContainer />
            <div className="percakapan_container">
                <h3>ChatLeADS / Percakapan / {name}</h3>
                <line></line>
                <form className="dialog_container" onSubmit={handleSubmit}>
                    <div className="dialog_content">
                        <div className="dialog_header">
                            {/* make h4 name as an input */}
                            <input
                                type="text"
                                className="input_name_percakapan"
                                value={percakapanName} onChange={(e) => {
                                    const noSpaces = e.target.value.replace(/\s/g, "");
                                    setPercakapanName(noSpaces);
                                }}
                                placeholder="Nama Percakapan"
                            />
                            <p className="S1" style={{ color: "#6D717F" }}>{type}</p>
                        </div>
                        <div className="dialog_body">
                            {steps.map((step, index) => (
                                <div key={index} className="step-container">
                                    <p className={`B2 ${step.type === "intent" ? "text-right" : "text-left"}`}>
                                        {step.refModel}
                                    </p>

                                    <div className={`step-flex-row ${step.type === "intent" ? "align-right" : "align-left"}`}>
                                        {/* Trash icon for action (left) */}
                                        {index > 0 && step.type === "intent" && (
                                            <FaRegTrashAlt
                                                className="delete_icon"
                                                onClick={() => {
                                                    const newSteps = [...steps];
                                                    if (
                                                        step.type === "action" &&
                                                        steps[index + 1]?.type === "intent" &&
                                                        steps[index - 1]?.type === "intent"
                                                    ) {
                                                        newSteps.splice(index, 2);
                                                    } else {
                                                        newSteps.splice(index, 1);
                                                    }
                                                    setSteps(newSteps);
                                                }}
                                            />
                                        )}

                                        {/* Dropdown */}
                                        <div className="select-container">
                                            <select
                                                className="step-select"
                                                // if the value is empty make the the font italic
                                                style={{ fontStyle: step.value ? "normal" : "italic" }}
                                                value={step.value}
                                                onChange={(e) => {
                                                    const newSteps = [...steps];
                                                    newSteps[index].value = e.target.value;
                                                    setSteps(newSteps);
                                                }}
                                            >
                                                <option value="" disabled selected={!step.value}>
                                                    {step.refModel === "Intent" && "Intent masih kosong"}
                                                    {step.refModel === "Utterance" && "Utterance masih kosong"}
                                                    {step.refModel === "Action" && "Action masih kosong"}
                                                </option>

                                                {step.refModel === "Intent" && intentData?.map((intent, idx) => (
                                                    <option key={idx} value={intent._id}>{intent.intent}</option>
                                                ))}
                                                {step.refModel === "Utterance" && utteranceData?.map((utterance, idx) => (
                                                    <option key={idx} value={utterance._id}>{utterance.utterance}</option>
                                                ))}
                                                {step.refModel === "Action" && actionData?.map((action, idx) => (
                                                    <option key={idx} value={action._id}>{action.action}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Trash icon for intent (right) */}
                                        {index > 0 && step.type === "action" && (
                                            <FaRegTrashAlt
                                                className="delete_icon"
                                                onClick={() => {
                                                    const newSteps = [...steps];
                                                    if (
                                                        step.type === "action" &&
                                                        steps[index + 1]?.type === "intent" &&
                                                        steps[index - 1]?.type === "intent"
                                                    ) {
                                                        newSteps.splice(index, 2);
                                                    } else {
                                                        newSteps.splice(index, 1);
                                                    }
                                                    setSteps(newSteps);
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}

                            {type === "rule" && (
                                <div className="rule_buttons">
                                    <button
                                        type="button"
                                        className="add_utterance_button"
                                        onClick={() => {
                                            setSteps([...steps, {
                                                type: "action",
                                                value: "",
                                                refModel: "Utterance"
                                            }]);
                                        }}
                                    >
                                        Utterance
                                    </button>

                                    <button
                                        type="button"
                                        className="add_action_button"
                                        onClick={() => {
                                            setSteps([...steps, {
                                                type: "action",
                                                value: "",
                                                refModel: "Action"
                                            }]);
                                        }}
                                    >
                                        Action
                                    </button>
                                </div>
                            )}

                            {type === "story" && (
                                <div className={`story_buttons ${steps.length && steps[steps.length - 1].type === "action" ? "align-right" : "align-left"}`}>
                                    {/* Only show Intent button if last step is NOT an intent */}
                                    {(!steps.length || steps[steps.length - 1].type !== "intent") && (
                                        <button
                                            type="button"
                                            className="add_intent_button"
                                            onClick={() => {
                                                setSteps([...steps, {
                                                    type: "intent",
                                                    value: "",
                                                    refModel: "Intent"
                                                }]);
                                            }}
                                        >
                                            Intent
                                        </button>
                                    )}

                                    {/* Always show Utterance button */}
                                    <button
                                        type="button"
                                        className="add_utterance_button"
                                        onClick={() => {
                                            setSteps([...steps, {
                                                type: "action",
                                                value: "",
                                                refModel: "Utterance"
                                            }]);
                                        }}
                                    >
                                        Utterance
                                    </button>

                                    {/* Always show Action button */}
                                    <button
                                        type="button"
                                        className="add_action_button"
                                        onClick={() => {
                                            setSteps([...steps, {
                                                type: "action",
                                                value: "",
                                                refModel: "Action"
                                            }]);
                                        }}
                                    >
                                        Action
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* <div>
                            <pre>{JSON.stringify(steps, null, 2)}</pre>
                        </div> */}
                    </div>
                    <div className="dialog_button_ls">
                        <button className="button_save_percakapan" type="submit">
                            <p>Simpan Percakapan</p>
                        </button>
                        <button className="button_cancel_percakapan" onClick={handleCancel} type="button">
                            <p>Batalkan</p>
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
};

export default DetailPercakapan;