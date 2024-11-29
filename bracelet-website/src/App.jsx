import Three from './components/Three/Three';
import styles from './App.module.css';
import { Navbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { About } from './components/About/About';
import { Contact } from './components/Contact/Contact';
import { FAQ } from './components/FAQ/FAQ';


function App() {
  return (
    <div className={styles.App}>
      
      <div id="three">
        <Three />
      </div>
      <div id="navbar">
        <Navbar />
      </div>
      <div class="section" id="hero">
        <Hero />
      </div>
      <div class="section" id="about">
        <About />
      </div>
      <div class="section" id="FAQ">
        <FAQ />
      </div>
      <div class="section" id="contact">
        <Contact />
      </div>
    </div>
  );
}

export default App;
