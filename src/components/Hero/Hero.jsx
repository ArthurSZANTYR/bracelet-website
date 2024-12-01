import React from 'react';

import styles from "./Hero.module.css"
import { getImageUrl } from '../../utils';

export const Hero = () => {
  return(
  <section className={styles.container}>
    <div className={styles.content}>
        <h1 className={styles.title}>Unleash Your Run </h1>
        <p className={styles.description}>Scroll to discover our bracelet
        </p>
        <a href="mailto: szantyrarthur.pro@gmail.com" className={styles.contactBtn}>Contact Us</a>
    </div>
    <div className={styles.topBlur} />
    <div className={styles.bottomBlur}/>
  </section>
  )
}