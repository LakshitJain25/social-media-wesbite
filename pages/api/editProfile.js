import nc from 'next-connect'
import { isAuth } from '../../utils/auth'
import { db, storage } from '../../utils/firebase'
import { addDoc, collection, doc, serverTimestamp, updateDoc, query, where, onSnapshot, getDocs } from '@firebase/firestore'
import { getDownloadURL, uploadString, ref, uploadBytesResumable } from 'firebase/storage'
const handler = nc()

handler.use(isAuth)

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

handler.post(async (req, res) => {
    const { username, bio, profileImage, bannerImage, defaultBanner, defaultProfilePic } = req.body.dataToSend
    
    const userRef = collection(db,"users")
    const userQuery = query(userRef, where("username", "==", username))
    const querySnapshot = await getDocs(userQuery)
    const docId = querySnapshot.docs[0].id
    try{
    const processedProfileImage = await readImage(profileImage, defaultProfilePic, "pf", docId)
    const processedBannerImage = await readImage(bannerImage, defaultBanner, "bn", docId)
    const updatedDoc = await updateDoc(doc(db, "users", docId),{
        profilePic: processedProfileImage,
        bannerImage:processedBannerImage,
        bio:bio
    })
    res.status(200).json({
        bio,
        profilePic: processedProfileImage,
        bannerImage:processedBannerImage,
    })

}
catch(e){
   
    res.status(401).json({
        message:"error"
    })
}


})

export default handler