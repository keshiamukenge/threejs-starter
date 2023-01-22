import * as dat from 'dat.gui';

export default class Debug {
  constructor(webgl) {
		this.webgl = webgl;

    this.active = window.location.hash === '#debug';

		this.plane = this.webgl.plane;
		this.camera = this.webgl.camera;
		
    if(this.active) {
      this.ui = new dat.GUI();
			
			this.cameraParameters = this.ui.addFolder('Camera');
			this.cameraParameters.add(this.camera.instance.position, 'x', -100, 100);
			this.cameraParameters.add(this.camera.instance.position, 'y', -100, 100);
			this.cameraParameters.add(this.camera.instance.position, 'z', 600, 1000);
    }
  }
}