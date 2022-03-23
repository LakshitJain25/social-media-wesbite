import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from '../styles/Register.module.css'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useContext } from 'react'
import { Store } from '../utils/Store'
import { motion } from 'framer-motion'
import { db, storage } from '../utils/firebase'
import { addDoc, collection, doc, serverTimestamp, updateDoc, query, where, onSnapshot, getDocs } from '@firebase/firestore'
import { getDownloadURL, ref, uploadString } from '@firebase/storage'
import bcrypt from "bcryptjs"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';


let passwordValidator = require('password-validator');
const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const { state, dispatch } = useContext(Store)
    const { userInfo } = state
    const router = useRouter()

    useEffect(() => {

        if (userInfo) {
            
            router.push('/')
        }
    }, [])

    const registerUser = async () => {

        
        const userRef = collection(db, "users")
        if (!userRef) return
        const checkUserExistQuery = query(userRef, where('username', "==", username.toLowerCase()))
        const querySnapshot = await getDocs(checkUserExistQuery)
        
        if (querySnapshot.docs.length > 0) {
            toast.error("username exists!")
            return
        }
        const docRef = await addDoc(userRef, {
            username: username.toLowerCase(),
            profilePic:null,
            bannerImage:null,
            bio:null,
            password: bcrypt.hashSync(password),
            followers:[]
           
        })
        toast.success("Registered")
        router.push('/login')
    }

    const onSubmit = (data) => {
        registerUser()
    }
    let schema = new passwordValidator()
    schema
        .is().min(8)
        .has().uppercase()
        .has().digits(1)
    const validatePassword = (checkPassword) => {
        
        return schema.validate(checkPassword)
    }
    const confirmPasswordMatch = () => {
        return password === confirmPassword
    }
    return (
        <motion.div className={styles.container} style={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} >
            <div className={styles.image}>
                <Image alt="" src={'/login-page/register.png'} height={500} width={600} />
            </div>
            <div className={styles.registerFormContainer}>
                <h2>Register</h2>
                <form action="" className={styles.registerForm} autoComplete="off" onSubmit={handleSubmit((data) => onSubmit(data))}>
                    <div className={styles.username} >
                        <ToastContainer />
                        <label htmlFor="#username">Username</label>
                        <input type="text" id='username' {...register('username', { required: true })} required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    {errors && errors.username && <p className={styles.errorMessage}>required</p>}
                    <div className={styles.password}>
                        <label htmlFor="#password">Password</label>
                        <input
                            type="password"
                            id='password'
                            name="password"
                            {...register('password', { required: true, validate: validatePassword })}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {errors && errors.password && <p className={styles.errorMessage}>password must have one digit and an uppercase character and min length 8 characters</p>}

                    <div className={styles.confirmPassword}>
                        <label htmlFor="#confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id='confirmPassword'
                            {...register('confirmPassword', { required: true, validate: confirmPasswordMatch })}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    {errors && errors.confirmPassword && <p className={styles.lasterrorMessage}>passwords do not match</p>}
                    <button type='submit'>Register</button>
                </form>
                <div className={styles.login}>
                    <h3>Already have an account?</h3>
                    <Link href={"/login"}>login</Link>
                </div>
            </div>
        </motion.div >
    )
}

export default Register