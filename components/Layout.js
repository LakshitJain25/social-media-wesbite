import React, { useState, useContext } from 'react'
import styles from '../styles/Layout.module.css'
import Image from 'next/image'
import { motion } from 'framer-motion'
import jsCookie from 'js-cookie'
import NewPost from './NewPost';
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { Store } from './../utils/Store';
const Layout = ({ children }) => {
    const { state, dispatch } = useContext(Store)
    const { userInfo, defaultProfilePic } = state
    const [showNewPost, setShowNewPost] = useState(false)
    const [showNav, setShowNav] = useState(false)
    const router = useRouter()
    const logout = () => {
        dispatch({ type: "LOGOUT" })
        jsCookie.remove('userInfo')
        router.reload(window.location.pathname)

    }
    return (
        <motion.div className={styles.container} style={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} >
            <ToastContainer />
            {showNewPost && <NewPost
                setShowNewPost={setShowNewPost}
                showNewPost={showNewPost}
                toast={toast}
            />}
            <header className={styles.header}>
                <Link href={"/"} passHref>
                    <div className={styles.left}>
                        <h2 className={styles.logo}>HQSocial</h2>
                        <div className={styles.homeIcon}><i className="fas fa-home"></i></div>
                    </div>
                </Link>
                <div className={styles.center}>
                    <h2 className={styles.middleHeading}>Main Stream</h2>
                    <div className={styles.searchNavbar}>
                        <i className="fas fa-search"></i>
                        <button className={styles.createButton} onClick={() => setShowNewPost(true)}>Post</button>
                    </div>
                </div>
                {showNav && <motion.div style={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} >
                    <nav className={styles.navigation}>
                        <div className={styles.profileInfo}>
                            <Image
                                src={(userInfo && userInfo.profilePic) ? userInfo.profilePic : defaultProfilePic}
                                className={styles.userImage}
                                height={73}
                                width={73}
                                alt="" />
                            <h3 className={styles.username}>{(userInfo) ? userInfo.username : null}</h3>
                        </div>
                        {userInfo && <ul className={styles.navList}>
                            <Link href={`/profile/${userInfo.username}`} passHref>
                                <li className={styles.navItem} onClick={()=>{setShowNav(false)}}>
                                    <i className="fas fa-user"></i>
                                    <h3 className={styles.navItemHeading}>Profile</h3>
                                </li>
                            </Link>
                            <Link href={`/`} passHref>
                                <li className={styles.navItem} onClick={()=>{setShowNav(false)}}>
                                    <i className="fas fa-images"></i>
                                    <h3 className={styles.navItemHeading}>Posts</h3>
                                </li>
                            </Link>
                            <Link href={`/users`} passHref >
                                <li className={styles.navItem} onClick={()=>{setShowNav(false)}}>
                                    <i className="fas fa-user-friends"></i>
                                    <h3 className={styles.navItemHeading}>People</h3>
                                </li>
                            </Link>
                            <li className={styles.navItem} onClick={() => { logout() }}>
                                <i className="fas fa-sign-out-alt"></i>
                                <h3 className={styles.navItemHeading}>Logout</h3>
                            </li>

                        </ul>}
                    </nav>
                </motion.div>}
                <div className={styles.right} >
                    {(showNav) ?
                        <h3 className={styles.closeBtn} onClick={() => { setShowNav(false) }}>x</h3> :
                        <i className={`fas fa-bars ${styles.burger}`} onClick={() => { setShowNav(true) }}></i>}

                    <i className={`fas fa-bell ${styles.bell}`}></i>
                    <Link href={`/profile/${(userInfo) ? userInfo.username : ""}`} passHref>
                        <div className={styles.userInfo} >
                            <h3 className={styles.username}>{(userInfo) ? userInfo.username : null}</h3>
                            <Image
                                src={(userInfo && userInfo.profilePic) ? userInfo.profilePic : defaultProfilePic}
                                className={styles.userImage}
                                height={43}
                                width={43}
                                alt="" />
                        </div>
                    </Link>

                </div>
            </header>
            <main className={styles.main}>
                {children}
            </main>
        </motion.div>
    )
}

export default Layout