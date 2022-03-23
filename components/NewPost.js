import React, { useState } from 'react'
import styles from '../styles/NewPost.module.css'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useContext } from 'react'
import { Store } from '../utils/Store'
import Image from 'next/image'
import Loader from './Loader';
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { db, storage } from '../utils/firebase'
import { addDoc, collection, doc, serverTimestamp, updateDoc, query, where, onSnapshot, getDocs } from '@firebase/firestore'
import { getDownloadURL, uploadString, ref, uploadBytesResumable } from 'firebase/storage'
const NewPost = ({ setShowNewPost, showNewPost, toast }) => {
    const { dispatch, state } = useContext(Store)
    const [selectedImage, setSelectedImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const { userInfo } = state
    const { register, handleSubmit, formState: { errors } } = useForm()
    const router = useRouter()
    useEffect(() => {
        if (!userInfo) {
            router.push('/')
        }
    }, [router,userInfo])

    const onSubmit = async (data) => {

        setLoading(true)
        try {
            if (!selectedImage) {
                toast.error("please select an image")
                setSelectedImage(null)
                setShowNewPost(false)
                setLoading(false)
                return
            }
            const reader = new FileReader()
            let imageData
            if (data.postImage[0]) {
                reader.readAsDataURL(data.postImage[0])
            }
            reader.onload = (readerEvent) => {
                imageData = readerEvent.target.result
                setSelectedImage(readerEvent.target.result)
            }
            const postRef = collection(db, 'posts')
            const docRef = await addDoc(postRef, {
                text: data.postText,
                username: userInfo.username,
                likedBy:[],
                comments:[]

            })
            const imageRef = ref(storage, `posts/${docRef.id}/image`)
            if (imageData) {
                const uploadTask = await uploadString(imageRef, imageData, "data_url")
                const downloadUrl = await getDownloadURL(imageRef)
                await updateDoc(doc(db, "posts", docRef.id), { image: downloadUrl })
                setShowNewPost(false)
                setLoading(false)
                toast.success("successfully posted")
                router.reload(window.location.pathname)
                return
            }
        }
        catch (e) {
            
            toast.error("error occured please try again!")
            setSelectedImage(null)
            setShowNewPost(false)
            setLoading(false)
        }


    }

    return (
        <motion.div
            className={styles.container}
            style={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >

            {/* <div className={styles.container}> */}
            <div className={styles.createNewPost}>

                <span className={styles.closeBtn} onClick={() => setShowNewPost(false)}>x</span>
                <h2 className={styles.postHeading}>Create New Post</h2>
                <form action="" className={styles.postForm} onSubmit={handleSubmit((data) => onSubmit(data))}>
                    <label htmlFor="#postText"></label>
                    <textarea
                        id="postText"
                        name="postText"
                        {...register("postText")} />
                    <label htmlFor="#postImage"></label>
                    <div className={styles.imageInput} style={{ backgroundColor: (selectedImage) ? "transparent" : "black" }}>
                        {selectedImage && <Image src={selectedImage} alt="" layout="fill" className={styles.uploadImage} />}
                        <input
                            type="file"
                            accept='image/*'
                            id="postImage"
                            name="postImage"
                            onInput={(e) => {
                                const reader = new FileReader()
                                if (!e.target.files[0]) return
                                reader.readAsDataURL(e.target.files[0])
                                reader.onload = (readerEvent) => {
                                    setSelectedImage(readerEvent.target.result)
                                }
                            }}
                            className={styles.customFileInput}
                            {...register("postImage")} />
                    </div>
                    <button className={styles.postButton}>Submit</button>
                    {loading && <div className={styles.loader}>
                        <h2>uploading</h2>
                        <Loader />
                    </div>}

                </form>
            </div >
            {/* </div> */}
        </motion.div >
    )
}

export default NewPost