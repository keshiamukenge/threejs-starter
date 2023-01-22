import * as THREE from 'three';

import { Camera, Render, Sizes, Mouse, Plane, Debug,Time } from './Utils'

export default class Webgl {
	constructor() {
		window.webgl = this;

    this.sizes = new Sizes();
    this.time = new Time();
    this.canvas = document.querySelector('canvas');
		this.htmlImage = document.querySelector('img');

    this.initWebgl();
    
    this.onResizeWindow();
    this.update();
		this.debug = new Debug(this);
	}

  initWebgl() {
    this.scene = new THREE.Scene();
    this.camera = new Camera(this, { activeOrbitControls: true });
    
    this.plane = new Plane(this, { htmlImage: this.htmlImage });
    
    this.render = new Render(this);

    this.mouse = new Mouse(this);
  }

  onResizeWindow() {
    window.addEventListener('resize', () => {
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;


      this.plane.updateSize();

      this.camera.update();

      this.render.onResize();
    });
  }

  onMouseMove() {
    window.addEventListener('mousemove', (event) => {
      this.mouse.onMouseMove(event);
    });
  }

  update() {
    requestAnimationFrame(() => this.update());

		this.plane.instance.rotation.x += 0.01;
		this.plane.instance.rotation.y += 0.01;

    this.plane.update();

    this.mouse.update();
    
    this.render.onUpdate();
  }
}