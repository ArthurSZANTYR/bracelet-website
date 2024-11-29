import * as THREE from 'three';
import { useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { gsap } from 'https://cdn.skypack.dev/gsap';

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
    let originalMaterials = [];
    let animationInterval;

    const loader = new GLTFLoader();
    loader.load(
      '/assets/three/bracelet.glb',
      (gltf) => {
        bracelet = gltf.scene;
        scene.add(bracelet);

        const ledArray = [];
        bracelet.traverse((child) => {
          if (child.name.includes('led')) {
            ledArray.push(child);
            originalMaterials.push(child.material); // Sauvegarde des matériaux originaux
          }
        });

        // Réorganiser les LEDs si nécessaire
        const led4Index = 0;
        const led4 = ledArray.splice(led4Index, 1)[0];
        const middleIndex = Math.floor(ledArray.length / 2);
        ledArray.splice(middleIndex, 0, led4);

        modelMove(ledArray);
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
    renderer.domElement.style.zIndex = '7';
    renderer.domElement.style.pointerEvents = 'none';

    const container = document.getElementById('container3D');
    if (container) {
      container.appendChild(renderer.domElement);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 1);
    topLight.position.set(500, 500, 500);
    scene.add(topLight);

    const reRender3D = () => {
      requestAnimationFrame(reRender3D);
      renderer.render(scene, camera);
    };
    reRender3D();

    let arrPositionModel = [
      {
        id: 'hero',
        position: { x: -0.045, y: -0.01, z: 0.5 },
        rotation: { x: 1.5, y: 1.57, z: 0 },
      },
      {
        id: 'about',
        position: { x: 0.01, y: -0.049, z: 0.65 },
        rotation: { x: 1.5, y: 2.5, z: 0 },
      },
      {
        id: 'FAQ',
        position: { x: 0.05, y: -0.01, z: 0.5 },
        rotation: { x: 0.4, y: -1.56, z: 0 },
      },
    ];

    const resetLEDs = (ledArray) => {
      ledArray.forEach((led, index) => {
        led.material = originalMaterials[index]; // Réapplique les matériaux d'origine
      });
    };

    const animateLEDs = (ledArray, animationType) => {
      if (animationInterval) clearInterval(animationInterval);

      if (animationType === 'sequential') {
        const newMaterial = new THREE.MeshStandardMaterial({
          color: 0xff0000,
          emissive: 0xff0000,
          metalness: 0.9,
          roughness: 0.1,
        });

        const lightUpLED = (index) => {
          if (index >= ledArray.length) return;
          ledArray[index].material = newMaterial;
          setTimeout(() => lightUpLED(index + 1), 250);
        };

        lightUpLED(0);
      } else if (animationType === 'blinking') {
        const newMaterial = new THREE.MeshStandardMaterial({
          color: 0x00ff00,
          emissive: 0x00ff00,
          metalness: 0.9,
          roughness: 0.1,
        });

        let isLit = false;
        animationInterval = setInterval(() => {
          isLit = !isLit;
          ledArray.forEach((led) => {
            led.material = isLit
              ? newMaterial
              : originalMaterials[ledArray.indexOf(led)];
          });
        }, 500);
      } else if (animationType === 'random') {
        animationInterval = setInterval(() => {
          const randomIndex = Math.floor(Math.random() * ledArray.length);
          ledArray[randomIndex].material = new THREE.MeshStandardMaterial({
            color: 0x0000ff,
            emissive: 0x0000ff,
            metalness: 0.9,
            roughness: 0.1,
          });

          setTimeout(() => {
            ledArray[randomIndex].material = originalMaterials[randomIndex];
          }, 300);
        }, 300);
      }
    };

    const modelMove = (ledArray) => {
      const sections = document.querySelectorAll('.section');
      let currentSection;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 3) {
          currentSection = section.id;
        }
      });

      let position_active = arrPositionModel.findIndex(
        (val) => val.id === currentSection
      );
      if (position_active >= 0) {
        let new_coordinates = arrPositionModel[position_active];
        gsap.to(bracelet.position, {
          x: new_coordinates.position.x,
          y: new_coordinates.position.y,
          z: new_coordinates.position.z,
          duration: 1,
          ease: 'power1.Out',
        });
        gsap.to(bracelet.rotation, {
          x: new_coordinates.rotation.x,
          y: new_coordinates.rotation.y,
          z: new_coordinates.rotation.z,
          duration: 1,
          ease: 'power1.Out',
        });

        resetLEDs(ledArray);

        if (currentSection === 'hero') {
          animateLEDs(ledArray, 'sequential');
        } else if (currentSection === 'about') {
          animateLEDs(ledArray, 'blinking');
        } else if (currentSection === 'FAQ') {
          animateLEDs(ledArray, 'random');
        }
      }
    };

    window.addEventListener('scroll', () => {
      if (bracelet) {
        modelMove();
      }
    });

    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    return () => {
      if (container) container.removeChild(renderer.domElement);
      if (animationInterval) clearInterval(animationInterval);
    };
  }, []);

  return <div id="container3D"></div>;
};

export default Three;
