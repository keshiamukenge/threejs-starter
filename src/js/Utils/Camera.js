import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class Camera {
  constructor(webgl, { activeOrbitControls }) {
    this.webgl = webgl;
    this.sizes = this.webgl.sizes;
    this.scene = this.webgl.scene;
    this.canvas = this.webgl.canvas;

    this.setInstance();

    if(activeOrbitControls) {
      this.setOrbitcontrols();
    }

    this.resize();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      70,
      this.sizes.width / this.sizes.height,
      100,
      2000,
    );
    this.instance.position.z = 600;
    this.instance.fov = 2 * Math.atan((this.webgl.sizes.height / 2) / this.instance.position.z) * (180 / Math.PI);

    this.scene.add(this.instance);
  }

  setOrbitcontrols() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update(activeOrbitControls) {
    if(activeOrbitControls) {
      this.controls.update();
    }
  }
}