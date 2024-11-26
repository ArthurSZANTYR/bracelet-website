import Three from './components/Three/Three';
import styles from './App.module.css';
import { Navbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { About } from './components/About/About';

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
    </div>
  );
}

export default App;
