import Sidebar from "../../Components/Sidebar/Sidebar";
import axiosServer from "../../Components/Helper/axiosBackend";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import './model.css';

const KonfigurasiModel = () => {
    const [configData, setConfigData] = useState({
        tokenizer: {
            name: 'WhitespaceTokenizer'
        },
        featurizers: [
            {
                name: 'LexicalSyntacticFeaturizer',
                analyzer: '',
                min_ngram: '',
                max_ngram: '',
                _id: ''
            },
            {
                name: 'CountVectorsFeaturizer',
                analyzer: '',
                min_ngram: '',
                max_ngram: '',
                _id: ''
            },
            {
                name: 'CountVectorsFeaturizer',
                analyzer: 'char_wb',
                min_ngram: 1,
                max_ngram: 4,
                _id: ''
            }
        ],
        dietClassifier: {
            name: 'DIETClassifier',
            epochs: 100,
            constrain_similarities: true
        },
        responseSelector: {
            name: 'ResponseSelector',
            epochs: 100,
            constrain_similarities: true
        },
        fallbackClassifier: {
            name: 'FallbackClassifier',
            threshold: 0.4,
            ambiguity_threshold: 0.1
        },
        memoizationPolicy: {
            name: 'MemoizationPolicy',
            max_history: 8
        },
        TEDPolicy: {
            name: 'TEDPolicy',
            max_history: 8,
            epochs: 100
        },
        rulePolicy: {
            name: 'RulePolicy',
            core_fallback_threshold: 0.4,
            core_fallback_action_name: 'action_default_fallback',
            enable_fallback_prediction: true,
            constrain_similarities: true
        },
        UnexpecTEDIntentPolicy: {
            name: 'UnexpecTEDIntentPolicy',
            max_history: 8,
            epochs: 100
        },
        _id: "",
        __v: 0
    });

    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        const loadingToast = toast.loading("Loading data...");

        try {
            const response = await axiosServer.get("/api/rasa/config");

            toast.update(loadingToast, {
                render: "Data konfigurasi berhasil ditampilkan",
                type: "success",
                isLoading: false,
                autoClose: 1000,
            })

            setConfigData(response.data);
        } catch (error) {
            console.error(error);
            toast.update(loadingToast, {
                render: "Gagal mengambil data konfigurasi.",
                type: "error",
                isLoading: false,
                autoClose: 1500,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (path, value) => {
        setConfigData(prev => {
            const newData = { ...prev };
            const keys = path.split('.');
            let current = newData;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;
            return newData;
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async () => {
        setIsLoading(true);
        const loadingToast = toast.loading("Menyimpan konfigurasi...");

        try {
            // Prepare the request body
            const requestBody = {
                // Pipeline configurations
                "dietClassifier.epochs": configData.dietClassifier.epochs,
                "dietClassifier.constrain_similarities": configData.dietClassifier.constrain_similarities,
                "responseSelector.epochs": configData.responseSelector.epochs,
                "responseSelector.constrain_similarities": configData.responseSelector.constrain_similarities,
                "fallbackClassifier.threshold": configData.fallbackClassifier.threshold,
                "fallbackClassifier.ambiguity_threshold": configData.fallbackClassifier.ambiguity_threshold,
                "featurizers.2.min_ngram": configData.featurizers[2].min_ngram,
                "featurizers.2.max_ngram": configData.featurizers[2].max_ngram,

                // Policies configurations
                "memoizationPolicy.max_history": configData.memoizationPolicy.max_history,
                "TEDPolicy.max_history": configData.TEDPolicy.max_history,
                "TEDPolicy.epochs": configData.TEDPolicy.epochs,
                "rulePolicy.core_fallback_threshold": configData.rulePolicy.core_fallback_threshold,
                "rulePolicy.enable_fallback_prediction": configData.rulePolicy.enable_fallback_prediction,
                "rulePolicy.constrain_similarities": configData.rulePolicy.constrain_similarities,
                "UnexpecTEDIntentPolicy.max_history": configData.UnexpecTEDIntentPolicy.max_history,
                "UnexpecTEDIntentPolicy.epochs": configData.UnexpecTEDIntentPolicy.epochs
            };

            // Send PATCH request
            await axiosServer.patch("/api/rasa/config", requestBody);

            toast.update(loadingToast, {
                render: "Konfigurasi berhasil disimpan!",
                type: "success",
                isLoading: false,
                autoClose: 1500,
            });
        } catch (error) {
            console.error(error);
            toast.update(loadingToast, {
                render: "Gagal menyimpan konfigurasi.",
                type: "error",
                isLoading: false,
                autoClose: 1500,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>ChatLeADS</title>
            </Helmet>
            <ToastContainer />
            <Sidebar />
            <div className="config_container">
                <h3>ChatLeADS / Konfigurasi Model</h3>
                <div className="divider"></div>

                <div className="config_sections">
                    {/* Pipeline Section */}
                    <div className="config_section">
                        <h4>Pipeline</h4>
                        <p className="config_description">
                            Pipeline adalah urutan langkah yang dilakukan untuk memproses dan memahami teks input.
                        </p>
                        <div className="featurizer_group">
                            <div className="form_group">
                                <label style={{ color: "#4E61F6" }}>Tokenizer</label>
                                <label>{configData.tokenizer.name}</label>
                                <small className="input_description">
                                    Tokenizer membagi teks input menjadi tokens untuk diproses lebih lanjut.
                                </small>
                            </div>
                        </div>
                        {configData.featurizers.map((featurizer, index) => (
                            <div key={index} className="featurizer_group">
                                <div className="form_group">
                                    <label style={{ color: "#4E61F6" }}>Featurizer {index + 1}</label>
                                    <label>{featurizer.name}</label>
                                    <small className="input_description">
                                        {index === 0 ? "Mengekstrak fitur dari teks menggunakan pendekatan dense"
                                            : index === 1 ? "Mengekstrak fitur menggunakan sparse features"
                                                : "Mengekstrak fitur n-gram dari teks"}
                                    </small>
                                </div>

                                {index === 2 && (
                                    <>
                                        <div className="form_group">
                                            <label style={{ color: "#4E61F6" }}>Analyzer</label>
                                            <label>{featurizer.analyzer}</label>
                                            <small className="input_description">Cara menganalisis teks (word/char)</small>
                                        </div>

                                        <div className="form_row">
                                            <div className="form_group">
                                                <label>Min N-gram</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="5"
                                                    value={featurizer.min_ngram || ''}
                                                    onChange={(e) => handleInputChange(`featurizers.${index}.min_ngram`, parseInt(e.target.value))}
                                                />
                                                <small className="input_description">Panjang minimum n-gram (1-5)</small>
                                            </div>

                                            <div className="form_group">
                                                <label>Max N-gram</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="5"
                                                    value={featurizer.max_ngram || ''}
                                                    onChange={(e) => handleInputChange(`featurizers.${index}.max_ngram`, parseInt(e.target.value))}
                                                />
                                                <small className="input_description">Panjang maksimum n-gram (1-5)</small>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                        <div className="featurizer_group">
                            <div className="form_group">
                                <h4 style={{ color: "#4E61F6" }}>DIET Classifier</h4>
                                <small className="input_description">
                                    Dual Intent and Entity Transformer - mengklasifikasikan intent dan mengekstrak entitas secara bersamaan
                                </small>
                                <div className="form_column">
                                    <div className="form_group">
                                        <label>Epochs</label>
                                        <input
                                            type="number"
                                            min="50"
                                            max="300"
                                            value={configData.dietClassifier.epochs}
                                            onChange={(e) => handleInputChange('dietClassifier.epochs', parseInt(e.target.value))}
                                        />
                                        <small className="input_description">Jumlah iterasi training (50-300)</small>
                                    </div>
                                    <div className="form_group checkbox_group">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={configData.dietClassifier.constrain_similarities}
                                                onChange={(e) => handleInputChange('dietClassifier.constrain_similarities', e.target.checked)}
                                            />
                                            Constrain Similarities
                                        </label>
                                        <small className="input_description">
                                            Mencegah intent yang mirip memiliki embedding yang terlalu dekat
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="featurizer_group">
                            <div className="form_group">
                                <h4 style={{ color: "#4E61F6" }}>Response Selector</h4>
                                <small className="input_description">
                                    Memilih respon terbaik dari kandidat yang tersedia berdasarkan konteks percakapan
                                </small>
                                <div className="form_column">
                                    <div className="form_group">
                                        <label>Epochs</label>
                                        <input
                                            type="number"
                                            min="50"
                                            max="300"
                                            value={configData.responseSelector.epochs}
                                            onChange={(e) => handleInputChange('responseSelector.epochs', parseInt(e.target.value))}
                                        />
                                        <small className="input_description">Jumlah iterasi training (50-300)</small>
                                    </div>
                                    <div className="form_group checkbox_group">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={configData.responseSelector.constrain_similarities}
                                                onChange={(e) => handleInputChange('responseSelector.constrain_similarities', e.target.checked)}
                                            />
                                            Constrain Similarities
                                        </label>
                                        <small className="input_description">
                                            Mencegah respon yang mirip memiliki embedding yang terlalu dekat
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="featurizer_group">
                            <div className="form_group">
                                <h5 style={{ color: "#4E61F6" }}>Fallback Classifier</h5>
                                <small className="input_description">
                                    Menentukan kapan model tidak yakin dengan prediksinya dan perlu fallback
                                </small>
                                <div className="form_row">
                                    <div className="form_group">
                                        <label>Threshold</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0.1"
                                            max="1.0"
                                            value={configData.fallbackClassifier.threshold}
                                            onChange={(e) => handleInputChange('fallbackClassifier.threshold', parseFloat(e.target.value))}
                                        />
                                        <small className="input_description">
                                            Ambang batas confidence score untuk memicu fallback (0.1-1.0)
                                        </small>
                                    </div>
                                    <div className="form_group">
                                        <label>Ambiguity Threshold</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0.1"
                                            max="1.0"
                                            value={configData.fallbackClassifier.ambiguity_threshold}
                                            onChange={(e) => handleInputChange('fallbackClassifier.ambiguity_threshold', parseFloat(e.target.value))}
                                        />
                                        <small className="input_description">
                                            Ambang batas perbedaan confidence score antara 2 intent teratas (0.1-1.0)
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Policies Section */}
                    <div className="config_section">
                        <h4>Policies</h4>
                        <p className="config_description">
                            Policies menentukan bagaimana model memutuskan tindakan apa yang akan diambil dalam percakapan.
                        </p>

                        {/* Memoization Policy */}
                        <div className="featurizer_group">
                            <div className="form_group">
                                <h5 style={{ color: "#4E61F6" }}>Memoization Policy</h5>
                                <small className="input_description">
                                    Mengingat percakapan yang pernah dilihat selama training
                                </small>
                                <div className="form_group">
                                    <label>Max History</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={configData.memoizationPolicy.max_history || ''}
                                        onChange={(e) => handleInputChange('memoizationPolicy.max_history', parseInt(e.target.value))}
                                    />
                                    <small className="input_description">Jumlah maksimum langkah percakapan yang diingat (1-10)</small>
                                </div>
                            </div>
                        </div>

                        {/* TED Policy */}
                        <div className="featurizer_group">
                            <div className="form_group">
                                <h5 style={{ color: "#4E61F6" }}>TED Policy</h5>
                                <small className="input_description">
                                    Transformer Embedding Dialogue Policy - memprediksi tindakan berikutnya menggunakan transformer
                                </small>
                                <div className="form_row">
                                    <div className="form_group">
                                        <label>Max History</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={configData.TEDPolicy.max_history || ''}
                                            onChange={(e) => handleInputChange('TEDPolicy.max_history', parseInt(e.target.value))}
                                        />
                                        <small className="input_description">Jumlah maksimum langkah percakapan yang dipertimbangkan (1-10)</small>
                                    </div>
                                    <div className="form_group">
                                        <label>Epochs</label>
                                        <input
                                            type="number"
                                            min="50"
                                            max="300"
                                            value={configData.TEDPolicy.epochs || ''}
                                            onChange={(e) => handleInputChange('TEDPolicy.epochs', parseInt(e.target.value))}
                                        />
                                        <small className="input_description">Jumlah iterasi training (50-300)</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rule Policy */}
                        <div className="featurizer_group">
                            <div className="form_group">
                                <h5 style={{ color: "#4E61F6" }}>Rule Policy</h5>
                                <small className="input_description">
                                    Menangani percakapan berdasarkan aturan yang telah ditentukan
                                </small>
                                <div className="form_row">
                                    <div className="form_group">
                                        <label>Core Fallback Threshold</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0.1"
                                            max="1.0"
                                            value={configData.rulePolicy.core_fallback_threshold || ''}
                                            onChange={(e) => handleInputChange('rulePolicy.core_fallback_threshold', parseFloat(e.target.value))}
                                        />
                                        <small className="input_description">Ambang batas untuk fallback berbasis aturan (0.1-1.0)</small>
                                    </div>
                                </div>
                                <div className="form_row">
                                    <div className="form_group checkbox_group">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={configData.rulePolicy.enable_fallback_prediction}
                                                onChange={(e) => handleInputChange('rulePolicy.enable_fallback_prediction', e.target.checked)}
                                            />
                                            Enable Fallback Prediction
                                        </label>
                                        <small className="input_description">
                                            Mengaktifkan prediksi fallback berbasis aturan
                                        </small>
                                    </div>
                                    <div className="form_group checkbox_group">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={configData.rulePolicy.constrain_similarities}
                                                onChange={(e) => handleInputChange('rulePolicy.constrain_similarities', e.target.checked)}
                                            />
                                            Constrain Similarities
                                        </label>
                                        <small className="input_description">
                                            Mencegah aturan yang mirip memiliki embedding yang terlalu dekat
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* UnexpecTED Intent Policy */}
                        <div className="featurizer_group">
                            <div className="form_group">
                                <h5 style={{ color: "#4E61F6" }}>UnexpecTED Intent Policy</h5>
                                <small className="input_description">
                                    Menangani intent yang tidak terduga dalam percakapan
                                </small>
                                <div className="form_row">
                                    <div className="form_group">
                                        <label>Max History</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={configData.UnexpecTEDIntentPolicy.max_history || ''}
                                            onChange={(e) => handleInputChange('UnexpecTEDIntentPolicy.max_history', parseInt(e.target.value))}
                                        />
                                        <small className="input_description">Jumlah maksimum langkah percakapan yang dipertimbangkan (1-10)</small>
                                    </div>
                                    <div className="form_group">
                                        <label>Epochs</label>
                                        <input
                                            type="number"
                                            min="50"
                                            max="300"
                                            value={configData.UnexpecTEDIntentPolicy.epochs || ''}
                                            onChange={(e) => handleInputChange('UnexpecTEDIntentPolicy.epochs', parseInt(e.target.value))}
                                        />
                                        <small className="input_description">Jumlah iterasi training (50-300)</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="action_buttons">
                    <button
                        className="save_button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        Simpan Konfigurasi
                    </button>
                    <button
                        className="reset_button"
                        onClick={fetchData}
                        disabled={isLoading}
                    >
                        Reset Perubahan Konfigurasi
                    </button>
                </div>
            </div>
        </>
    );
};

export default KonfigurasiModel;