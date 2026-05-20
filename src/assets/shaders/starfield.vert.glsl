varying vec3 vPosition;
varying float vDistance;

void main() {
  vPosition = position;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vDistance = -mvPosition.z;
  gl_PointSize = (200.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
