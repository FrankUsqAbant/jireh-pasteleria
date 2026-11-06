import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Play, Pause, RotateCw, ZoomIn, ZoomOut, Eye, Sparkles, X } from 'lucide-react';

interface ThreeCakeViewerProps {
  onClose?: () => void;
  cakeType?: 'chocolate' | 'roses' | 'selva';
}

export const ThreeCakeViewer: React.FC<ThreeCakeViewerProps> = ({ onClose, cakeType = 'chocolate' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  const [activeFlavor, setActiveFlavor] = useState<'chocolate' | 'roses' | 'selva'>(cakeType);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [currentDegrees, setCurrentDegrees] = useState(0);

  // Keep activeFlavor & isAutoRotating in refs for the animation loop
  const activeFlavorRef = useRef(activeFlavor);
  activeFlavorRef.current = activeFlavor;
  const isAutoRotatingRef = useRef(isAutoRotating);
  isAutoRotatingRef.current = isAutoRotating;

  // Animation target interpolation refs
  const targetRotationYRef = useRef<number | null>(null);
  const targetRotationXRef = useRef<number | null>(null);
  const targetCameraZRef = useRef<number | null>(null);

  // Build model callback ref
  const rebuildModelRef = useRef<((flv: 'chocolate' | 'roses' | 'selva') => void) | null>(null);

  const setFlavorSafe = (flv: 'chocolate' | 'roses' | 'selva') => {
    setActiveFlavor(flv);
    if (rebuildModelRef.current) {
      rebuildModelRef.current(flv);
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    // Detect software WebGL guard
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // 1. Scene & Environment
    const scene = new THREE.Scene();
    scene.background = null; // 100% transparent so it blends seamlessly into the page!

    // 2. Camera - positioned for patisserie showcase perspective
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(0, 2.5, 6.2);
    camera.lookAt(0, 0.72, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 4. Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.8);
    keyLight.position.set(3.5, 6, 4.5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.shadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0004;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe8b66f, 2.4);
    rimLight.position.set(-3.5, 4, -4);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xffe8d6, 1.2);
    fillLight.position.set(-3, 2, 3);
    scene.add(fillLight);

    const hemiLight = new THREE.HemisphereLight(0xfff5ea, 0x2e190d, 0.9);
    hemiLight.position.set(0, 8, 0);
    scene.add(hemiLight);

    // 6. Master Cake + Pedestal Group
    const cakeTurntable = new THREE.Group();
    scene.add(cakeTurntable);

    // --- PROCEDURAL TEXTURES ---
    const createMarbleTexture = () => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f0eae2';
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = 'rgba(180, 168, 155, 0.4)';
        ctx.lineWidth = 2.5;
        for (let i = 0; i < 9; i++) {
          ctx.beginPath();
          ctx.moveTo(Math.random() * 512, 0);
          ctx.bezierCurveTo(
            Math.random() * 512, 170,
            Math.random() * 512, 340,
            Math.random() * 512, 512
          );
          ctx.stroke();
        }
        ctx.strokeStyle = 'rgba(214, 156, 79, 0.25)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.moveTo(0, Math.random() * 512);
          ctx.bezierCurveTo(
            170, Math.random() * 512,
            340, Math.random() * 512,
            512, Math.random() * 512
          );
          ctx.stroke();
        }
      }
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const createFrostingBumpMap = () => {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, 256, 256);
        ctx.fillStyle = '#929292';
        for (let i = 0; i < 32; i++) {
          const y = (i / 32) * 256;
          ctx.fillRect(0, y, 256, 2.5 + (i % 3));
        }
      }
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(2, 4);
      return tex;
    };

    const marbleTex = createMarbleTexture();
    const frostingBump = createFrostingBumpMap();

    // 7. Ground Contact Shadow Disc (Transparent Floor)
    const groundShadowGeo = new THREE.PlaneGeometry(4.8, 4.8);
    const createShadowTex = () => {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext('2d');
      if (ctx) {
        const rad = ctx.createRadialGradient(128, 128, 30, 128, 128, 124);
        rad.addColorStop(0, 'rgba(0,0,0,0.75)');
        rad.addColorStop(0.5, 'rgba(0,0,0,0.35)');
        rad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = rad;
        ctx.fillRect(0, 0, 256, 256);
      }
      return new THREE.CanvasTexture(c);
    };

    const groundShadowMat = new THREE.MeshBasicMaterial({
      map: createShadowTex(),
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    });
    const groundShadowMesh = new THREE.Mesh(groundShadowGeo, groundShadowMat);
    groundShadowMesh.rotation.x = -Math.PI / 2;
    groundShadowMesh.position.y = -0.42;
    scene.add(groundShadowMesh);

    // 8. LUXURY DOUBLE-TIER MARBLE PEDESTAL
    const marbleMat = new THREE.MeshStandardMaterial({
      color: 0xede6de,
      map: marbleTex,
      roughness: 0.22,
      metalness: 0.08,
    });

    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0xd49b4b,
      roughness: 0.25,
      metalness: 0.88,
    });

    const goldTrayMat = new THREE.MeshStandardMaterial({
      color: 0xedb347,
      roughness: 0.18,
      metalness: 0.92,
    });

    // Base Tier Plinth
    const plinthBase = new THREE.Mesh(new THREE.CylinderGeometry(1.82, 1.88, 0.18, 54), marbleMat);
    plinthBase.position.y = -0.28;
    plinthBase.receiveShadow = true;
    cakeTurntable.add(plinthBase);

    const bronzeTrim1 = new THREE.Mesh(new THREE.TorusGeometry(1.84, 0.03, 16, 54), bronzeMat);
    bronzeTrim1.rotation.x = Math.PI / 2;
    bronzeTrim1.position.y = -0.20;
    cakeTurntable.add(bronzeTrim1);

    // Top Tier Plinth
    const plinthTop = new THREE.Mesh(new THREE.CylinderGeometry(1.64, 1.70, 0.20, 54), marbleMat);
    plinthTop.position.y = -0.09;
    plinthTop.receiveShadow = true;
    cakeTurntable.add(plinthTop);

    const bronzeTrim2 = new THREE.Mesh(new THREE.TorusGeometry(1.66, 0.028, 16, 54), bronzeMat);
    bronzeTrim2.rotation.x = Math.PI / 2;
    bronzeTrim2.position.y = 0.01;
    cakeTurntable.add(bronzeTrim2);

    // Polished Gold Cake Board
    const cakeBoard = new THREE.Mesh(new THREE.CylinderGeometry(1.48, 1.48, 0.04, 54), goldTrayMat);
    cakeBoard.position.y = 0.035;
    cakeBoard.receiveShadow = true;
    cakeTurntable.add(cakeBoard);

    // 9. DYNAMIC CAKE SUBJECT GROUP
    const cakeMeshGroup = new THREE.Group();
    cakeTurntable.add(cakeMeshGroup);

    // Helper: Build Procedural Organic Strawberry
    const createArtisanStrawberry = (scale = 1) => {
      const berryGroup = new THREE.Group();
      const berryMat = new THREE.MeshStandardMaterial({
        color: 0xd90429,
        roughness: 0.20,
        metalness: 0.06,
      });

      const points: THREE.Vector2[] = [];
      const numPoints = 12;
      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const y = (1 - t) * 0.28 * scale;
        const rad = Math.sin(t * Math.PI * 0.85) * 0.13 * scale;
        points.push(new THREE.Vector2(rad, y));
      }
      const berryGeo = new THREE.LatheGeometry(points, 18);
      const berryMesh = new THREE.Mesh(berryGeo, berryMat);
      berryMesh.castShadow = !isSoftwareGl;
      berryGroup.add(berryMesh);

      // Calyx Leaves
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x3d7a18, roughness: 0.42 });
      for (let l = 0; l < 5; l++) {
        const leafAngle = (l / 5) * Math.PI * 2;
        const leafCurve = new THREE.CubicBezierCurve3(
          new THREE.Vector3(0, 0.27 * scale, 0),
          new THREE.Vector3(Math.cos(leafAngle) * 0.06 * scale, 0.28 * scale, Math.sin(leafAngle) * 0.06 * scale),
          new THREE.Vector3(Math.cos(leafAngle) * 0.11 * scale, 0.24 * scale, Math.sin(leafAngle) * 0.11 * scale),
          new THREE.Vector3(Math.cos(leafAngle) * 0.14 * scale, 0.18 * scale, Math.sin(leafAngle) * 0.14 * scale)
        );
        const leafGeo = new THREE.TubeGeometry(leafCurve, 6, 0.018 * scale, 5, false);
        const leafMesh = new THREE.Mesh(leafGeo, leafMat);
        berryGroup.add(leafMesh);
      }

      const stemMat = new THREE.MeshStandardMaterial({ color: 0x2d5a10, roughness: 0.5 });
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015 * scale, 0.015 * scale, 0.07 * scale, 6), stemMat);
      stem.position.y = 0.31 * scale;
      berryGroup.add(stem);

      return berryGroup;
    };

    // Helper: Glossy Cherry
    const createGlossyCherry = (scale = 1) => {
      const cherryGroup = new THREE.Group();
      const cherryMat = new THREE.MeshStandardMaterial({
        color: 0x850824,
        roughness: 0.12,
        metalness: 0.1,
      });
      const cherrySphere = new THREE.Mesh(new THREE.SphereGeometry(0.125 * scale, 18, 18), cherryMat);
      cherrySphere.castShadow = !isSoftwareGl;
      cherryGroup.add(cherrySphere);

      const stemMat = new THREE.MeshStandardMaterial({ color: 0x5a3d28, roughness: 0.4 });
      const stemCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0.12 * scale, 0),
        new THREE.Vector3(0.05 * scale, 0.28 * scale, 0),
        new THREE.Vector3(0.12 * scale, 0.38 * scale, 0.04 * scale),
        new THREE.Vector3(0.18 * scale, 0.45 * scale, 0.08 * scale)
      );
      const stemGeo = new THREE.TubeGeometry(stemCurve, 10, 0.015 * scale, 6, false);
      const stemMesh = new THREE.Mesh(stemGeo, stemMat);
      cherryGroup.add(stemMesh);

      return cherryGroup;
    };

    // Helper: Rosette
    const createPipedRosette = (color = 0xfff8ee, scale = 1) => {
      const rosetteGroup = new THREE.Group();
      const rosetteMat = new THREE.MeshStandardMaterial({ color, roughness: 0.42 });
      for (let p = 0; p < 7; p++) {
        const pAngle = (p / 7) * Math.PI * 2;
        const puff = new THREE.Mesh(new THREE.SphereGeometry(0.07 * scale, 12, 12), rosetteMat);
        puff.position.set(Math.cos(pAngle) * 0.08 * scale, 0.04 * scale, Math.sin(pAngle) * 0.08 * scale);
        puff.scale.set(1.1, 0.85, 1.1);
        rosetteGroup.add(puff);
      }
      const centerPuff = new THREE.Mesh(new THREE.ConeGeometry(0.09 * scale, 0.14 * scale, 10), rosetteMat);
      centerPuff.position.y = 0.08 * scale;
      rosetteGroup.add(centerPuff);
      return rosetteGroup;
    };

    // BUILD SPECIFIC FLAVOR MODEL
    const buildCakeModel = (flv: 'chocolate' | 'roses' | 'selva') => {
      while (cakeMeshGroup.children.length > 0) {
        const obj = cakeMeshGroup.children[0];
        cakeMeshGroup.remove(obj);
      }

      if (flv === 'chocolate') {
        // --- 1. CHOCOLATÍSIMA DRIP ---
        const cakeBodyMat = new THREE.MeshStandardMaterial({
          color: 0x3d1d10,
          bumpMap: frostingBump,
          bumpScale: 0.015,
          roughness: 0.58,
          metalness: 0.03,
        });
        const cakeCylinder = new THREE.Mesh(new THREE.CylinderGeometry(1.36, 1.36, 1.32, 54), cakeBodyMat);
        cakeCylinder.position.y = 0.71;
        cakeCylinder.castShadow = !isSoftwareGl;
        cakeCylinder.receiveShadow = true;
        cakeMeshGroup.add(cakeCylinder);

        const borderMat = new THREE.MeshStandardMaterial({ color: 0x4e2716, roughness: 0.45 });
        const beadCount = 32;
        for (let b = 0; b < beadCount; b++) {
          const angle = (b / beadCount) * Math.PI * 2;
          const bead = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 12), borderMat);
          bead.position.set(Math.cos(angle) * 1.37, 0.11, Math.sin(angle) * 1.37);
          bead.scale.set(1.2, 0.9, 1.2);
          cakeMeshGroup.add(bead);
        }

        const ganacheMat = new THREE.MeshStandardMaterial({
          color: 0x1b0b05,
          roughness: 0.12,
          metalness: 0.12,
        });
        const ganacheTop = new THREE.Mesh(new THREE.CylinderGeometry(1.38, 1.38, 0.06, 54), ganacheMat);
        ganacheTop.position.y = 1.37;
        ganacheTop.castShadow = !isSoftwareGl;
        cakeMeshGroup.add(ganacheTop);

        const dripCount = 26;
        for (let d = 0; d < dripCount; d++) {
          const angle = (d / dripCount) * Math.PI * 2;
          const naturalVariation = Math.sin(d * 4.2) * 0.4 + Math.cos(d * 2.1) * 0.25;
          const dripLen = Math.max(0.2, 0.55 + naturalVariation * 0.45);
          const dx = Math.cos(angle) * 1.38;
          const dz = Math.sin(angle) * 1.38;

          const dripCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.038, dripLen, 10), ganacheMat);
          dripCyl.position.set(dx, 1.37 - dripLen / 2, dz);
          cakeMeshGroup.add(dripCyl);

          const dripDrop = new THREE.Mesh(new THREE.SphereGeometry(0.058, 12, 12), ganacheMat);
          dripDrop.position.set(dx, 1.37 - dripLen, dz);
          dripDrop.scale.set(1, 1.35, 1);
          cakeMeshGroup.add(dripDrop);
        }

        const topperCount = 8;
        for (let i = 0; i < topperCount; i++) {
          const angle = (i / topperCount) * Math.PI * 2;
          const rad = 1.02;
          const px = Math.cos(angle) * rad;
          const pz = Math.sin(angle) * rad;

          const rosette = createPipedRosette(0x4a2414, 1.1);
          rosette.position.set(px, 1.40, pz);
          cakeMeshGroup.add(rosette);

          if (i % 2 === 0) {
            const berry = createArtisanStrawberry(1.1);
            berry.position.set(px * 1.02, 1.44, pz * 1.02);
            berry.rotation.y = angle + 0.3;
            berry.rotation.z = 0.15;
            cakeMeshGroup.add(berry);
          } else {
            const cherry = createGlossyCherry(1.0);
            cherry.position.set(px * 1.02, 1.48, pz * 1.02);
            cherry.rotation.y = angle;
            cakeMeshGroup.add(cherry);
          }
        }

        const curlMat = new THREE.MeshStandardMaterial({
          color: 0x1f0e06,
          roughness: 0.18,
          metalness: 0.08,
          side: THREE.DoubleSide,
        });
        for (let c = 0; c < 5; c++) {
          const curl = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.14, 0.45, 14, 1, true, 0, Math.PI * 1.6),
            curlMat
          );
          curl.rotation.z = 0.6 + c * 0.3;
          curl.rotation.y = c * (Math.PI / 2.5);
          curl.position.set((c % 2 === 0 ? 0.2 : -0.2), 1.56, (c > 2 ? 0.2 : -0.2));
          cakeMeshGroup.add(curl);
        }

        const goldFlakeMat = new THREE.MeshStandardMaterial({
          color: 0xffd700,
          roughness: 0.12,
          metalness: 0.96,
        });
        for (let g = 0; g < 14; g++) {
          const flake = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.005, 0.04), goldFlakeMat);
          const fAngle = Math.random() * Math.PI * 2;
          const fRad = Math.random() * 0.95;
          flake.position.set(Math.cos(fAngle) * fRad, 1.41, Math.sin(fAngle) * fRad);
          flake.rotation.set(Math.random(), Math.random(), Math.random());
          cakeMeshGroup.add(flake);
        }

      } else if (flv === 'roses') {
        // --- 2. ROSAS DE ENSUEÑO ---
        // Upper Tier: Ivory Velvet Frosting
        const ivoryMat = new THREE.MeshStandardMaterial({
          color: 0xfffcf7,
          bumpMap: frostingBump,
          bumpScale: 0.012,
          roughness: 0.52,
          metalness: 0.02,
        });
        const upperCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.36, 1.36, 0.68, 54), ivoryMat);
        upperCyl.position.y = 1.05;
        upperCyl.castShadow = !isSoftwareGl;
        cakeMeshGroup.add(upperCyl);

        // Lower Tier: Pastel Rose Pink Frosting
        const pinkMat = new THREE.MeshStandardMaterial({
          color: 0xf5a3ba,
          bumpMap: frostingBump,
          bumpScale: 0.015,
          roughness: 0.55,
          metalness: 0.02,
        });
        const lowerCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.37, 1.37, 0.68, 54), pinkMat);
        lowerCyl.position.y = 0.38;
        lowerCyl.castShadow = !isSoftwareGl;
        cakeMeshGroup.add(lowerCyl);

        // Pink bottom border
        const pinkBorderMat = new THREE.MeshStandardMaterial({ color: 0xf391ad, roughness: 0.4 });
        for (let b = 0; b < 34; b++) {
          const angle = (b / 34) * Math.PI * 2;
          const puff = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), pinkBorderMat);
          puff.position.set(Math.cos(angle) * 1.38, 0.11, Math.sin(angle) * 1.38);
          puff.scale.set(1.2, 0.85, 1.2);
          cakeMeshGroup.add(puff);
        }

        // Top Rim Ivory Shell Swirls
        for (let t = 0; t < 24; t++) {
          const angle = (t / 24) * Math.PI * 2;
          const rosette = createPipedRosette(0xfffaf0, 0.7);
          rosette.position.set(Math.cos(angle) * 1.28, 1.39, Math.sin(angle) * 1.28);
          cakeMeshGroup.add(rosette);
        }

        // Sculpted Rose Petals
        const roseMat = new THREE.MeshStandardMaterial({ color: 0xfa7298, roughness: 0.35, metalness: 0.05 });
        const roseMatSoft = new THREE.MeshStandardMaterial({ color: 0xfcb0c3, roughness: 0.38, metalness: 0.05 });

        const createRose = (scale = 1, isDarker = false) => {
          const rose = new THREE.Group();
          const mat = isDarker ? roseMat : roseMatSoft;
          for (let p = 0; p < 12; p++) {
            const pAng = (p / 12) * Math.PI * 2;
            const rad = (0.05 + p * 0.008) * scale;
            const petal = new THREE.Mesh(new THREE.SphereGeometry(0.08 * scale, 10, 10), mat);
            petal.position.set(Math.cos(pAng) * rad, (p * 0.012) * scale, Math.sin(pAng) * rad);
            petal.scale.set(1.1, 0.7, 0.4);
            petal.rotation.y = pAng;
            petal.rotation.x = 0.4;
            rose.add(petal);
          }
          return rose;
        };

        const rose1 = createRose(1.2, true);
        rose1.position.set(-0.75, 1.42, 0.55);
        cakeMeshGroup.add(rose1);

        const rose2 = createRose(1.0, false);
        rose2.position.set(-0.95, 1.40, 0.25);
        cakeMeshGroup.add(rose2);

        const rose3 = createRose(1.1, false);
        rose3.position.set(-0.55, 1.44, 0.82);
        cakeMeshGroup.add(rose3);

        const rose4 = createRose(1.1, true);
        rose4.position.set(1.22, 0.38, 0.65);
        rose4.rotation.z = -0.5;
        cakeMeshGroup.add(rose4);

        // Center Gold Topper (Upright)
        const goldTopperMat = new THREE.MeshStandardMaterial({ color: 0xe8b64f, roughness: 0.15, metalness: 0.94 });
        const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8), goldTopperMat);
        stick.position.set(0, 1.65, 0);
        cakeMeshGroup.add(stick);

        const topperPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.02, 32), goldTopperMat);
        topperPlate.position.set(0, 1.95, 0);
        cakeMeshGroup.add(topperPlate);

        const pearlMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.2 });
        for (let p = 0; p < 24; p++) {
          const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), pearlMat);
          const pr = Math.random() * 1.15;
          const pa = Math.random() * Math.PI * 2;
          pearl.position.set(Math.cos(pa) * pr, 1.40, Math.sin(pa) * pr);
          cakeMeshGroup.add(pearl);
        }

      } else {
        // --- 3. SELVA NEGRA TRADICIONAL ---
        const selvaBodyMat = new THREE.MeshStandardMaterial({
          color: 0x241208,
          bumpMap: frostingBump,
          bumpScale: 0.02,
          roughness: 0.65,
          metalness: 0.02,
        });
        const selvaCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.36, 1.36, 1.32, 54), selvaBodyMat);
        selvaCyl.position.y = 0.71;
        selvaCyl.castShadow = !isSoftwareGl;
        cakeMeshGroup.add(selvaCyl);

        const chantillyMat = new THREE.MeshStandardMaterial({ color: 0xfffaf2, roughness: 0.38 });
        const chantillyTop = new THREE.Mesh(new THREE.CylinderGeometry(1.37, 1.37, 0.05, 54), chantillyMat);
        chantillyTop.position.y = 1.37;
        cakeMeshGroup.add(chantillyTop);

        const sTopperCount = 10;
        for (let i = 0; i < sTopperCount; i++) {
          const angle = (i / sTopperCount) * Math.PI * 2;
          const rad = 1.08;
          const px = Math.cos(angle) * rad;
          const pz = Math.sin(angle) * rad;

          const rosette = createPipedRosette(0xffffff, 1.15);
          rosette.position.set(px, 1.40, pz);
          cakeMeshGroup.add(rosette);

          const cherry = createGlossyCherry(1.05);
          cherry.position.set(px * 1.02, 1.50, pz * 1.02);
          cherry.rotation.y = angle + 0.4;
          cakeMeshGroup.add(cherry);
        }

        const shavingMat = new THREE.MeshStandardMaterial({ color: 0x180b04, roughness: 0.25, metalness: 0.08 });
        for (let s = 0; s < 45; s++) {
          const flake = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.015, 0.07), shavingMat);
          const sr = Math.random() * 0.75;
          const sa = Math.random() * Math.PI * 2;
          flake.position.set(Math.cos(sa) * sr, 1.41 + Math.random() * 0.06, Math.sin(sa) * sr);
          flake.rotation.set(Math.random() * 1.2, Math.random() * Math.PI, Math.random() * 1.2);
          cakeMeshGroup.add(flake);
        }

        const centerBerry = createArtisanStrawberry(1.2);
        centerBerry.position.set(0, 1.46, 0);
        cakeMeshGroup.add(centerBerry);
      }
    };

    // Store callback for React flavor button clicks
    rebuildModelRef.current = buildCakeModel;

    // Build initial model
    buildCakeModel(activeFlavorRef.current);

    // 10. REALISTIC 360 INTERACTION & DAMPING PHYSICS
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let angularVelocityY = 0;
    let angularVelocityX = 0;
    let lastDragTime = performance.now();

    const handlePointerDown = (e: PointerEvent) => {
      // Ignore if clicking on button or controls
      if ((e.target as HTMLElement)?.closest('button')) {
        return;
      }
      isDragging = true;
      targetRotationYRef.current = null;
      targetRotationXRef.current = null;
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
      lastDragTime = performance.now();
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousPointerX;
      const deltaY = e.clientY - previousPointerY;

      // Silky smooth rotation responsiveness
      const moveSens = 0.007;
      cakeTurntable.rotation.y += deltaX * moveSens;

      // Strictly clamp vertical tilt between -0.05 rad and 0.18 rad (always upright patisserie view)
      const currentX = cakeTurntable.rotation.x + deltaY * 0.002;
      cakeTurntable.rotation.x = Math.max(-0.05, Math.min(0.18, currentX));

      angularVelocityY = deltaX * moveSens;
      angularVelocityX = deltaY * 0.002;

      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
      lastDragTime = performance.now();
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const newZ = Math.max(4.5, Math.min(7.0, camera.position.z + e.deltaY * 0.003));
      camera.position.z = newZ;
    };
    domElement.addEventListener('wheel', handleWheel, { passive: false });

    // 11. Render Loop
    let animId = 0;
    let lastTime = performance.now();

    const tick = (time: number) => {
      animId = requestAnimationFrame(tick);
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (targetRotationYRef.current !== null) {
        cakeTurntable.rotation.y = THREE.MathUtils.damp(
          cakeTurntable.rotation.y,
          targetRotationYRef.current,
          6,
          delta
        );
        if (Math.abs(cakeTurntable.rotation.y - targetRotationYRef.current) < 0.01) {
          targetRotationYRef.current = null;
        }
      }

      if (targetRotationXRef.current !== null) {
        cakeTurntable.rotation.x = THREE.MathUtils.damp(
          cakeTurntable.rotation.x,
          targetRotationXRef.current,
          6,
          delta
        );
        if (Math.abs(cakeTurntable.rotation.x - targetRotationXRef.current) < 0.01) {
          targetRotationXRef.current = null;
        }
      }

      if (targetCameraZRef.current !== null) {
        camera.position.z = THREE.MathUtils.damp(
          camera.position.z,
          targetCameraZRef.current,
          5,
          delta
        );
        if (Math.abs(camera.position.z - targetCameraZRef.current) < 0.02) {
          targetCameraZRef.current = null;
        }
      }

      if (!isDragging && targetRotationYRef.current === null) {
        if (Math.abs(angularVelocityY) > 0.0005) {
          cakeTurntable.rotation.y += angularVelocityY;
          angularVelocityY *= 0.92;
        } else if (isAutoRotatingRef.current) {
          const idleTime = performance.now() - lastDragTime;
          if (idleTime > 1200) {
            cakeTurntable.rotation.y += 0.35 * delta;
          }
        }
        // Gently return tilt to natural 0.02 rad
        cakeTurntable.rotation.x = THREE.MathUtils.damp(cakeTurntable.rotation.x, 0.02, 3, delta);
      }

      const rawDeg = THREE.MathUtils.radToDeg(cakeTurntable.rotation.y) % 360;
      const positiveDeg = Math.round(rawDeg < 0 ? rawDeg + 360 : rawDeg);
      setCurrentDegrees(positiveDeg);

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(tick);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      domElement.removeEventListener('wheel', handleWheel);

      renderer.dispose();
      marbleTex.dispose();
      frostingBump.dispose();
      if (domElement.parentNode) {
        domElement.parentNode.removeChild(domElement);
      }
    };
  }, []); // Mount scene once!

  const setPresetAngle = (degY: number, radX: number) => {
    targetRotationYRef.current = THREE.MathUtils.degToRad(degY);
    targetRotationXRef.current = radX;
  };

  const adjustZoom = (deltaZ: number) => {
    targetCameraZRef.current = Math.max(4.5, Math.min(7.0, (targetCameraZRef.current || 6.2) + deltaZ));
  };

  return (
    <div className="relative w-full h-[480px] sm:h-[530px] flex items-center justify-center select-none overflow-hidden">
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        data-testid="three-cake-canvas"
        title="Arrastra con el mouse o dedo para rotar la torta 360°"
      />

      {/* Top Header Floating Badge: Degree Orientation & Interaction Hint */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-[#1b120c]/90 border border-[#d69c4f]/40 px-3 py-1.5 rounded-full shadow-lg">
          <RotateCw className="w-3.5 h-3.5 text-[#e8b66f] animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs font-semibold text-[#faf3e8] tracking-wide">
            Vista 360° Interactiva
          </span>
          <span className="text-[11px] font-mono text-[#e8b66f] bg-[#2a170b] px-2 py-0.5 rounded-md border border-[#d69c4f]/30">
            {currentDegrees}°
          </span>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1b120c]/90 hover:bg-[#2e190e] text-[#faf3e8] hover:text-white border border-[#d69c4f]/40 shadow-lg text-xs font-medium transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Volver a la galería de fotos"
          >
            <X className="w-3.5 h-3.5 text-[#e8b66f]" />
            <span>Volver a foto</span>
          </button>
        )}
      </div>

      {/* Hint over canvas */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 pointer-events-none text-center">
        <span className="text-[11px] uppercase tracking-wider text-[#d69c4f]/90 bg-[#150e09]/75 px-3 py-1 rounded-full border border-[#d69c4f]/25 shadow-md">
          ↺ Arrastra para girar • Rueda para zoom
        </span>
      </div>

      {/* Bottom Control Dock: Angle Presets, Zoom, Play/Pause & Flavor Switcher */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[95%] max-w-[460px] flex flex-col gap-2 bg-[#1b120c]/95 border border-[#d69c4f]/50 p-2.5 rounded-2xl shadow-2xl z-10">
        
        {/* Row 1: Flavors */}
        <div className="flex items-center justify-between gap-1 text-xs">
          <span className="text-[11px] text-[#b97f33] font-semibold flex items-center gap-1 pl-1">
            <Sparkles className="w-3 h-3" /> Modelo:
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFlavorSafe('chocolate')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer text-xs ${
                activeFlavor === 'chocolate'
                  ? 'bg-[#d69c4f] text-[#150e09] font-bold shadow-sm'
                  : 'text-[#e4d5c4] hover:text-white hover:bg-[#25150c]'
              }`}
            >
              Chocolatísima 🍓
            </button>
            <button
              onClick={() => setFlavorSafe('roses')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer text-xs ${
                activeFlavor === 'roses'
                  ? 'bg-[#d69c4f] text-[#150e09] font-bold shadow-sm'
                  : 'text-[#e4d5c4] hover:text-white hover:bg-[#25150c]'
              }`}
            >
              Rosas Ensueño 🌸
            </button>
            <button
              onClick={() => setFlavorSafe('selva')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer text-xs ${
                activeFlavor === 'selva'
                  ? 'bg-[#d69c4f] text-[#150e09] font-bold shadow-sm'
                  : 'text-[#e4d5c4] hover:text-white hover:bg-[#25150c]'
              }`}
            >
              Selva Negra 🍒
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#4a2e1c]" />

        {/* Row 2: Controls (Play/Pause, Angle Presets, Zoom) */}
        <div className="flex items-center justify-between gap-2 text-xs">
          {/* Play/Pause */}
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#25150c] hover:bg-[#341d11] text-[#faf3e8] border border-[#d69c4f]/30 font-medium transition-colors cursor-pointer"
            title={isAutoRotating ? 'Pausar rotación automática' : 'Reanudar rotación automática'}
          >
            {isAutoRotating ? (
              <>
                <Pause className="w-3 h-3 text-[#e8b66f]" />
                <span className="text-[11px]">Pausa</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-[#e8b66f]" />
                <span className="text-[11px]">Girar</span>
              </>
            )}
          </button>

          {/* Quick Angle Presets */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPresetAngle(0, 0.05)}
              className="px-2 py-1 rounded bg-[#25150c] hover:bg-[#341d11] text-[#e4d5c4] hover:text-white text-[11px] border border-[#d69c4f]/20 cursor-pointer"
              title="Ángulo Frontal (0°)"
            >
              Frontal
            </button>
            <button
              onClick={() => setPresetAngle(90, 0.05)}
              className="px-2 py-1 rounded bg-[#25150c] hover:bg-[#341d11] text-[#e4d5c4] hover:text-white text-[11px] border border-[#d69c4f]/20 cursor-pointer"
              title="Ángulo Lateral (90°)"
            >
              Lateral
            </button>
            <button
              onClick={() => setPresetAngle(45, 0.28)}
              className="px-2 py-1 rounded bg-[#25150c] hover:bg-[#341d11] text-[#e4d5c4] hover:text-white text-[11px] border border-[#d69c4f]/20 cursor-pointer"
              title="Ángulo Cenital (Superior)"
            >
              Arriba
            </button>
          </div>

          {/* Zoom In / Out */}
          <div className="flex items-center gap-1 border-l border-[#4a2e1c] pl-2">
            <button
              onClick={() => adjustZoom(-0.5)}
              className="w-7 h-7 flex items-center justify-center rounded bg-[#25150c] hover:bg-[#341d11] text-[#faf3e8] border border-[#d69c4f]/30 cursor-pointer"
              title="Acercar (Zoom In)"
            >
              <ZoomIn className="w-3.5 h-3.5 text-[#e8b66f]" />
            </button>
            <button
              onClick={() => adjustZoom(0.5)}
              className="w-7 h-7 flex items-center justify-center rounded bg-[#25150c] hover:bg-[#341d11] text-[#faf3e8] border border-[#d69c4f]/30 cursor-pointer"
              title="Alejar (Zoom Out)"
            >
              <ZoomOut className="w-3.5 h-3.5 text-[#e8b66f]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
