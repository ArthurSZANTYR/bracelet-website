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
      '/assets/three/bracelet.glb', 
      (gltf) => {
        bracelet = gltf.scene;
        
        scene.add(bracelet);

        const ledArray = [];
        // Traverse the model to group LEDs logically
        bracelet.traverse((child) => {
          if (child.name.includes('led')) {
              ledArray.push(child); // Add the group of meshes as one LED
            //console.log(ledMeshes);
          }
        });
        //reorganize led
        const led4Index = 0;
        const led4 = ledArray.splice(led4Index, 1)[0]; // Remove led4 from the array
        const middleIndex = Math.floor(ledArray.length / 2); // Find the middle of the array
        ledArray.splice(middleIndex, 0, led4); // Insert led4 at the middle

        console.log(ledArray);
      
        modelMove(ledArray);
        //animateLEDs(ledArray);
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
    renderer.domElement.style.zIndex = '7'; // Z-index élevé pour qu'il soit devant tout
    renderer.domElement.style.pointerEvents = "none";

    const container = document.getElementById('container3D');
    if (container) {
      container.appendChild(renderer.domElement);
    }

    //helper
    //const axesHelper = new THREE.AxesHelper(1);
    //scene.add(axesHelper);

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
      {
        id: 'FAQ',
        position: {x:0.05, y:-0.01, z:0.5},
        rotation: {x:0.4, y:-1.56, z:0},
      },
    ];

    const modelMove = (ledArray) => {
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
      animateLEDs(ledArray);
    }

    // Animate the first LED in progression
    const animateLEDs = (ledArray) => {
      // Create a new material with red color for the LED glow effect
      const newMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000, // Red color
        emissive: 0xff0000, // Red emissive for glow effect
        metalness: 0.9, // Metallic effect
        roughness: 0.1, // Roughness for the surface
      });
    
      // Function to light up LEDs one after the other
      const lightUpLED = (index) => {
        if (index >= ledArray.length) return; // Stop when all LEDs are lit
    
        ledArray[index].material = newMaterial; // Change material to light up the LED
    
        // Call the function again for the next LED with a delay
        setTimeout(() => lightUpLED(index + 1), 250); // Adjust the delay as needed
      };
    
      // Start the animation from the first LED
      lightUpLED(0);
    };
    
    

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
