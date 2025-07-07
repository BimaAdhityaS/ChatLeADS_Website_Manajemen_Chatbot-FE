import React, { useContext, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AiOutlineHome } from "react-icons/ai";
import { IoPersonOutline } from "react-icons/io5";
import { RiRobot2Line } from "react-icons/ri";
import { LuHistory } from "react-icons/lu";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { FiBox } from "react-icons/fi";
import { MdOutlineRocket } from "react-icons/md";
import { MdOutlineBook } from "react-icons/md";
import logo_upnvj from '../../Assets/img/logo_upnvj.svg';
import profile_picture from '../../Assets/img/profile_placeholder.svg';
import './sidebar.css';
import { AuthContext } from '../../context/AuthContext';

function Sidebar() {
    const style = { width: "24px", height: "24px" };
    const [openDropdown, setOpenDropdown] = useState(null);
    const { user } = useContext(AuthContext)
    const location = useLocation();

    const toggleDropdown = (key) => {
        setOpenDropdown((prev) => (prev === key ? null : key));
    };

    return (
        <div className="sidebar">
            <div className="sidebar_logolist_container">
                <img src={logo_upnvj} alt="logo_upnvj" />
                <div className="sidebar_menu">
                    <ul>
                        <li>
                            <NavLink to="/" activeClassName="active">
                                <AiOutlineHome style={style} />
                                <p className="B2">Dashboard</p>
                            </NavLink>
                        </li>

                        {/* if user admin hide admin option */}
                        {user.role === "ADMIN" ? null :
                            <li>
                                <NavLink to="/admin" activeClassName="active">
                                    <IoPersonOutline style={style} />
                                    <p className="B2">Admin</p>
                                </NavLink>
                            </li>
                        }
                        <li>
                            <NavLink to="/chatbot" activeClassName="active">
                                <RiRobot2Line style={style} />
                                <p className="B2">Chatbot</p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/riwayat" activeClassName="active">
                                <LuHistory style={style} />
                                <p className="B2">Riwayat Chatbot</p>
                            </NavLink>
                        </li>

                        <li className={openDropdown === "component" || ['/component/intent', '/component/action', '/component/utterance'].includes(location.pathname) ? "active" : ""} onClick={() => toggleDropdown("component")}>
                            <FiBox style={style} />
                            <p className="B2">Komponen</p>
                        </li>

                        {/* Conditionally render dropdown */}
                        <div className={`dropdown ${openDropdown === "component" || ['/component/intent', '/component/utterance', '/component/action'].includes(location.pathname) ? "show" : ""}`}>
                            <ul>
                                <li><NavLink to="/component/intent" activeClassName="active">Intent</NavLink></li>
                                <li><NavLink to="/component/utterance" activeClassName="active">Utterance</NavLink></li>
                                <li><NavLink to="/component/action" activeClassName="active">Action</NavLink></li>
                            </ul>
                        </div>

                        <li>
                            <NavLink to="/percakapan" activeClassName="active">
                                <HiOutlineChatBubbleLeftRight style={style} />
                                <p className="B2">Percakapan</p>
                            </NavLink>
                        </li>

                        <li
                            className={openDropdown === "trainModel" || ['/model/latih', '/model/konfigurasi'].includes(location.pathname) ? "active" : ""}
                            onClick={() => toggleDropdown("trainModel")}
                        >
                            <MdOutlineRocket style={style} />
                            <p className="B2">Model</p>
                        </li>

                        {/* Conditionally render dropdown */}
                        <div className={`dropdown ${openDropdown === "trainModel" || ['/model/latih', '/model/konfigurasi'].includes(location.pathname) ? "show" : ""}`}>
                            <ul>
                                <li><NavLink to="/model/latih" activeClassName="active">Latih Model</NavLink></li>
                                {user.role === "ADMIN" ? null :
                                    <li><NavLink to="/model/konfigurasi" activeClassName="active">Konfigurasi Model</NavLink></li>
                                }
                            </ul>
                        </div>


                        <li>
                            <NavLink to="/dokumentasi" activeClassName="active">
                                <MdOutlineBook style={style} />
                                <p className="B2">Dokumentasi</p>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="sidebar_footer_profile">
                <NavLink to="/profile">
                    <img src={profile_picture} alt="profile_picture" />
                    <div>
                        <p className="B4">{user.name}</p>
                        <p className="C2">{user.email}</p>
                    </div>
                </NavLink>
            </div>
        </div>
    );
}

export default Sidebar;
