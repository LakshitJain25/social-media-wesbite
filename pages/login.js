import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router';
import { Store } from '../utils/Store'
import Image from 'next/image'
import Head from 'next/head'
import axios from 'axios';
import styles from '../styles/Login.module.css'
import Link from 'next/link'
import { signToken } from '../utils/auth'
import { db, storage } from '../utils/firebase'
import { tokenSign } from './api/authorize';
import { addDoc, collection, doc, serverTimestamp, updateDoc, query, where, onSnapshot, getDocs } from '@firebase/firestore'
import { getDownloadURL, ref, uploadString } from '@firebase/storage'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import jsCookie from 'js-cookie';
import bcrypt from 'bcryptjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {
    const { state, dispatch } = useContext(Store)
    const router = useRouter()
    const { userInfo } = state
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const { register, handleSubmit, errors } = useForm()

    useEffect(() => {

        if (userInfo) {
            router.push('/')
        }
    }, [router,userInfo])

    const onSubmit = async (data) => {
        
        if (userInfo) {
            router.push('/')
        }
        try {
            const userRef = collection(db, "users")
            if (!userRef) return
            const userQuery = query(userRef, where("username", "==", username.toLowerCase()))
            const querySnapshot = await getDocs(userQuery)
            if(!querySnapshot.docs[0].data()){throw new Error("invalid userId or Password")}
            const { username: trueUsername, password: truePassword, profilePic, bannerImage, bio } = querySnapshot.docs[0].data()
            if (!bcrypt.compareSync(password, truePassword)) {
                toast.error("invalid username or password")
                return
            }
            const { data: dataToSend } = await axios.post('/api/authorize', { username, profilePic, bannerImage, bio })
            dispatch({ type: "LOGIN", payload: dataToSend })
            jsCookie.set('userInfo', JSON.stringify(dataToSend))
            router.push('/')
        } catch (e) {
            toast.error("invalid username or password")
            return
            
        }
    }
    return (
        <>
            <Head>
                <title>Login</title>
                <meta name="description" content="Generated by create next app" />
                
            </Head>
            <motion.div className={styles.container} style={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} >
                <div className={styles.image}>
                    <Image alt="" src={'/login-page/login-bg.png'} height={550} width={600} />
                </div>
                <ToastContainer />
                <div className={styles.loginFormContainer}>
                    <h2>LOGIN</h2>
                    <form action="" className={styles.loginForm} autoComplete="off" onSubmit={handleSubmit((data) => onSubmit(data))}>
                        <div className={styles.username} >
                            <label htmlFor="#username">Username</label>
                            <input
                                type="text"
                                id='username'
                                {...register('username', { required: true })}
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase())} />
                        </div>
                        <div className={styles.password}>
                            <label htmlFor="#password">Password</label>
                            <input
                                type="password"
                                id='password'
                                {...register('password', { required: true })}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type='submit'>Login</button>
                    </form>
                    <div className={styles.register}>
                        <h3>Dont have an account?</h3>
                        <Link href="/register">register</Link>
                    </div>
                </div>
            </motion.div>
        </>
    )
}

export default Login