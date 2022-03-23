import React from 'react'
import styles from '../styles/Categories.module.css'
import Image from 'next/image'
const Categories = () => {

    const Category = ({ image, name }) => {
        return (
            <div className={styles.categoryContainer}>
                <div className={styles.image}>
                    <Image src={image} layout="fill" alt={name} />
                </div>
                <div className={styles.details}>
                    <h3>{name}</h3>
                </div>
            </div>
        );
    }


    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>CATEGORIES</h2>
            <div className={styles.categories}>
                <Category image="/gaming.jpg" name="Gaming" />
                <Category image="/sports.jpg" name="Sports" />
                <Category image="/technology.jpg" name="Technology" />
                <Category image="/nature.jpeg" name="Nature" />


            </div>
        </div>
    )
}

export default Categories