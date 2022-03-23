import React, { useState } from 'react'
import axios from 'axios'
import styles from '../styles/EditProfile.module.css'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useContext } from 'react'
import { Store } from '../utils/Store'
import jsCookie from 'js-cookie'
import Image from 'next/image'
import Loader from './Loader';
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { db, storage } from '../utils/firebase'
import { addDoc, collection, doc, serverTimestamp, updateDoc, query, where, onSnapshot, getDocs } from '@firebase/firestore'
import { getDownloadURL, uploadString, ref, uploadBytesResumable } from 'firebase/storage'

const EditProfile = ({ setShowEditProfile, toast }) => {
    const { dispatch, state } = useContext(Store)
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState((userInfo && userInfo.profilePic) ? userInfo.profilePic : null)
    const { userInfo, defaultProfilePic, defaultBanner } = state
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            bio: ((userInfo && userInfo.bio) ? userInfo.bio : "")
        }
    })
    const [selectedProfileImage, setSelectedProfileImage] = useState((userInfo && userInfo.profilePic) ? userInfo.profilePic : defaultProfilePic)
    const [selectedBannerImage, setSelectedBannerImage] = useState((userInfo && userInfo.bannerImage) ? userInfo.bannerImage : defaultBanner)
    const router = useRouter()
    // const [stateBio, setStateBio] = useState((userInfo && userInfo.bio) ? userInfo.bio : "")
    useEffect(() => {
       
        setUsername((userInfo && userInfo.username) ? userInfo.username : null)
        if (!userInfo) {
            router.push('/')
        }
    }, [router,userInfo])



    const readImage = async (image, defaultImage, type, id) => {
        
        try {
            if (!image || (image == defaultImage)) return defaultImage
            const imageRef = ref(storage, `users/${id}/${type}`)

            const uploadstring = await uploadString(imageRef, image, "data_url")
            
            const download_url = await getDownloadURL(imageRef)

            return download_url
        }
        catch (e) {
            
            return defaultImage
        }

    }




    const onSubmit = async (data) => {
        setLoading(true)
        
        const bio = data.bio
        const profileImage = selectedProfileImage
        const bannerImage = selectedBannerImage
        const dataToSend = {
            username: username,
            bio,
            profileImage,
            bannerImage,
            defaultBanner: userInfo.bannerImage,
            defaultProfilePic: userInfo.profilePic
        }

        try {
           
            const userRef = collection(db, "users")
           
            const userQuery = query(userRef, where("username", "==", username))
            const querySnapshot = await getDocs(userQuery)
            
            const docId = querySnapshot.docs[0].id
            
            const processedProfileImage = await readImage(profileImage, defaultProfilePic, "pf", docId)
            const processedBannerImage = await readImage(bannerImage, defaultBanner, "bn", docId)
            const updatedDoc = await updateDoc(doc(db, "users", docId), {
                profilePic: processedProfileImage,
                bannerImage: processedBannerImage,
                bio: bio
            })
            const returnedData = {
                profilePic: processedProfileImage,
                bannerImage: processedBannerImage,
                bio: bio
            }

            
            const dataToSendCookie = { ...userInfo, ...returnedData }
            
            
            jsCookie.set('userInfo', JSON.stringify(dataToSendCookie))
            dispatch({ type: "LOGIN", payload: dataToSendCookie })
            setLoading(false)
            router.push('/')

        }
        catch (e) {
            toast.error("Something went wrong!")
            setLoading(false)
            setShowEditProfile(false)
            
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
            <div className={styles.editProfile}>
                <span className={styles.closeBtn} onClick={() => setShowEditProfile(false)}>x</span>
                <h2 className={styles.postHeading}>Edit Profile</h2>
                <form
                    action=""
                    className={styles.editForm}
                    style={{
                        backgroundImage: selectedBannerImage ? `url(${selectedBannerImage})` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "none"
                    }}
                    onSubmit={handleSubmit((data) => onSubmit(data))}>
                    <div className={styles.formSubContainer}>
                        <div className={styles.imageContainer}>
                            <Image src={selectedProfileImage} alt="" layout="fill" />
                        </div>
                        <input
                            type="file"
                            accept='image/*'
                            id="editProfileImage"
                            name="editProfileImage"
                            onInput={(e) => {
                                const reader = new FileReader()
                                if (!e.target.files[0]) return
                                reader.readAsDataURL(e.target.files[0])
                                reader.onload = (readerEvent) => {
                                    setSelectedProfileImage(readerEvent.target.result)
                                }
                            }}
                            className={styles.customFileInput}
                            {...register("editProfileImage")} />

                        <div className={styles.bioInput}>
                            <input
                                type="text"
                                name="bio"
                                id="bio"
                                placeholder="bio"
                                {...register("bio")}
                            />
                        </div>

                        <button className={styles.editButton} type="submit">Edit</button>
                    </div>
                    <div className={styles.bannerInput}>
                        <input
                            type="file"
                            accept='image/*'
                            id="editBannerImage"
                            name="editBannerImage"
                            onInput={(e) => {
                                const reader = new FileReader()
                                if (!e.target.files[0]) return
                                reader.readAsDataURL(e.target.files[0])
                                reader.onload = (readerEvent) => {
                                    setSelectedBannerImage(readerEvent.target.result)
                                }
                            }}
                            className={styles.bannerFileInput}
                            {...register("editBannerImage")} />
                    </div>
                    {loading && <div className={styles.loader}>
                        <h2>processing</h2>
                        <Loader />
                    </div>}
                </form>
            </div >
            {/* </div> */}
        </motion.div >
    )
}

export default EditProfile