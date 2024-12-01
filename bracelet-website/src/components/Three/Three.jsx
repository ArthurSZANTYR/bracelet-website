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
    let ledArray = []; // Ensure ledArray is scoped and accessible throughout

    const loader = new GLTFLoader();
    loader.load(
      '/assets/three/bracelet.glb',
      (gltf) => {
        bracelet = gltf.scene;
        if (!bracelet) {
          console.error("Bracelet model not loaded.");
          return;
        }
        scene.add(bracelet);

        bracelet.traverse((child) => {
          if (child.name.includes('led')) {
            ledArray.push(child);
            originalMaterials.push(child.material);
            console.log(`LED found: ${child.name}`); // Debug
          }
        });
        console.log("LED Array:", ledArray);

        // Rearrange the LEDs if necessary
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
        animation: 'sequential',
      },
      {
        id: 'about',
        position: { x: 0.01, y: -0.049, z: 0.65 },
        rotation: { x: 1.5, y: 2.5, z: 0 },
        animation: 'blinking',
      },
      {
        id: 'FAQ',
        position: { x: 0.05, y: -0.01, z: 0.5 },
        rotation: { x: 0.4, y: -1.56, z: 0 },
        animation: 'random',
      },
    ];

    let currentAnimation = null;

    const animateLEDs = (ledArray, animationType) => {
      if (!ledArray || ledArray.length === 0) {
        console.warn("LED array is empty or undefined.");
        return;
      }
    
      if (!animationType) {
        if (animationInterval) clearInterval(animationInterval);
        currentAnimation = null;
        return;
      }
    
      if (currentAnimation === animationType) return;
      currentAnimation = animationType;
    
      if (animationInterval) clearInterval(animationInterval);
    
      const createMaterial = (color) =>
        new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          metalness: 0.9,
          roughness: 0.1,
        });
      
        const resetMaterial = (index) => {
          if (ledArray[index]) {
            ledArray[index].material = originalMaterials[index];
          } else {
            console.warn(`LED at index ${index} is undefined.`);
          }
        };
        

      console.log(animationType);
      switch (animationType) {
        case 'sequential':
          let index = 0;
          animationInterval = setInterval(() => {
            if (index >= ledArray.length) {
              clearInterval(animationInterval);
              return;
            }
            ledArray[index].material = createMaterial(0xff0000);
            setTimeout(() => resetMaterial(index), 250);
            index++;
          }, 250);
          break;
        
        case 'blinking':
          let isLit = false;
          animationInterval = setInterval(() => {
            isLit = !isLit;
            ledArray.forEach((led, i) => {
              led.material = isLit ? createMaterial(0x00ff00) : originalMaterials[i];
            });
          }, 500);
          break;
        
        case 'random':
          animationInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * ledArray.length);
            ledArray[randomIndex].material = createMaterial(0xff0000);
            setTimeout(() => resetMaterial(randomIndex), 250);
            
          }, 300);
          break;
        
        default:
          console.warn('Unknown animation type:', animationType);
      }
    };

    const modelMove = (ledArray) => {
      const sections = document.querySelectorAll('.section');
      let currentSection = null;
    
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 3) {
          currentSection = section.id;
        }
      });
    
      if (!currentSection) {
        console.warn("No active section found.");
        animateLEDs(ledArray, null);
        return;
      }
    
      const new_coordinates = arrPositionModel.find((val) => val.id === currentSection);
    
      if (new_coordinates) {
        animateLEDs(ledArray, new_coordinates.animation);
      
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
      }
    };

    window.addEventListener('scroll', () => {
      if (bracelet && ledArray.length > 0) {
        modelMove(ledArray);
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
