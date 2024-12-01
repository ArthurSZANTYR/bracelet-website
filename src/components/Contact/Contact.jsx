import React from "react";

import styles from "./Contact.module.css";
import { getImageUrl } from "../../utils";

export const Contact = () => {
  return (
    <footer id="contact" className={styles.container}>
      <div className={styles.text}>
        <h2>Contact</h2>
        <p>Feel free to reach out!</p>
      </div>
      <ul className={styles.links}>
        <li className={styles.link}>
          <img src={getImageUrl("contact/instagram.png")} alt="Instagram icon" />
          <a href="https://www.instagram.com/freerun.tech">@freerun.tech</a>
        </li>
      </ul>
    </footer>
  );
};
