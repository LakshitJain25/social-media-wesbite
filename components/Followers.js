import React from 'react'
import styles from '../styles/Followers.module.css'
import Image from 'next/image'
import { db, storage } from '../utils/firebase'
import { addDoc, collection, doc, serverTimestamp, updateDoc, query, where, onSnapshot, getDocs } from '@firebase/firestore'
import { getDownloadURL, ref, uploadString } from '@firebase/storage'
import Link from 'next/link'
import { useState, useContext, useEffect } from 'react'
import { Store } from '../utils/Store'
const Followers = ({ followers }) => {
  const { state, dispatch } = useContext(Store)
  const { userInfo, defaultProfilePic } = state

  const Follower = ({ follower }) => {
    const [profileImage, setProfileImage] = useState(defaultProfilePic)
    const getProfilePic = async () => {
      const userRef = collection(db, "users")
      const userQuery = query(userRef, where("username", "==", follower))
      const userQuerySnapshot = await getDocs(userQuery)
      const { profilePic } = userQuerySnapshot.docs[0].data()
      setProfileImage((profilePic) ? (profilePic) : defaultProfilePic)
    }
    getProfilePic()

    return (
      <div className={styles.followerContainer}>
        <Link href={`/profile/${follower}`} alt={follower} passHref >
          <div className={styles.followerBox}>
            <div className={styles.profilePic}>
              <Image alt={follower} src={(profileImage) ? profileImage : defaultProfilePic} layout="fill" />
            </div>
            <h2 className={styles.followerName}>{follower}</h2>
          </div>
        </Link>
      </div>);
  }

  return (
    <div className={styles.container}>
      {followers.map((follower, index) => (<Follower follower={follower} key={index} />))}
    </div>
  )
}



export default Followers