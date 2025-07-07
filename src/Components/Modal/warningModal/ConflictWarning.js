import "./warningModal.css";

const ConflictWarning = ({ data, onClose }) => {
    const combinedList = [...(data.rules || []), ...(data.stories || [])];

    return (
        <div className="warning_blurBG fade-in">
            <div className="warning_centered">
                <div className="warning_modal">
                    <div className="desc">
                        <p className="S2">Conflict: {data.name}</p>
                        <p className="B3_desc">{data.msg}</p>
                        {combinedList.length > 0 && (
                            <div className="conflict_list">
                                <p className="B3">
                                    Percakapan:
                                </p>
                                <ul style={{ listStyle: 'none' }}>
                                    {combinedList.map((item, index) => (
                                        <li className="B3" key={index}>{index + 1}. {item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="warning_button_ls">
                        <button className="warning_confirm" onClick={onClose}>Baik, saya mengerti</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConflictWarning;