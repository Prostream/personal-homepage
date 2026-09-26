// One canvas, two small shaders: an ocean backdrop and the active 3D model.
const canvas = document.querySelector(".ocean-scene");
const chapters = [...document.querySelectorAll(".story-chapter")];
const buttons = [...document.querySelectorAll(".chapter-button")];
const controls = document.querySelector(".journey-controls-bar");
const objectSpace = document.querySelector(".object-space");
const caption = document.querySelector(".object-caption");
const motionButton = document.querySelector(".motion-button");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let gl,
  frame = 0,
  paused = reducedMotion.matches,
  active = 0;
let time = 0,
  previousTime = 0,
  changedAt = -1;

function showFallback() {
  cancelAnimationFrame(frame);
  canvas.hidden = true;
  controls.hidden = true;
  objectSpace.hidden = true;
  chapters.forEach((chapter) => {
    chapter.hidden = false;
  });
  document.body.classList.remove("scene-ready");
  document.querySelector(".scene-fallback").hidden = false;
}

const backgroundVertex = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * .5 + .5;
    gl_Position = vec4(a_position, 0., 1.);
  }
`;
const backgroundFragment = `
  precision mediump float;
  varying vec2 v_uv;
  uniform float u_time, u_chapter, u_aspect;
  void main() {
    vec2 uv = v_uv;
    float horizon = .43;
    vec2 sun = vec2(.86, .51 + u_chapter * .008);
    vec2 delta = (uv - sun) * vec2(u_aspect, 1.);
    float distanceToSun = length(delta);
    vec3 peach = vec3(.91, .64, .48);
    vec3 sky = mix(peach, vec3(.10, .20, .31), smoothstep(horizon, 1., uv.y));
    sky += vec3(.22, .13, .07) * exp(-distanceToSun * 8.);
    sky = mix(sky, vec3(1., .88, .65), 1. - smoothstep(.034, .038, distanceToSun));
    vec3 color = sky;
    if (uv.y < horizon) {
      // Intersect a view ray with a water plane; distant ripples compress at the horizon.
      float depth = min(1.8 / max(horizon - uv.y, .015), 100.);
      float x = (uv.x - .5) * depth * u_aspect;
      float wave = sin(x * .7 + depth * .9 - u_time * .5)
                 + .5 * sin(x * 1.8 - depth * .55 + u_time * .3);
      float detail = sin(depth * 3. + x * .5 + wave);
      float nearHorizon = pow(uv.y / horizon, 5.);
      color = mix(vec3(.035, .15, .22), vec3(.32, .42, .44), nearHorizon);
      color += vec3(.028, .053, .066) * wave;
      float spread = .018 + (horizon - uv.y) * .23;
      float reflection = exp(-pow((uv.x - sun.x + wave * .012) / spread, 2.));
      float sparkle = .15 + .85 * pow(max(0., detail * .5 + .5), 5.);
      color = mix(color, vec3(.99, .72, .46), reflection * sparkle * .85);
      color = mix(color, peach * .8, pow(uv.y / horizon, 26.) * .7);
    }
    // A darker upper-left corner supports the heading without relying on its shadow.
    float shade = (1. - smoothstep(.1, .8, uv.x)) * smoothstep(.45, .9, uv.y);
    color = mix(color, vec3(.035, .095, .15), shade * .72);
    gl_FragColor = vec4(color, 1.);
  }
`;
const objectVertex = `
  attribute vec3 a_position, a_normal, a_color;
  attribute float a_glow;
  uniform mat4 u_projection;
  uniform float u_angle, u_scale, u_bob;
  uniform vec3 u_offset;
  varying vec3 v_normal, v_color;
  varying float v_glow;
  void main() {
    float c = cos(u_angle), s = sin(u_angle);
    mat3 turn = mat3(c, 0., -s, 0., 1., 0., s, 0., c);
    float tilt = .13;
    mat3 lean = mat3(1., 0., 0., 0., cos(tilt), sin(tilt), 0., -sin(tilt), cos(tilt));
    vec3 p = turn * lean * (a_position + u_offset) * u_scale;
    gl_Position = u_projection * vec4(p + vec3(0., u_bob, -6.4), 1.);
    v_normal = turn * lean * a_normal;
    v_color = a_color;
    v_glow = a_glow;
  }
`;
const objectFragment = `
  precision mediump float;
  varying vec3 v_normal, v_color;
  varying float v_glow;
  uniform float u_fade;
  void main() {
    vec3 n = normalize(v_normal);
    float light = max(0., dot(n, normalize(vec3(-.4, .7, 1.))));
    vec3 color = v_color * (.38 + .62 * light);
    color = mix(color, v_color, v_glow);
    color += vec3(.10, .055, .02) * pow(1. - abs(n.z), 3.);
    gl_FragColor = vec4(color, u_fade);
  }
`;

function program(vertexSource, fragmentSource) {
  const result = gl.createProgram();
  for (const [type, source] of [
    [gl.VERTEX_SHADER, vertexSource],
    [gl.FRAGMENT_SHADER, fragmentSource],
  ]) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      throw new Error(gl.getShaderInfoLog(shader));
    gl.attachShader(result, shader);
    gl.deleteShader(shader);
  }
  gl.linkProgram(result);
  if (!gl.getProgramParameter(result, gl.LINK_STATUS))
    throw new Error(gl.getProgramInfoLog(result));
  return result;
}

// All model geometry is stored as position, normal, color, and light emission.
function triangle(mesh, a, b, c, color, glow = 0) {
  const u = b.map((v, i) => v - a[i]),
    v = c.map((value, i) => value - a[i]);
  const normal = [
    u[1] * v[2] - u[2] * v[1],
    u[2] * v[0] - u[0] * v[2],
    u[0] * v[1] - u[1] * v[0],
  ];
  const length = Math.hypot(...normal) || 1;
  for (const point of [a, b, c])
    mesh.push(...point, ...normal.map((n) => n / length), ...color, glow);
}
function box(mesh, center, size, color, glow = 0) {
  const corners = [
    [-1, -1, -1],
    [1, -1, -1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],
  ].map((p) => p.map((v, i) => center[i] + (v * size[i]) / 2));
  for (const [a, b, c, d] of [
    [4, 5, 6, 7],
    [1, 0, 3, 2],
    [0, 4, 7, 3],
    [5, 1, 2, 6],
    [3, 7, 6, 2],
    [0, 1, 5, 4],
  ]) {
    triangle(mesh, corners[a], corners[b], corners[c], color, glow);
    triangle(mesh, corners[a], corners[c], corners[d], color, glow);
  }
}
function sphere(mesh, center, radius, color, glow = 0, rings = 12, sides = 20) {
  const point = (i, j) => {
    const a = (i * Math.PI) / rings,
      b = (j * Math.PI * 2) / sides;
    return [
      Math.sin(a) * Math.cos(b),
      Math.cos(a),
      Math.sin(a) * Math.sin(b),
    ].map((v, k) => center[k] + v * radius);
  };
  for (let i = 0; i < rings; i++)
    for (let j = 0; j < sides; j++) {
      const a = point(i, j),
        b = point(i + 1, j),
        c = point(i + 1, j + 1),
        d = point(i, j + 1);
      triangle(mesh, a, d, b, color, glow);
      triangle(mesh, d, c, b, color, glow);
    }
}
function line(mesh, a, b, color) {
  for (const point of [a, b]) mesh.push(...point, 0, 0, 1, ...color, 1);
}
function upload(data, mode = gl.TRIANGLES) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  return { buffer, count: data.length / 10, mode };
}

const cream = [0.84, 0.79, 0.67],
  teal = [0.12, 0.5, 0.51],
  dark = [0.045, 0.13, 0.17];
const gold = [1, 0.74, 0.4],
  mint = [0.48, 0.98, 0.79];
function computer(secure) {
  const mesh = [];
  box(mesh, [0, 0.35, 0], [2.65, 1.85, 0.68], cream);
  box(mesh, [0, 0.43, 0.35], [2.28, 1.47, 0.055], dark);
  box(mesh, [0, 0.43, 0.385], [2.06, 1.25, 0.025], [0.035, 0.25, 0.27], 0.25);
  box(mesh, [0, -0.76, -0.05], [0.36, 0.5, 0.38], cream);
  box(mesh, [0, -1.04, 0], [1.6, 0.16, 0.9], cream);
  box(mesh, [0, -1.2, 0.91], [2.62, 0.16, 0.78], cream);
  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 12; col++) {
      box(
        mesh,
        [-1.12 + col * 0.2, -1.1, 0.64 + row * 0.16],
        [0.16, 0.045, 0.1],
        [0.54, 0.57, 0.52],
      );
    }
  for (let i = 0; i < 4; i++) {
    const width = secure ? 0.6 - i * 0.07 : 1.25 - i * 0.2;
    box(
      mesh,
      [-0.84 + width / 2, 0.77 - i * 0.2, 0.412],
      [width, 0.045, 0.015],
      mint,
      1,
    );
  }
  box(mesh, [-0.77, -0.03, 0.412], [0.12, 0.08, 0.015], gold, 1);
  sphere(mesh, [1.08, -0.42, 0.37], 0.038, mint, 1, 6, 8);
  if (secure) {
    const points = [
      [0.36, 0.85, 0.43],
      [0.82, 0.85, 0.43],
      [0.87, 0.47, 0.43],
      [0.59, 0.2, 0.43],
      [0.31, 0.47, 0.43],
    ];
    for (let i = 0; i < points.length; i++)
      triangle(
        mesh,
        [0.59, 0.57, 0.43],
        points[i],
        points[(i + 1) % points.length],
        gold,
        0.85,
      );
  }
  return { solid: upload(mesh) };
}
function globe() {
  const mesh = [],
    lines = [];
  sphere(mesh, [0, 0, 0], 1.26, [0.09, 0.38, 0.46], 0.05, 18, 28);
  for (let lat = -2; lat <= 2; lat++) {
    const a = (lat * Math.PI) / 6,
      y = Math.sin(a) * 1.29,
      r = Math.cos(a) * 1.29;
    for (let i = 0; i < 64; i++) {
      const t = (i * Math.PI) / 32,
        next = ((i + 1) * Math.PI) / 32;
      line(
        lines,
        [r * Math.cos(t), y, r * Math.sin(t)],
        [r * Math.cos(next), y, r * Math.sin(next)],
        [0.48, 0.73, 0.69],
      );
    }
  }
  for (let meridian = 0; meridian < 10; meridian++) {
    const longitude = (meridian * Math.PI) / 5;
    for (let i = 0; i < 32; i++) {
      const point = (t) => [
        1.29 * Math.sin(t) * Math.cos(longitude),
        1.29 * Math.cos(t),
        1.29 * Math.sin(t) * Math.sin(longitude),
      ];
      line(
        lines,
        point((i * Math.PI) / 32),
        point(((i + 1) * Math.PI) / 32),
        [0.48, 0.73, 0.69],
      );
    }
  }
  for (let i = 0; i < 100; i++)
    line(
      lines,
      orbit((i * Math.PI) / 50),
      orbit(((i + 1) * Math.PI) / 50),
      gold,
    );
  return { solid: upload(mesh), lines: upload(lines, gl.LINES) };
}
function orbit(t) {
  return [1.85 * Math.cos(t), 0.85 * Math.sin(t), 1.45 * Math.sin(t)];
}
function cloud(future) {
  const mesh = [],
    lines = [],
    spread = future ? 1.17 : 1;
  const cloudColor = future ? [0.96, 0.81, 0.65] : [0.78, 0.88, 0.88];
  for (const [x, y, z, r] of [
    [-0.67, 0.71, -0.17, 0.49],
    [0, 0.96, -0.14, 0.62],
    [0.65, 0.72, -0.18, 0.48],
    [0.03, 0.57, 0.0, 0.56],
  ]) {
    sphere(mesh, [x, y, z], r, cloudColor, 0.12);
  }
  for (let i = 0; i < 3; i++) {
    const x = (i - 1) * 0.73;
    box(mesh, [x, -0.62, 0.15], [0.58, 1.32, 0.65], [0.16, 0.29, 0.35]);
    for (let row = 0; row < 4; row++) {
      box(mesh, [x, -0.18 - row * 0.27, 0.49], [0.46, 0.14, 0.02], dark);
      sphere(mesh, [x + 0.14, -0.18 - row * 0.27, 0.52], 0.025, mint, 1, 4, 6);
    }
  }
  for (const node of [
    [-1.55, 0.15, 0.3],
    [1.55, 0.05, 0.35],
    [-1.05, 1.5, -0.15],
    [1.08, 1.5, -0.1],
  ]) {
    const target = node.map((v) => v * spread);
    line(lines, [0, 0.3, 0.12], target, gold);
    sphere(mesh, target, 0.105, future ? gold : mint, 0.8, 8, 12);
  }
  return { solid: upload(mesh), lines: upload(lines, gl.LINES) };
}

function startScene() {
  gl = canvas.getContext("webgl", { alpha: false, antialias: true });
  if (!gl) throw new Error("WebGL is unavailable");
  const background = program(backgroundVertex, backgroundFragment);
  const object = program(objectVertex, objectFragment);
  const location = (p, names) =>
    Object.fromEntries(
      names.map((name) => [name, gl.getUniformLocation(p, name)]),
    );
  const bg = location(background, ["u_time", "u_chapter", "u_aspect"]);
  const obj = location(object, [
    "u_projection",
    "u_angle",
    "u_scale",
    "u_bob",
    "u_offset",
    "u_fade",
  ]);
  const attributes = ["a_position", "a_normal", "a_color", "a_glow"].map(
    (name) => gl.getAttribLocation(object, name),
  );
  const bgPosition = gl.getAttribLocation(background, "a_position");
  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const models = [
    computer(false),
    computer(true),
    globe(),
    cloud(false),
    cloud(true),
  ];
  const markerData = [];
  sphere(markerData, [0, 0, 0], 0.085, [1, 0.88, 0.62], 1, 8, 12);
  const marker = upload(markerData);
  const captions = [
    "The first spark",
    "A foundation in security",
    "A world of possibilities",
    "Connecting what I’ve learned",
    "Room to grow",
  ];
  let bounds, area, pixelRatio;

  function resize() {
    bounds = canvas.getBoundingClientRect();
    area = objectSpace.getBoundingClientRect();
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio));
    canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));
  }
  function drawMesh(mesh, offset = [0, 0, 0]) {
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.buffer);
    attributes.forEach((attribute, i) => {
      gl.enableVertexAttribArray(attribute);
      gl.vertexAttribPointer(
        attribute,
        i === 3 ? 1 : 3,
        gl.FLOAT,
        false,
        40,
        i * 12,
      );
    });
    gl.uniform3fv(obj.u_offset, offset);
    gl.drawArrays(mesh.mode, 0, mesh.count);
  }
  function render() {
    gl.disable(gl.SCISSOR_TEST);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    attributes.forEach((attribute) => gl.disableVertexAttribArray(attribute));
    gl.useProgram(background);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(bgPosition);
    gl.vertexAttribPointer(bgPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1f(bg.u_time, time);
    gl.uniform1f(bg.u_chapter, active);
    gl.uniform1f(bg.u_aspect, bounds.width / bounds.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.disableVertexAttribArray(bgPosition);

    const x = Math.round((area.left - bounds.left) * pixelRatio);
    const y = Math.round((bounds.bottom - area.bottom + 28) * pixelRatio);
    const w = Math.round(area.width * pixelRatio),
      h = Math.round((area.height - 28) * pixelRatio);
    gl.viewport(x, y, w, h);
    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(x, y, w, h);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(object);
    const aspect = w / h,
      f = 1 / Math.tan(0.62 / 2),
      near = 0.1,
      far = 30;
    gl.uniformMatrix4fv(
      obj.u_projection,
      false,
      new Float32Array([
        f / aspect,
        0,
        0,
        0,
        0,
        f,
        0,
        0,
        0,
        0,
        (far + near) / (near - far),
        -1,
        0,
        0,
        (2 * far * near) / (near - far),
        0,
      ]),
    );
    gl.uniform1f(
      obj.u_angle,
      active === 2 ? time * 0.1 + 0.2 : -0.23 + Math.sin(time * 0.23) * 0.18,
    );
    gl.uniform1f(obj.u_scale, Math.min(1, aspect / 1.12));
    gl.uniform1f(obj.u_bob, Math.sin(time * 0.7) * 0.045);
    gl.uniform1f(
      obj.u_fade,
      paused ? 1 : Math.min(1, (time - changedAt) / 0.3),
    );
    const model = models[active];
    drawMesh(model.solid);
    if (model.lines) drawMesh(model.lines);
    if (active === 2) drawMesh(marker, orbit(time * 0.35 + 0.6));
  }
  function animate(now) {
    frame = 0;
    if (document.hidden || paused) return;
    // Limit animation to roughly 30 fps and avoid jumps after returning to the tab.
    const elapsed = now - previousTime;
    if (elapsed >= 1000 / 30) {
      time += Math.min(elapsed, 60) / 1000;
      previousTime = now;
      render();
    }
    frame = requestAnimationFrame(animate);
  }
  function refresh() {
    if (canvas.hidden) return;
    resize();
    render();
    if (!paused && !document.hidden && !frame) {
      previousTime = performance.now();
      frame = requestAnimationFrame(animate);
    }
  }
  function selectChapter(index) {
    active = index;
    changedAt = time;
    chapters.forEach((chapter, i) => {
      chapter.hidden = i !== index;
    });
    buttons.forEach((button, i) =>
      button.setAttribute("aria-pressed", String(i === index)),
    );
    caption.textContent = captions[index];
    objectSpace.dataset.object = [
      "computer",
      "computer",
      "globe",
      "cloud",
      "cloud",
    ][index];
    refresh();
  }
  function setPaused(value) {
    paused = value;
    cancelAnimationFrame(frame);
    frame = 0;
    motionButton.textContent = paused ? "Resume motion" : "Pause motion";
    motionButton.setAttribute("aria-pressed", String(paused));
    refresh();
  }
  document.body.classList.add("scene-ready");
  objectSpace.hidden = false;
  controls.hidden = false;
  buttons.forEach((button) =>
    button.addEventListener("click", () =>
      selectChapter(Number(button.dataset.chapter)),
    ),
  );
  motionButton.addEventListener("click", () => setPaused(!paused));
  reducedMotion.addEventListener("change", (event) => setPaused(event.matches));
  window.addEventListener("resize", refresh);
  document.addEventListener("visibilitychange", () => {
    cancelAnimationFrame(frame);
    frame = 0;
    if (!document.hidden) refresh();
  });
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    showFallback();
  });
  selectChapter(0);
  setPaused(paused);
}

try {
  startScene();
} catch (error) {
  console.warn(
    "The 3D scene could not start. Showing the full story.",
    error.message,
  );
  showFallback();
}
