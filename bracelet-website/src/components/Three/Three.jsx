import * as THREE from 'three';
import { useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Three = () => {
  useEffect(() => {
    const camera = new THREE.PerspectiveCamera(
      10,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 1;

    const scene = new THREE.Scene();
    let bracelet;

    const loader = new GLTFLoader();
    loader.load(
      '/assets/three/apple_watch_ultra_2.glb', // Assurez-vous que ce chemin est correct
      (gltf) => {
        bracelet = gltf.scene;
        scene.add(bracelet);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('An error happened', error);
      }
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.zIndex = '9999'; // Z-index élevé pour qu'il soit devant tout

    const container = document.getElementById('container3D');
    if (container) {
      container.appendChild(renderer.domElement);
    }

    // Ajout des lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 1);
    topLight.position.set(500, 500, 500);
    scene.add(topLight);

    // Boucle d'animation
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Nettoyage pour éviter les fuites de mémoire
    return () => {
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div id="container3D"></div>;
};

export default Three;
