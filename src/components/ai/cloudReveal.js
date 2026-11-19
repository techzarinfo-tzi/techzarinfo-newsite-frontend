import { isLowPower } from "@/components/ai/frameFilm";

// Cloud hand-over on the AI page: the island film ends with the clouds closing to white; this layer
// starts as that same white and parts like clouds, revealing the industries section behind it.
// WebGL on a transparent (premultiplied) canvas over the section, driven by one progress t (0..1).
//
// The clouds are a real cloud frame from the island film (the camera high above the sea): its bright
// cloud is kept and the darker gaps between (sea, and the island in the middle) open first, so the
// screen clears from the centre outwards along the clouds' own shapes. Meanwhile the layer slowly
// zooms (flying down through them) and a soft noise keeps the edges drifting, like vapour.
//
//   t = 0     pure white (matches the island film's last frame, so the hand-over is invisible)
//   0.02-0.18 the white thins into cloud
//   0.1-0.95  the gaps open wider until the last wisps clear

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform float uAsp;
uniform float uT;
uniform float uTime;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main() {
  float s = uRes.x / uRes.y;
  vec2 k = s > uAsp ? vec2(1.0, uAsp / s) : vec2(s / uAsp, 1.0);
  float zoom = 1.0 + 0.9 * pow(uT, 1.4);
  vec2 drift = vec2(0.0, -0.02 * uT);
  vec2 uv = ((vUv - 0.5) / zoom + drift) * k + 0.5;
  vec3 tex = texture2D(uTex, uv).rgb;
  float lum = dot(tex, vec3(0.299, 0.587, 0.114));

  // cloud density: the photo's bright cloud, plus drifting vapour
  vec2 q = vUv * vec2(s, 1.0) * 3.0;
  float vapour = fbm(q + vec2(uTime * 0.03, uTime * 0.015));
  float dens = smoothstep(0.32, 0.8, lum) * 0.85 + vapour * 0.3;

  // the gaps open as t grows
  float thr = mix(-0.15, 1.2, smoothstep(0.1, 0.95, uT));
  float a = smoothstep(thr - 0.14, thr + 0.14, dens);

  // shading: soft blue-grey in the hollows, white on top
  float body = smoothstep(0.3, 0.98, lum * 0.85 + vapour * 0.3);
  vec3 cloud = mix(vec3(0.7, 0.76, 0.84), vec3(1.0), body);

  // at the start: solid white
  float white = 1.0 - smoothstep(0.02, 0.18, uT);
  vec3 col = mix(cloud, vec3(1.0), white);
  a = max(a, white);
  gl_FragColor = vec4(col * a, a);
}`;

export function createCloudReveal({ canvas, src }) {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return null;
  const compile = (type, code) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, code);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) || "shader");
    return sh;
  };
  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || "link");
  } catch (err) {
    console.error("Cloud transition unavailable:", err);
    return null;
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  const loc = { res: gl.getUniformLocation(program, "uRes"), asp: gl.getUniformLocation(program, "uAsp"), t: gl.getUniformLocation(program, "uT"), time: gl.getUniformLocation(program, "uTime") };
  gl.uniform1i(gl.getUniformLocation(program, "uTex"), 0);

  const texture = gl.createTexture();
  let ready = false;
  const img = new window.Image();
  img.decoding = "async";
  img.src = src;
  img
    .decode()
    .then(() => {
      if (gl.isContextLost()) return;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.uniform1f(loc.asp, img.naturalWidth / img.naturalHeight);
      ready = true;
    })
    .catch(() => {});

  return {
    get ready() {
      return ready && !gl.isContextLost();
    },
    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, isLowPower() ? 1 : 1.5); // phones: lighter
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    },
    render(t, time) {
      if (!ready || gl.isContextLost()) return;
      gl.uniform2f(loc.res, canvas.width, canvas.height);
      gl.uniform1f(loc.t, t);
      gl.uniform1f(loc.time, time);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    clear() {
      if (gl.isContextLost()) return;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    },
    destroy() {
      if (gl.isContextLost()) return;
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}
