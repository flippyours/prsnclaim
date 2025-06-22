loader.load(
  'source/tshirt11.glb',
  function (gltf) {
    object = gltf.scene;
    object.scale.set(2, 2, 2);
    scene.add(object);

    // Center object
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    object.position.sub(center);

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    const newTexture = textureLoader.load('source/my_new_texture.png', () => {
      gltf.scene.traverse((child) => {
        if (child.isMesh && child.name.toLowerCase().includes("tshirt")) {
          child.material.map = newTexture;
          child.material.needsUpdate = true;
        }
      });
    }, undefined, (err) => {
      console.error("❌ Gagal memuat tekstur:", err);
    });
  },
  undefined,
  function (error) {
    console.error("❌ Gagal memuat model:", error);
    const errorDiv = document.createElement("div");
    errorDiv.style.color = "red";
    errorDiv.innerText = "❌ Model 3D tidak bisa dimuat. Pastikan file GLB tersedia dan bisa diakses.";
    container.appendChild(errorDiv);
  }
);
