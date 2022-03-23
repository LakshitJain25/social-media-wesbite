import React from 'react'
import styles from '../styles/Users.module.css'
import Followers from '../components/Followers';
import Layout from './../components/Layout';
import { db, storage } from '../utils/firebase'
import { addDoc, collection, doc, serverTimestamp, updateDoc, query, where, onSnapshot, getDocs } from '@firebase/firestore'
import { getDownloadURL, uploadString, ref } from 'firebase/storage'
const Users = ({ users }) => {
    return (

        <Layout>
            <div className={styles.container}>
                <div className={styles.followers}>
                    <h2 className={styles.heading}>Meet New People!</h2>
                    <Followers followers={users} />
                </div>
            </div>
        </Layout>

    )
}

export const getServerSideProps = async () => {

    let users = []
    const userRef = collection(db, "users")
    const userQuery = query(userRef)
    const userQuerySnapshot = await getDocs(userQuery)

    userQuerySnapshot.forEach((snapshot) => {
        users.push(snapshot.data().username)
    })

    return {
        props: {
            users
        }
    }

}



export default Users