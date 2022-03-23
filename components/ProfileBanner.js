import React, { useContext, useState } from 'react'
import { Store } from '../utils/Store'
import styles from '../styles/ProfileBanner.module.css'
import Image from 'next/image';
import { db, storage } from '../utils/firebase'
import { addDoc, collection, doc, serverTimestamp, updateDoc, query, where, onSnapshot, getDocs } from '@firebase/firestore'
import { getDownloadURL, uploadString, ref } from 'firebase/storage'
const ProfileBanner = ({ setShowEditProfile, profilePageInfo }) => {
    const date = new Date()
    let time = date.getTime()
    
    const { state, dispatch } = useContext(Store)
    const { defaultBanner, userInfo, defaultProfilePic } = state
    const { profilePic, bannerImage, username, bio, followers } = (profilePageInfo) ?
        profilePageInfo :
        {
            profilePic: defaultProfilePic,
            bannerImage: defaultBanner,
            username: "user not found!",
            bio: "",
            followers: null
        }

    const [followersState, setFollowersState] = useState(followers)
    const follow = async () => {
        try {
            const userRef = collection(db, "users")
            const userQuery = query(userRef, where("username", "==", username))
            const userQuerySnapshot = await getDocs(userQuery)
            const refId = userQuerySnapshot.docs[0].id
            const newFollowers = [...followersState, userInfo.username]
            await updateDoc(doc(db, "users", refId), {
                followers: newFollowers
            })
            setFollowersState(newFollowers)
        }
        catch (e) {
            
        }
    }

    const unfollow = async () => {
        try {
            const userRef = collection(db, "users")
            const userQuery = query(userRef, where("username", "==", username))
            const userQuerySnapshot = await getDocs(userQuery)
            const refId = userQuerySnapshot.docs[0].id
            const newFollowers = followersState.filter((followerName) => followerName !== userInfo.username)
            await updateDoc(doc(db, "users", refId), {
                followers: newFollowers
            })
            setFollowersState(newFollowers)
        }
        catch (e) {
            
        }
    }

    const bannerBackgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${bannerImage})`
    
    return (
        <div className={styles.container}
            style={{
                backgroundImage: bannerBackgroundImage,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "none"
            }}>
            <div className={styles.profileInfo}>
                <div className={styles.profilePic} >
                    <Image
                        src={(profilePic) ? profilePic : defaultProfilePic}
                        layout={"fill"}
                        alt="" />
                </div>
                <div className={styles.profileInfoText}>
                    <h2 className={styles.username}>{username}</h2>
                    <p className={styles.bio}>{(bio) ? bio : ""}</p>
                    {/* <p>{bannerImage}</p> */}
                </div>
                {(userInfo && (username == userInfo.username)) ?
                    <button className={styles.editProfileBtn} onClick={() => setShowEditProfile(true)}>Edit Profile</button> :
                    (followers && userInfo && followersState.includes(userInfo.username)) ?
                        <button className={styles.editProfileBtn} onClick={() => unfollow()} >Unfollow</button> :
                        (followers) ? <button className={styles.editProfileBtn} onClick={() => follow()}>Follow</button> : null}
            </div>
        </div>
    )
}

export default ProfileBanner