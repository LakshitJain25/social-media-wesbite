import React, { useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import styles from '../styles/Comments.module.css'
import { ToastContainer, toast } from 'react-toastify';
import { db, storage } from '../utils/firebase'
import { addDoc, collection, doc, serverTimestamp, updateDoc, query, where, onSnapshot, getDocs, getDoc } from '@firebase/firestore'
import { getDownloadURL, ref, uploadString } from '@firebase/storage'
import 'react-toastify/dist/ReactToastify.css';
import Categories from '../components/Categories'
import Image from 'next/image'
import { Store } from '../utils/Store'


const Comments = ({ comments }) => {
    
    const { state, dispatch } = useContext(Store)
    const { userInfo, defaultProfilePic } = state
    const Comment = ({ comment }) => {
        
        
        const [profileImage, setProfileImage] = useState(defaultProfilePic)
        const getProfilePic = async () => {
            const userRef = collection(db, "users")
            const userQuery = query(userRef, where("username", "==", comment.commentBy))
            const userQuerySnapshot = await getDocs(userQuery)
            const { profilePic } = userQuerySnapshot.docs[0].data()
            setProfileImage((profilePic) ? (profilePic) : defaultProfilePic)
        }
        getProfilePic()

        return (
            <div className={styles.commentContainer}>
                <div className={styles.profilePic}>
                    <Image alt={comment.commentBy} src={profileImage ?profileImage : defaultProfilePic} layout="fill" />
                </div>
                <div className={styles.commentText}>
                    <h2 className={styles.commentBy}>{comment.commentBy}</h2>
                    <p>{comment.commentText}</p>
                </div>
            </div>
        )

    }
    return (
        <div className={styles.container}>
            <h2 className={styles.commentsHeading}>Comments</h2>
            {comments.map((comment, index) => { return(<Comment comment={comment} key={index} />) })}
        </div>)

}


export default Comments