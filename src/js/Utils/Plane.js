import * as THREE from 'three';

export default class Plane {
  constructor(webgl, { htmlImage }) {
    this.webgl = webgl;

		this.scene = this.webgl.scene;
		this.camera = this.webgl.camera;
		this.sizes = this.webgl.sizes;
    this.time = this.webgl.time;

    this.imageElement = htmlImage;
    this.image = {
      element: this.imageElement,
      src: this.imageElement.src,
      width: this.imageElement.getBoundingClientRect().width,
      height: this.imageElement.getBoundingClientRect().height,
      aspect: this.imageElement.offsetWidth / this.imageElement.offsetHeight,
      top: this.imageElement.getBoundingClientRect().top,
      left: this.imageElement.getBoundingClientRect().left,
    };

    this.texture = new THREE.TextureLoader().load(this.image.src);

    this.setupPlane();
  }

  setupPlane() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
    this.material = new THREE.ShaderMaterial({
      antialias: true,
      side: THREE.DoubleSide,
      uniforms: {
        uTexture: {
          value: this.texture || null
        },
        uMouse: {
          value: new THREE.Vector2(0.0, 0.0)
        },
        uTime: {
          value: 0.0
        },
      },
      vertexShader: `
        uniform vec2 uMouse;
        uniform float uTime;

        varying vec2 vUv;
        
        void main() {
          vUv = uv;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;

        varying vec2 vUv;
 
        void main() {
          vec4 texture = texture2D(uTexture, vUv);

          gl_FragColor = vec4(texture);
        }
      `
    })
    this.instance = new THREE.Mesh(this.geometry, this.material);
    this.instance.scale.set(this.image.width, this.image.height, 1);
		this.instanceOffset = this.instance.scale.y / 2;

		this.scene.add(this.instance);
  }

  updateImageSize() {
    this.image.width = this.imageElement.getBoundingClientRect().width;
    this.image.height = this.imageElement.getBoundingClientRect().height;
    this.image.aspect = this.imageElement.offsetWidth / this.imageElement.offsetHeight;
  }

  updateImagePosition() {
    this.image.top = -this.imageElement.getBoundingClientRect().top;
    this.image.left = this.imageElement.getBoundingClientRect().left;
  }

  updatePlaneSize() {
    this.instance.scale.set(this.image.width, this.image.height, 1);
  }

  updatePlanePosition() {
			this.instance.position.set(
				this.image.left - this.webgl.sizes.width / 2 + this.image.width / 2,
				this.image.top + this.webgl.sizes.height / 2 - this.image.height / 2,
				1,
			);
  }

	update() {
		this.updateImagePosition();
		this.updatePlanePosition();
    
		this.texture.needsUpdate = true;

    this.instance.material.uniforms.uMouse.value = this.webgl.mouse.coordinates;
    this.instance.material.uniforms.uTime.value = this.time.elapsed;
	}

	updateSize() {
		this.updatePlaneSize();
		this.updateImageSize();
	}
}
