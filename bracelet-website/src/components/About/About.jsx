import React from 'react';

import styles from "./About.module.css";
import { getImageUrl } from '../../utils';

export const About = () => {
  return (
    <section className={styles.container} id='about'>
        <div className={styles.content}>
            <ul className={styles.aboutItems}>
                <li className={styles.aboutItem}>
                    <div className={styles.aboutItemText}>
                        <h3>Designed for Freedom</h3>
                        <p>Run without distractions - Focus on what matters</p>
                    </div>
                </li>
                <li className={styles.aboutItem}>
                    <div className={styles.aboutItemText}>
                        <h3>Empowering Your Performance</h3>
                        <p>Track your metrics - Elevate your training</p>
                    </div>
                </li>
                <li className={styles.aboutItem}>
                    <div className={styles.aboutItemText}>
                        <h3>Innovative Design, Seamless Experience</h3>
                        <p>Comfortable and intuitive - Your running companion</p>
                    </div>
                </li>
            </ul>
        </div>
    </section>
  )
}