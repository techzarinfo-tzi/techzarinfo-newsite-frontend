// Fire hand-over on the AI page: the parchment-map section burns away from the centre, revealing the
// "Hire Our Claude AI Prompt Engineer" section. WebGL on a transparent (premultiplied) canvas over the
// pinned map stage, driven by one progress t (0..1, from the scroll).
//
// A burn front spreads out from the centre along a noisy field, so its edge is ragged like real
// burning paper:
//   - behind the front: the next section's photo (drawn exactly as the page lays it out: cover,
//     with the same object-position), so it simply stays when the burn completes
//   - on the front: a thin band of glowing embers, white-hot to orange to deep red, flickering
//   - ahead of it: the paper chars and scorches brown-black before it catches
//   - sparks: little embers drifting up off the front
// Outside the scorch the canvas is transparent and the real map section shows through.

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
uniform vec2 uImg;        // image size, px
uniform vec2 uPos;        // object-position (0..1)
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
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

void main() {
  vec2 px = vUv * uRes;
  float m = min(uRes.x, uRes.y);

  // the next section's photo, laid out as object-fit: cover + object-position
  float s = max(uRes.x / uImg.x, uRes.y / uImg.y);
  vec2 dsz = uImg * s;
  vec2 off = (uRes - dsz) * uPos;
  vec3 photo = texture2D(uTex, clamp((px - off) / dsz, 0.0, 1.0)).rgb;

  // burn field: distance from the centre, roughened by noise (in screen-height units)
  vec2 q = (px - 0.5 * uRes) / m;
  float maxD = length(0.5 * uRes) / m;
  float field = length(q) / maxD;
  field += (fbm(q * 3.2 + 7.0) - 0.5) * 0.42 + (fbm(q * 11.0 - 3.0) - 0.5) * 0.12;
  float thr = mix(-0.25, 1.32, uT);
  float d = thr - field;                   // > 0: burnt through

  float band = 0.022;                      // glowing edge
  float scorch = 0.11;                     // charring ahead of it

  // flicker along the edge
  float flick = 0.65 + 0.35 * noise(q * 22.0 + vec2(0.0, -uTime * 3.0));

  vec3 col = vec3(0.0);
  float alpha = 0.0;

  if (d > band) {
    // burnt through: the next section
    col = photo;
    alpha = 1.0;
    // a last smoulder just behind the edge
    float smoulder = exp(-(d - band) / 0.03);
    col += vec3(1.0, 0.35, 0.05) * smoulder * 0.35 * flick;
  } else if (d > 0.0) {
    // the burning edge: white-hot inside, orange, deep red outside
    float k = d / band;                    // 0 outer .. 1 inner
    vec3 hot = mix(vec3(0.75, 0.12, 0.02), vec3(1.0, 0.55, 0.12), smoothstep(0.0, 0.6, k));
    hot = mix(hot, vec3(1.0, 0.92, 0.7), smoothstep(0.55, 1.0, k));
    col = mix(hot * (1.2 * flick), photo, smoothstep(0.85, 1.0, k));
    alpha = 1.0;
  } else if (d > -scorch) {
    // charring paper ahead of the flame: brown -> black at the edge
    float k = 1.0 + d / scorch;            // 0 far .. 1 at the edge
    vec3 charc = mix(vec3(0.33, 0.18, 0.07), vec3(0.04, 0.02, 0.01), pow(k, 1.6));
    alpha = smoothstep(0.0, 1.0, k) * 0.95;
    col = charc * alpha;
    // a red glow just before it catches
    col += vec3(0.9, 0.25, 0.04) * pow(k, 6.0) * 0.6 * flick;
  }

  // sparks drifting up off the front
  vec2 sp = px / vec2(14.0, 14.0) + vec2(0.0, uTime * 3.5);
  vec2 cell = floor(sp);
  float h = hash(cell);
  if (h > 0.93) {
    vec2 c = fract(sp) - 0.5 - (vec2(hash(cell + 1.3), hash(cell + 2.7)) - 0.5) * 0.6;
    float sd = length(c);
    float near = exp(-abs(d) / 0.06);
    float tw = 0.5 + 0.5 * sin(uTime * 9.0 + h * 50.0);
    float spark = exp(-sd * sd * 60.0) * near * tw * smoothstep(0.02, 0.15, uT) * (1.0 - smoothstep(0.92, 1.0, uT));
    col += vec3(1.0, 0.6, 0.18) * spark * 1.3;
    alpha = max(alpha, min(1.0, spark));
  }

  gl_FragColor = vec4(col, alpha);
}`;

export function createBurnReveal({ canvas, src }) {
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
    console.error("Burn transition unavailable:", err);
    return null;
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  const u = (n) => gl.getUniformLocation(program, n);
  const loc = { res: u("uRes"), img: u("uImg"), pos: u("uPos"), t: u("uT"), time: u("uTime") };
  gl.uniform1i(u("uTex"), 0);

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
      gl.uniform2f(loc.img, img.naturalWidth, img.naturalHeight);
      ready = true;
    })
    .catch(() => {});

  return {
    get ready() {
      return ready && !gl.isContextLost();
    },
    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    },
    // pos: the photo's object-position as fractions [x, y]
    render(t, time, pos) {
      if (!ready || gl.isContextLost()) return;
      gl.uniform2f(loc.res, canvas.width, canvas.height);
      gl.uniform2f(loc.pos, pos[0], pos[1]);
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
