import React from "react";
import { useState } from "react";

import styles from "./FAQ.module.css";

export const FAQ = () => {

    const [selected, setSelected] = useState(null)

    const toggle = (i) => {
        if (selected == i){
            return setSelected(null)
        }

        setSelected(i)
    }

    return(
        <div className={styles.wrapper}>
            <div className={styles.accordeon}>

                {data.map((item, i) => (
                    <div key={i} className={styles.item}>
                        <div className={styles.title} onClick={() => toggle(i)}>
                            <h2>{item.question}</h2>
                            <span>{selected == i ? '-' : '+'}</span>
                        </div>
                        <div className={`${styles.content} ${selected === i ? styles.show : ''}`}>
                            {item.answer}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const data = [
    {
        question: 'What kind of data does the product measure ?',
        answer: "The product measures your step cadence, speed (min/km), and your heart rate, with a simple LED interface for an intuitive experience."
    },

    {
        question: 'What is the battery life, and how do I recharge the product ?',
        answer: "The product offers a 7-day battery life under normal use. It charges easily via a USB-C cable included in the packaging."
    },

    {
        question: 'Is the product waterproof and suitable for sports activities ?',
        answer: "Yes, it is designed to be water-resistant (IP67 certified), making it perfect for sports and outdoor conditions."
    },

    {
        question: 'Where and how can I purchase the product?',
        answer: "You can purchase the product directly from our official website and on KickStarter after its launch in January."
    },
]