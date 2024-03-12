import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './ImageSlider.css';

const ImageSlider = () => {
  const mount = useRef(null);
  const images = ['images/item1.jpg', 'images/item2.jpg', 'images/item3.jpg', 'images/item4.jpg', 'images/item5.jpg'];
  const currentImageIndexRef = useRef(0);
  const scene = new THREE.Scene();
  const camera = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  camera.current.position.z = 10; // Increased camera distance for a better view
  const renderer = useRef(new THREE.WebGLRenderer());
  const textureRef = useRef([]);
  const meshRef = useRef([]);

  useEffect(() => {
    renderer.current.setSize(window.innerWidth, window.innerHeight);
    renderer.current.setClearColor(new THREE.Color("#ffffff"));
    mount.current.appendChild(renderer.current.domElement);

    loadTextures();

    const animate = () => {
      requestAnimationFrame(animate);

      for (let i = 0; i < meshRef.current.length; i++) {
        const angle = (i / meshRef.current.length) * Math.PI * 2;
        const radius = 5; // Adjust this radius for the curvature

        meshRef.current[i].position.x = radius * Math.cos(angle);
        meshRef.current[i].position.z = radius * Math.sin(angle);
        meshRef.current[i].rotation.y += 0.005; // Rotation speed

        // Optionally, you can add other animations or transformations here
      }

      renderer.current.render(scene, camera.current);
    };

    const advanceImage = () => {
      currentImageIndexRef.current = (currentImageIndexRef.current + 1) % images.length;
      loadTextures();
    };

    const timerId = setInterval(() => {
      advanceImage();
    }, 5000);

    animate();

    const currentRenderer = renderer.current;

    return () => {
      clearInterval(timerId);
      for (let i = 0; i < textureRef.current.length; i++) {
        textureRef.current[i].dispose();
      }
      for (let i = 0; i < meshRef.current.length; i++) {
        scene.remove(meshRef.current[i]);
      }
      currentRenderer.dispose();
    };
  }, [images]);

  const loadTextures = () => {
    for (let i = 0; i < textureRef.current.length; i++) {
      textureRef.current[i].dispose();
    }

    textureRef.current = images.map((imageUrl) => new THREE.TextureLoader().load(imageUrl));

    const geometry = new THREE.PlaneGeometry(3, 2.5); // Adjust the size of the planes
    meshRef.current = textureRef.current.map((texture, index) => {
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      return mesh;
    });
  };

  const nextImage = () => {
    currentImageIndexRef.current = (currentImageIndexRef.current + 1) % images.length;
    loadTextures();
  };

  const prevImage = () => {
    currentImageIndexRef.current = (currentImageIndexRef.current - 1 + images.length) % images.length;
    loadTextures();
  };

  return (
    <div className="slider-container">
      <div ref={mount} />
      <div className="slider-buttons">
        <button className="prev-button" onClick={prevImage}>
          Previous
        </button>
        <button className="next-button" onClick={nextImage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ImageSlider;
