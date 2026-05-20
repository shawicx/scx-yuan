uniform float time;
uniform float pixelRatio;

varying vec3 vPosition;
varying float vDistance;

// Simple pseudo-random function
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  // Twinkle effect based on time and position
  float twinkle = sin(time * 2.0 + vPosition.x * 0.1 + vPosition.y * 0.1) * 0.5 + 0.5;

  // Distance-based fade
  float fade = smoothstep(0.0, 100.0, vDistance) * (1.0 - smoothstep(200.0, 500.0, vDistance));

  // Star color (slightly blue-white)
  vec3 color = mix(
    vec3(0.6, 0.7, 0.9),
    vec3(1.0, 1.0, 1.0),
    twinkle
  );

  // Circular point
  vec2 center = gl_PointCoord - 0.5;
  float dist = length(center);
  float alpha = smoothstep(0.5, 0.1, dist) * fade * (0.5 + twinkle * 0.5);

  gl_FragColor = vec4(color, alpha);
}
