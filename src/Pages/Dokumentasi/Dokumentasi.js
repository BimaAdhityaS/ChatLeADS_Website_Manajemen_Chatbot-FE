import Sidebar from "../../Components/Sidebar/Sidebar";
import { Helmet } from "react-helmet";
import { useState, useRef, useEffect } from "react";
import './dokumentasi.css';

const Dokumentasi = () => {
    const [activeTerm, setActiveTerm] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);
    const contentSectionsRef = useRef([]);

    const glossaryTerms = [
        {
            term: "Intent",
            definition: "Intent adalah tujuan atau maksud dari percakapan pengguna. Dalam chatbot, intent digunakan untuk memahami apa yang diinginkan pengguna dari pesan yang mereka kirim."
        },
        {
            term: "Example",
            definition: "Example (Contoh) dalam konteks chatbot merujuk pada sampel percakapan atau pola teks yang digunakan untuk melatih model pemahaman bahasa. Setiap intent biasanya memiliki beberapa contoh example."
        },
        {
            term: "Utterance",
            definition: "Utterance adalah salah satu bentuk respon dari sebuah intent. Utterance akan berupa text, utterance akan dipanggil sesuai dengan rule atau story yang dibuat."
        },
        {
            term: "Action",
            definition: "Action adalah respon atau tindakan yang dilakukan oleh chatbot sebagai balasan terhadap pesan pengguna. Action bisa berupa respon yang kompleks seperti video atau gambar"
        },
        {
            term: "Rule",
            definition: "Rule adalah aturan yang menentukan alur percakapan antara pengguna dan chatbot. Rule menghubungkan intent dengan action yang sesuai."
        },
        {
            term: "Story",
            definition: "Story adalah contoh alur percakapan yang menggambarkan interaksi antara pengguna dan chatbot. Story membantu melatih model untuk memahami konteks percakapan."
        },
        {
            term: "Model",
            definition: "Model adalah representasi matematis dari data yang digunakan oleh chatbot untuk memahami dan merespons pesan pengguna. Model dilatih menggunakan data yang telah disiapkan sebelumnya."
        },
        {
            term: "Max_history",
            definition: "Max_history adalah parameter yang menentukan berapa banyak riwayat percakapan yang harus dipertimbangkan oleh model saat merespons pesan pengguna. Ini membantu model memahami konteks percakapan yang lebih baik."
        },
        {
            term: "Epoch",
            definition: "Epoch adalah satu siklus pelatihan model di mana seluruh dataset digunakan untuk memperbarui bobot model. Semakin banyak epoch, semakin baik model dapat memahami data."
        },
        {
            term: "fallback_threshold",
            definition: "Fallback_threshold adalah ambang batas yang menentukan kapan chatbot harus memberikan respon fallback. Jika model tidak yakin tentang intent pengguna, chatbot akan memberikan respon fallback."
        },
        {
            term: "ambiguity_threshold",
            definition: "Ambiguity_threshold adalah ambang batas yang menentukan seberapa ambigu pesan pengguna. Jika model tidak dapat menentukan intent dengan yakin, chatbot akan memberikan respon yang sesuai."
        },
        {
            term: "n-gram",
            definition: "N-gram adalah teknik pemrosesan bahasa alami yang membagi teks menjadi n bagian berurutan. Ini membantu model memahami konteks kata dalam kalimat."
        },
        {
            term: "constraint_similarities",
            definition: "Constraint_similarities adalah parameter yang digunakan untuk mengukur kesamaan antara pesan pengguna dan intent yang ada. Ini membantu model menentukan intent yang paling sesuai."
        },
        {
            term: "threshold",
            definition: "Threshold adalah ambang batas yang digunakan untuk menentukan apakah model yakin tentang intent pengguna. Jika nilai di atas threshold, model akan memberikan respon sesuai intent tersebut."
        },
        {
            term: "confidence",
            definition: "Confidence adalah tingkat keyakinan model terhadap prediksi intent pengguna. Semakin tinggi confidence, semakin yakin model tentang intent tersebut."
        },
        {
            term: "enable_fallback_prediction",
            definition: "Enable_fallback_prediction adalah opsi yang memungkinkan model untuk memberikan respon fallback jika tidak yakin tentang intent pengguna. Ini membantu meningkatkan pengalaman pengguna."
        },
    ];

    // Add IDs to documentation content
    const documentationContent = [
        {
            id: "halaman-intent",
            title: "Halaman Intent",
            content: "Halaman intent berfungsi untuk mengelola semua intent yang ada dalam chatbot. Di halaman ini Anda dapat menambahkan, mengedit, atau menghapus intent sesuai kebutuhan pengembangan chatbot."
        },
        {
            id: "menambahkan-intent-baru",
            title: "Menambahkan Intent Baru",
            content: "Untuk menambahkan intent baru, klik tombol 'Tambah Intent' di halaman intent. Kemudian, masukkan nama intent dan beberapa contoh example yang relevan. Pastikan untuk memberikan nama yang deskriptif agar mudah dikenali.",
            image: "https://res.cloudinary.com/drood0vmn/image/upload/v1746548925/0dc3642f-2d46-403c-9ed1-6bf7db736f7d.png"
        },
        {
            id: "merubah-intent",
            title: "Merubah Intent",
            content: "Untuk merubah intent yang sudah ada, pilih intent yang ingin diubah dari daftar intent. Setelah itu, klik logo kertas ditutupi pensil dan lakukan perubahan yang diperlukan. Jangan lupa untuk menyimpan perubahan setelah selesai.",
            image: "https://res.cloudinary.com/drood0vmn/image/upload/v1746637207/2fbaafc9-33f5-49c6-9ad7-c54084c2c70c.png"
        },
        {
            id: "menghapus-intent",
            title: "Menghapus Intent",
            content: "Untuk menghapus intent, pilih intent yang ingin dihapus dari daftar intent. Kemudian, klik logo tempat sampah. Pastikan Anda yakin sebelum menghapus intent, karena tindakan ini tidak dapat dibatalkan.",
            image: "https://res.cloudinary.com/drood0vmn/image/upload/v1746637850/image_1_ipckuj.png"
        },
        {
            id: "halaman-utterance",
            title: "Halaman Utterance",
            content: "Halaman utterance berfungsi untuk mengelola semua utterance yang ada dalam chatbot. Di halaman ini Anda dapat menambahkan, mengedit, atau menghapus utterance sesuai kebutuhan pengembangan chatbot." 
        },
        {
            id: "menambahkan-utterance-baru",
            title: "Menambahkan Utterance Baru",
            content: "Untuk menambahkan utterance baru, klik tombol 'Tambah Utterance'. Kemudian, masukkan teks atau jawaban yang diinginkan, anda bisa masukan emoji ataupun melakukan format enter agar terlihat rapih. Pastikan untuk memberikan nama yang deskriptif agar mudah dikenali.",
            image: "https://res.cloudinary.com/drood0vmn/image/upload/v1746638536/b2bbe8ea-713f-47b2-abb7-ad55dd619b44.png"
        },
        {
            id: "merubah-utterance",
            title: "Merubah Utterance",
            content: "Untuk merubah utterance yang sudah ada, pilih utterance yang ingin diubah dari daftar utterance. Setelah itu, klik logo kertas ditutupi pensil dan lakukan perubahan yang diperlukan. Jangan lupa untuk menyimpan perubahan setelah selesai.",
            image: "https://res.cloudinary.com/drood0vmn/image/upload/v1746639036/03d6af05-5b39-435a-99f3-0fd5729fc96c.png"
        },
        {
            id: "menghapus-utterance",
            title: "Menghapus Utterance",
            content: "Untuk menghapus utterance, pilih utterance yang ingin dihapus dari daftar utterance. Kemudian, klik logo tempat sampah. Pastikan Anda yakin sebelum menghapus utterance, karena tindakan ini tidak dapat dibatalkan.",
            image: "https://res.cloudinary.com/drood0vmn/image/upload/v1746639542/3e3b28c1-b043-4b26-9f52-9304a7d64a43.png"
        },
        {
            id: "halaman-action",
            title: "Halaman Action",
            content: "Halaman action berfungsi untuk mengelola semua action yang ada dalam chatbot. Di halaman ini Anda dapat menambahkan, mengedit, atau menghapus action sesuai kebutuhan pengembangan chatbot."
        },
        {
            id: "menambahkan-action-baru-gambar",
            title: "Menambahkan Action - Tipe Gambar",
            content: "Untuk menambahkan action baru dengan tipe gambar, klik tombol 'Tambah Action'. Kemudian, pilih tipe gambar dan unggah gambar yang diinginkan. Anda juga dapat menambahkan teks atau deskripsi yang relevan.",
            image: "https://res.cloudinary.com/drood0vmn/image/upload/v1746853725/b6df34ea-88a5-4200-be8f-92151dd3bc68.png"
        },
        {
            id: "menambahkan-action-baru-video",
            title: "Menambahkan Action - Tipe Video",
            content: "Untuk menambahkan action baru dengan tipe video, klik tombol 'Tambah Action'. Kemudian, pilih tipe video dan unggah video yang diinginkan. Anda juga dapat menambahkan teks atau deskripsi yang relevan.",
            image: "https://res.cloudinary.com/drood0vmn/image/upload/v1746854173/a3099b5a-7768-46db-82a4-0611cb40927d.png"
        },
        {
            id: "merubah-action",
            title: "Merubah Action",
            content: "Untuk merubah action yang sudah ada, pilih action yang ingin diubah dari daftar action. Setelah itu, klik logo kertas ditutupi pensil dan lakukan perubahan yang diperlukan. Jangan lupa untuk menyimpan perubahan setelah selesai.",
            image: "https://res.cloudinary.com/drood0vmn/image/upload/v1746854602/5107cdb8-3dfb-473c-8724-f514ac8fe616.png"
        },
        {
            id: "menghapus-action",
            title: "Menghapus Action",
            content: "Untuk menghapus action, pilih action yang ingin dihapus dari daftar action. Kemudian, klik logo tempat sampah. Pastikan Anda yakin sebelum menghapus action, karena tindakan ini tidak dapat dibatalkan.",
            image: "https://res.cloudinary.com/drood0vmn/image/upload/v1746854942/f3fc535e-f4e5-453d-906c-1a02dfcbf146.png"
        },
        {
            id: "halaman-percakapan",
            title: "Halaman Percakapan",
            content: "Halaman percakapan berfungsi untuk mengelola semua percakapan yang ada dalam chatbot. Di halaman ini Anda dapat menambahkan, mengedit, atau menghapus percakapan sesuai kebutuhan pengembangan chatbot.",
        },
        {
            id: "aturan-dalam-membuat-percakapan",
            title: "Aturan Dalam Membuat Percakapan",
            content: "Dalam menyusun percakapan, pastikan untuk mengikuti aturan berikut",
            image: "https://res.cloudinary.com/drood0vmn/image/upload/v1746855877/f8944b8b-6c6f-4ef8-80ab-4a57e94ab42c.png"
        },
        {
            id: "menambahkan-rule-baru",
            title: "Menyusun Percakapan - Tipe Rule",
            content: "Untuk menyusun percakapan baru dengan tipe rule, klik tombol 'Tambah Percakapan'. Kemudian, pilih tipe rule dan tentukan alur percakapan yang diinginkan. Anda hanya dapat menghubungkan 1 intent dengan respon action / utterance yang sesuai.",
            image: "https://res.cloudinary.com/drood0vmn/image/upload/v1746859986/1a4f5010-98d0-4e14-a2ac-10154d72a043.png"
        },
        {
            id: "menambahkan-story-baru",
            title: "Menyusun Percakapan - Tipe Story",
            content: "Untuk menyusun percakapan baru dengan tipe story, klik tombol 'Tambah Percakapan'. Kemudian, pilih tipe story dan tentukan alur percakapan yang diinginkan. Buat selayaknya percakapan pengguna dengan chatbot",
            image: "https://res.cloudinary.com/drood0vmn/image/upload/v1746860890/413dda1b-7f0f-4603-bef0-1804caed074e.png"
        },
        {
            id: "merubah-percakapan",
            title: "Merubah Percakapan",
            content: "Untuk merubah percakapan yang sudah ada, pilih percakapan yang ingin diubah dari daftar percakapan. Setelah itu, klik logo kertas ditutupi pensil dan lakukan perubahan yang diperlukan. Jangan lupa untuk menyimpan perubahan setelah selesai.",
            image: "https://res.cloudinary.com/drood0vmn/image/upload/v1746861424/b8a44a9a-71d9-4a98-9e8f-ed48b6d64213.png"
        },
        {
            id: "menghapus-percakapan",
            title: "Menghapus Percakapan",
            content: "Untuk menghapus percakapan, pilih percakapan yang ingin dihapus dari daftar percakapan. Kemudian, klik logo tempat sampah. Pastikan Anda yakin sebelum menghapus percakapan, karena tindakan ini tidak dapat dibatalkan.",
            image: "https://res.cloudinary.com/drood0vmn/image/upload/v1746861798/c1a14550-704f-4b4a-9a1a-c5981d3a688d.png"
        },
        {
            id: "latih-konfigurasi-model",
            title: "Latih & Konfigurasi Model",
            content: "Halaman ini berfungsi untuk melatih dan mengkonfigurasi model chatbot. Anda dapat melakukan pelatihan model berdasarkan data yang telah disiapkan sebelumnya.",
        },
        {
            id: "latih-model",
            title: "Halaman Latih Model",
            content: "Untuk melatih model, klik tombol 'Latih Model'. Proses pelatihan mungkin memerlukan waktu tergantung pada ukuran dataset.",
            image: "https://res.cloudinary.com/drood0vmn/image/upload/v1746887512/4144d498-d6d9-4fe1-a598-6295cdd151dd.png"
        },
        {
            id: "peringatan-konfigurasi",
            title: "Peringatan Dalam Melakukan Konfigurasi",
            content: "Sebelum melakukan konfigurasi model, tolong perhatikan peringatan berikut:",
            image: "https://res.cloudinary.com/drood0vmn/image/upload/v1746887996/396dc858-30fd-4070-8204-c63c3255d956.png"
        },
        {
            id: "konfigurasi-model",
            title: "Halaman Konfigurasi Model",
            content: "Di halaman ini, Anda dapat mengatur parameter-parameter model sesuai kebutuhan. Pastikan untuk menyimpan perubahan setelah melakukan konfigurasi.",
            image: "https://res.cloudinary.com/drood0vmn/image/upload/v1746943653/75e75c94-0c29-4e00-ac06-30056250270c.png"
        }
    ];

    // Update navigation items with corresponding IDs
    const navigationItems = [
        {
            title: "Halaman Intent",
            id: "halaman-intent",
            subItems: [
                { title: "Menambahkan Intent Baru", id: "menambahkan-intent-baru" },
                { title: "Merubah Intent", id: "merubah-intent" },
                { title: "Menghapus Intent", id: "menghapus-intent" }
            ]
        },
        {
            title: "Halaman Utterance",
            id: "halaman-utterance",
            subItems: [
                { title: "Menambahkan Utterance Baru", id: "menambahkan-utterance-baru" },
                { title: "Merubah Utterance", id: "merubah-utterance" },
                { title: "Menghapus Utterance", id: "menghapus-utterance" }
            ]
        },
        {
            title: "Halaman Action",
            id: "halaman-action",
            subItems: [
                { title: "Menambahkan Action Tipe Gambar", id: "menambahkan-action-baru-gambar" },
                { title: "Menambahkan Action Tipe Video", id: "menambahkan-action-baru-video" },
                { title: "Merubah Action", id: "merubah-action" },
                { title: "Menghapus Action", id: "menghapus-action" }
            ]
        },
        {
            title: "Halaman Percakapan",
            id: "halaman-percakapan",
            subItems: [
                { title: "Aturan Dalam Membuat Percakapan", id: "aturan-dalam-membuat-percakapan" },
                { title: "Menyusun Percakapan Tipe Rule", id: "menambahkan-rule-baru" },
                { title: "Menyusun Percakapan Tipe Story", id: "menambahkan-story-baru" },
                { title: "Merubah Percakapan", id: "merubah-percakapan" },
                { title: "Menghapus Percakapan", id: "menghapus-percakapan" }
            ]
        },
        {
            title: "Latih & Konfigurasi Model",
            id: "latih-konfigurasi-model",
            subItems: [
                { title: "Halaman Latih Model", id: "latih-model" },
                { title: "Peringatan Dalam Melakukan Konfigurasi", id: "peringatan-konfigurasi" },
                { title: "Halaman Konfigurasi Model", id: "konfigurasi-model" },
            ]
        }
    ];

    // Scroll to section function
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    // Set up intersection observer for active section highlighting
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // You can add active section state here if needed
                    }
                });
            },
            { threshold: 0.1 }
        );

        contentSectionsRef.current.forEach(section => {
            if (section) observer.observe(section);
        });

        return () => {
            contentSectionsRef.current.forEach(section => {
                if (section) observer.unobserve(section);
            });
        };
    }, []);

    const toggleDropdown = (title) => {
        setOpenDropdown(openDropdown === title ? null : title);
    };

    return (
        <>
            <Helmet>
                <title>ChatLeADS</title>
            </Helmet>
            <Sidebar />
            <div className="dokumentasi_container">
                <h3>ChatLeADS / Dokumentasi</h3>
                <line></line>

                {/* Glossarium Section */}
                <div className="glossarium-section" id="glossarium">
                    <h5 style={{ color: "black" }}>Glossarium</h5>
                    <div className="glossary-buttons">
                        {glossaryTerms.map((term, index) => (
                            <button
                                key={index}
                                className={`glossary-button ${activeTerm === term.term ? 'active' : ''}`}
                                onClick={() => setActiveTerm(term.term)}
                            >
                                {term.term}
                            </button>
                        ))}
                    </div>

                    {activeTerm && (
                        <div className="glossary-definition">
                            <p className="S1">{activeTerm}</p>
                            <p className="B3">{glossaryTerms.find(t => t.term === activeTerm).definition}</p>
                        </div>
                    )}
                </div>

                {/* Documentation Content */}
                <div className="documentation-content">
                    <div className="content-main">
                        {documentationContent.map((section, index) => (
                            <div
                                key={index}
                                id={section.id}
                                ref={el => contentSectionsRef.current[index] = el}
                                className="content-section"
                            >
                                <h5 style={{ color: "black" }}>{section.title}</h5>
                                <p className="B3" style={{ textAlign: "justify" }}>{section.content}</p>
                                {section.image && (
                                    <div className="content-image">
                                        <img src={section.image} alt={section.title} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="content-navigation">
                        <h5 style={{ color: "black" }}>Navigasi</h5>
                        <ul className="navigation-list">
                            {/* glossarium */}
                            <li className="navigation-item">
                                <div
                                    className="navigation-title"
                                    onClick={() => {
                                        toggleDropdown("glossarium");
                                        scrollToSection("glossarium");
                                    }}
                                >
                                    Glossarium
                                </div>
                            </li>
                            {navigationItems.map((item, index) => (
                                <li key={index} className="navigation-item">
                                    <div
                                        className="navigation-title"
                                        onClick={() => {
                                            toggleDropdown(item.title);
                                            scrollToSection(item.id);
                                        }}
                                    >
                                        {item.title}
                                        <span className={`dropdown-arrow ${openDropdown === item.title ? 'open' : ''}`}>
                                            ▼
                                        </span>
                                    </div>
                                    {openDropdown === item.title && (
                                        <ul className="submenu">
                                            {item.subItems.map((subItem, subIndex) => (
                                                <li
                                                    key={subIndex}
                                                    className="submenu-item"
                                                    onClick={() => scrollToSection(subItem.id)}
                                                >
                                                    {subItem.title}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dokumentasi;