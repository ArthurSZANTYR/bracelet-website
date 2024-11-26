import * as THREE from 'three';
import { useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {gsap} from 'https://cdn.skypack.dev/gsap'

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
      '/assets/three/bracelet.gltf', // Assurez-vous que ce chemin est correct
      (gltf) => {
        bracelet = gltf.scene;
        
        scene.add(bracelet);

        modelMove();
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

    //helper
    const axesHelper = new THREE.AxesHelper(1);
    scene.add(axesHelper);

    // Ajout des lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 1);
    topLight.position.set(500, 500, 500);
    scene.add(topLight);

    // Boucle d'animation
    const reRender3D = () => {
      requestAnimationFrame(reRender3D);
      renderer.render(scene, camera);
    };
    reRender3D();

    let arrPositionModel = [
      {
        id: 'hero',
        position: {x:-0.045, y:-0.01, z:0.5},
        rotation: {x:1.5, y:1.57, z:0},
      },
      {
        id: 'about',
        position: {x:0.01, y:-0.049, z:0.65},
        rotation: {x:1.5, y:2.5, z:0},
      },
    ];

    const modelMove = () => {
      const sections = document.querySelectorAll('.section');
      let currentSection;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if(rect.top <= window.innerHeight / 3) {
          currentSection = section.id;
        }
      });
      let position_active = arrPositionModel.findIndex(
        (val) => val.id == currentSection
      );
      if(position_active >= 0){
        let new_coordinates = arrPositionModel[position_active];
        gsap.to(bracelet.position, {
          x: new_coordinates.position.x,
          y: new_coordinates.position.y,
          z: new_coordinates.position.z,
          duration: 1,
          ease: 'power1.Out'
        });
        gsap.to(bracelet.rotation, {
          x: new_coordinates.rotation.x,
          y: new_coordinates.rotation.y,
          z: new_coordinates.rotation.z,
          duration: 1,
          ease: 'power1.Out'
        });
      }

    }
    window.addEventListener('scroll', ()=> {
      if(bracelet){
        modelMove();
      }
    })

    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    })

    // Nettoyage pour éviter les fuites de mémoire
    return () => {
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div id="container3D"></div>;
};

export default Three;
