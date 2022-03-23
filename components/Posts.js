import React, { useRef } from 'react'
import styles from '../styles/Posts.module.css'
import Image from 'next/image'
import { db, storage } from '../utils/firebase'
import { addDoc, collection, doc, serverTimestamp, updateDoc, query, where, onSnapshot, getDocs } from '@firebase/firestore'
import { getDownloadURL, ref, uploadString } from '@firebase/storage'
import Link from 'next/link'
import { useState, useContext, useEffect } from 'react'
import { Store } from '../utils/Store'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'

const Posts = ({ posts }) => {
  const { state, dispatch } = useContext(Store)
  const { userInfo, defaultProfilePic } = state



  const Post = ({ name, postText, postImage, comments, likedBy, postId }) => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const commentRef = useRef(null)
    const [showImage, setShowImage] = useState(false)
    const [profileImage, setProfileImage] = useState(defaultProfilePic)
    const [postLikedBy, setPostLikedBy] = useState(likedBy)
    const [commentsState, setCommentsState] = useState(comments)
    const [myUsername, setMyUsername] = useState(userInfo ? userInfo.username : "")
    const [commentInput, setCommentInput] = useState("")
    const [liked, setLiked] = useState(likedBy.includes((userInfo && userInfo.username) ? userInfo.username : ""))
    const getProfilePic = async () => {
      const userRef = collection(db, "users")
      const userQuery = query(userRef, where("username", "==", name))
      const userQuerySnapshot = await getDocs(userQuery)
      const { profilePic } = userQuerySnapshot.docs[0].data()
      setProfileImage((profilePic) ? (profilePic) : defaultProfilePic)
    }
    getProfilePic()
    useEffect(() => {
      // setLiked(likedBy.includes((userInfo && userInfo.username) ? userInfo.username : ""))
      setMyUsername(userInfo ? userInfo.username : "")
      setPostLikedBy(likedBy)
    }, [likedBy])





    const ShowImage = ({ image, setShowImage }) => {
      
      return (
        <motion.div className={styles.showImageContainer} style={{ opacity: 0 }}
        animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <span className={styles.closeBtn} onClick={() => setShowImage(false)}>x</span>
          <div className={styles.showImage}>
            <Image alt={"showImage"} src={postImage} layout="fill" />
          </div>
        </motion.div>
      )
    }









    const updateLikes = async () => {
      
      try {
        const postRef = doc(db, "posts", postId)
        
        if (!postRef) return
        
        if (postLikedBy.includes((userInfo && userInfo.username) ? userInfo.username : "")) {
          likedBy = postLikedBy.filter((likedUser) => likedUser !== userInfo.username)
          setLiked(false)

          setPostLikedBy(likedBy)
          //
          // await updateDoc(postRef, { likedBy, likesCount })
        }
        else {
          likedBy = [...postLikedBy, userInfo.username]
          setLiked(true)
          setPostLikedBy(likedBy)


        }
        // const querySnapshot = await getDocs(postRef)
        // const {likedBy,likesCount} = querySnapshot.docs[0].data()
        await updateDoc(postRef, { likedBy })
      }
      catch (e) {
        
      }
    }


    const addComment = async ({ comment }) => {
      try {

        const postRef = doc(db, "posts", postId)
        comments = [...comments, {
          commentBy: myUsername,
          commentText: comment
        }]
        setCommentsState(comments)
        setCommentInput("")
        await updateDoc(postRef, { comments })

      }
      catch (e) {
        
      }
    }

    return (
      <div className={styles.postContainer}>
        {showImage && <ShowImage image={postImage} setShowImage={setShowImage}/>}
        <div className={styles.opInfo}>
          <Link href={`/profile/${name}`} passHref>
            <div className={styles.opImage}><Image alt={name} src={profileImage} layout="fill" /></div>
          </Link>
          <h3 className={styles.opName}>{name}</h3>
        </div>
        <div className={styles.postContent}>
          <div className={styles.postText}>{postText}</div>
          {(postImage !== null && postImage !== "") ?

            <div className={styles.postImage} onClick={() => setShowImage(true)}>
              <Image alt={postText} src={postImage} layout="fill" />
            </div>
            : ""}
        </div>
        <div className={styles.buttons}>
          <div className={styles.button}>
            <i className="fas fa-thumbs-up"
              onClick={() => updateLikes()}
              style={{
                color: (liked) ?
                  "var(--color6)" : "var(--color4)"
              }}
            />
            <span className={styles.count}>{postLikedBy.length}</span>
          </div>

          <div className={styles.button}>
            <i className="fas fa-share-alt"></i>
          </div>
          <Link href={`/comments/${postId}`} passHref >
            <div className={styles.button}>
              <i className="fas fa-comment"></i>
              <span className={styles.count}>{commentsState.length}</span>
            </div>
          </Link>
        </div>

        <div className={styles.commentBox}>
          <div className={styles.profilePic} >
            <Image alt={name} src={(userInfo && userInfo.profilePic) ? userInfo.profilePic : defaultProfilePic} layout="fill" />
          </div>
          <form action="" className={styles.commentForm} onSubmit={handleSubmit((data) => addComment(data))} >
            <input
              type="text"
              placeholder='comment'
              autoComplete="off"
              value={commentInput}
              className={styles.commentInput}
              {...register("comment", {
                onChange: (e) => { setCommentInput(e.target.value) }
              })} required />
            <button type='submit' className={styles.commentButton}>send</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      
      {(userInfo) && posts && posts.map((post, index) => (<Post
        key={index}
        name={post.username}
        likedBy={post.likedBy}
        postText={post.text}
        postImage={post.image}
        comments={post.comments}
        postId={post.postId} />)
      )}
    </div>
  )
}



export default Posts