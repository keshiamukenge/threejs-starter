precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uPlaneSize;
uniform vec2 uImageSize;

varying vec2 vUv;

void main() {
	vec2 ratio = vec2(
		min((uPlaneSize.x / uPlaneSize.y) / (uImageSize.x / uImageSize.y), 1.0),
		min((uPlaneSize.y / uPlaneSize.x) / (uImageSize.y / uImageSize.x), 1.0)
	);
	
	vec2 uv = vec2(
		vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
		vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
	);
	
	vec4 texture = texture2D(uTexture, uv);

	gl_FragColor = vec4(texture);
}