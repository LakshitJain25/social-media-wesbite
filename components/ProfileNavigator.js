import React from 'react'
import styles from '../styles/ProfileNavigator.module.css'
const ProfileNavigator = ({setNavigatorSelect,navigatorSelect}) => {
  return (
    <div className={styles.container}>
        <button 
        onClick={()=>setNavigatorSelect(0)}
        style={{backgroundColor: (navigatorSelect==0) ? "var(--color4)": "var(--color5"}}
        >Posts</button>
        <button 
        onClick={()=>setNavigatorSelect(1)}
        style={{backgroundColor: (navigatorSelect==1) ? "var(--color4)": "var(--color5"}}
        >Followers</button>
    </div>
  )
}

export default ProfileNavigator