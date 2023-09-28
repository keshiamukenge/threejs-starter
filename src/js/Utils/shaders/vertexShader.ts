export const vertexShader = `
  uniform vec2 uMouse;
  uniform float uTime;
  
  varying vec2 vUv;

  void main() {
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`