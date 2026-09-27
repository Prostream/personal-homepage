// Native WebGL models over a local illustration; Canvas 2D supplies drifting petals.
const canvas = document.querySelector(".object-scene");
const particles = document.querySelector(".particles");
const area = document.querySelector(".object-space");
const chapters = [...document.querySelectorAll(".story-chapter")];
const buttons = [...document.querySelectorAll(".chapter-button")];
const motionButton = document.querySelector(".motion-button");
const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
const body = document.body;
let gl,
  frame = 0,
  active = 0,
  time = 0,
  previous = 0;
let paused = preference.matches;
const pose = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };
let pointer = null;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const cream = [0.91, 0.84, 0.7],
  teal = [0.12, 0.4, 0.43],
  dark = [0.035, 0.12, 0.15];
const gold = [1, 0.72, 0.39],
  mint = [0.49, 0.88, 0.72];

const vertexSource = `
  attribute vec3 a_position, a_normal, a_color;
  attribute float a_glow;
  uniform mat4 u_projection;
  uniform vec3 u_pose, u_offset;
  uniform float u_scale, u_bob, u_local;
  varying vec3 v_normal, v_color, v_position;
  varying float v_glow;
  mat3 rx(float a) { float c=cos(a),s=sin(a); return mat3(1.,0.,0.,0.,c,s,0.,-s,c); }
  mat3 ry(float a) { float c=cos(a),s=sin(a); return mat3(c,0.,-s,0.,1.,0.,s,0.,c); }
  mat3 rz(float a) { float c=cos(a),s=sin(a); return mat3(c,s,0.,-s,c,0.,0.,0.,1.); }
  void main() {
    mat3 rotation = rz(u_pose.z) * ry(u_pose.y) * rx(u_pose.x);
    mat3 local = rz(u_local);
    vec3 p = rotation * (local * a_position + u_offset) * u_scale;
    v_position = p + vec3(0., u_bob, -6.8);
    gl_Position = u_projection * vec4(v_position, 1.);
    v_normal = rotation * local * a_normal;
    v_color = a_color;
    v_glow = a_glow;
  }
`;
const fragmentSource = `
  precision mediump float;
  varying vec3 v_normal, v_color, v_position;
  varying float v_glow;
  void main() {
    vec3 n = normalize(v_normal);
    vec3 light = normalize(vec3(-.7, .9, 1.4));
    vec3 view = normalize(-v_position);
    float diffuse = max(0., dot(n, light));
    float specular = pow(max(0., dot(n, normalize(light + view))), 40.);
    float rim = pow(1. - max(0., dot(n, view)), 3.);
    vec3 color = v_color * (vec3(.30,.37,.41) + vec3(.79,.68,.52) * diffuse);
    color += vec3(1.,.83,.59) * (specular * .23 + rim * .15);
    color = mix(color, v_color, v_glow);
    gl_FragColor = vec4(color, 1.);
  }
`;

function createProgram() {
  const program = gl.createProgram();
  for (const [kind, source] of [
    [gl.VERTEX_SHADER, vertexSource],
    [gl.FRAGMENT_SHADER, fragmentSource],
  ]) {
    const shader = gl.createShader(kind);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      throw new Error(gl.getShaderInfoLog(shader));
    gl.attachShader(program, shader);
    gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    throw new Error(gl.getProgramInfoLog(program));
  return program;
}

// Each vertex stores position, a smooth surface normal, color, and emission.
function vertex(mesh, point, normal, color, glow = 0) {
  mesh.push(...point, ...normal, ...color, glow);
}
function roundedBox(mesh, center, size, color, radius = 0.08, glow = 0) {
  const half = size.map((v) => v / 2);
  const r = Math.min(radius, ...half);
  const samples = (h) => [-h, -h + r * 0.293, -h + r, h - r, h - r * 0.293, h];
  for (let axis = 0; axis < 3; axis++)
    for (const sign of [-1, 1]) {
      const u = (axis + 1) % 3,
        v = (axis + 2) % 3;
      const us = samples(half[u]),
        vs = samples(half[v]);
      const point = (i, j) => {
        const p = [0, 0, 0];
        p[axis] = half[axis] * sign;
        p[u] = us[i];
        p[v] = vs[j];
        const core = p.map((value, k) =>
          clamp(value, -half[k] + r, half[k] - r),
        );
        const delta = p.map((value, k) => value - core[k]);
        const length = Math.hypot(...delta) || 1;
        const normal = delta.map((value) => value / length);
        return {
          p: core.map((value, k) => center[k] + value + normal[k] * r),
          n: normal,
        };
      };
      for (let i = 0; i < us.length - 1; i++)
        for (let j = 0; j < vs.length - 1; j++) {
          const corners = [
            point(i, j),
            point(i + 1, j),
            point(i + 1, j + 1),
            point(i, j + 1),
          ];
          for (const k of [0, 1, 2, 0, 2, 3])
            vertex(mesh, corners[k].p, corners[k].n, color, glow);
        }
    }
}
function sphere(mesh, center, radius, color, glow = 0, rings = 24, sides = 36) {
  const point = (i, j) => {
    const a = (i * Math.PI) / rings,
      b = (j * Math.PI * 2) / sides;
    const n = [
      Math.sin(a) * Math.cos(b),
      Math.cos(a),
      Math.sin(a) * Math.sin(b),
    ];
    return { p: n.map((v, k) => center[k] + v * radius), n };
  };
  for (let i = 0; i < rings; i++)
    for (let j = 0; j < sides; j++) {
      const corners = [
        point(i, j),
        point(i + 1, j),
        point(i + 1, j + 1),
        point(i, j + 1),
      ];
      for (const k of [0, 1, 2, 0, 2, 3])
        vertex(mesh, corners[k].p, corners[k].n, color, glow);
    }
}
function line(mesh, a, b, color) {
  for (const p of [a, b]) vertex(mesh, p, [0, 0, 1], color, 1);
}
function upload(data, mode = gl.TRIANGLES) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  return { buffer, count: data.length / 10, mode };
}
function computer() {
  const mesh = [],
    shield = [];
  roundedBox(mesh, [0, 0.32, 0], [2.65, 1.95, 0.73], cream, 0.17);
  roundedBox(mesh, [0, 0.4, 0.36], [2.32, 1.53, 0.075], dark, 0.037);
  roundedBox(
    mesh,
    [0, 0.4, 0.405],
    [2.11, 1.31, 0.035],
    [0.04, 0.27, 0.29],
    0.017,
    0.2,
  );
  roundedBox(mesh, [0, -0.81, -0.09], [0.37, 0.55, 0.4], cream);
  roundedBox(mesh, [0, -1.04, 0.02], [1.6, 0.16, 0.94], cream);
  roundedBox(mesh, [0, -1.18, 0.94], [2.6, 0.18, 0.87], cream, 0.075);
  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 12; col++) {
      roundedBox(
        mesh,
        [-1.1 + col * 0.2, -1.07, 0.65 + row * 0.16],
        [0.158, 0.065, 0.108],
        [0.57, 0.62, 0.59],
        0.024,
      );
    }
  for (let i = 0; i < 4; i++)
    roundedBox(
      mesh,
      [-0.84 + (0.91 - i * 0.12) / 2, 0.77 - i * 0.21, 0.43],
      [0.91 - i * 0.12, 0.035, 0.01],
      mint,
      0.005,
      1,
    );
  roundedBox(mesh, [-0.79, -0.1, 0.43], [0.12, 0.075, 0.012], gold, 0.006, 1);
  sphere(mesh, [1.04, -0.45, 0.383], 0.038, mint, 1, 8, 12);
  const outline = [
    [0.36, 0.79, 0.442],
    [0.88, 0.79, 0.442],
    [0.85, 0.41, 0.442],
    [0.62, 0.2, 0.442],
    [0.39, 0.41, 0.442],
  ];
  for (let i = 0; i < outline.length; i++) {
    for (const p of [
      [0.62, 0.54, 0.442],
      outline[i],
      outline[(i + 1) % outline.length],
    ])
      vertex(shield, p, [0, 0, 1], gold, 0.9);
  }
  return { parts: [{ mesh: upload(mesh) }], shield: upload(shield) };
}
function orbit(t) {
  return [1.68 * Math.cos(t), 0.72 * Math.sin(t), 1.32 * Math.sin(t)];
}
function globe() {
  const mesh = [],
    lines = [];
  sphere(mesh, [0, 0, 0], 1.17, teal);
  for (let lat = -2; lat <= 2; lat++) {
    const angle = (lat * Math.PI) / 6,
      y = Math.sin(angle) * 1.18,
      r = Math.cos(angle) * 1.18;
    for (let i = 0; i < 96; i++) {
      const a = (i * Math.PI) / 48,
        b = ((i + 1) * Math.PI) / 48;
      line(
        lines,
        [r * Math.cos(a), y, r * Math.sin(a)],
        [r * Math.cos(b), y, r * Math.sin(b)],
        [0.67, 0.84, 0.74],
      );
    }
  }
  for (let meridian = 0; meridian < 12; meridian++) {
    const longitude = (meridian * Math.PI) / 6;
    const point = (t) => [
      1.18 * Math.sin(t) * Math.cos(longitude),
      1.18 * Math.cos(t),
      1.18 * Math.sin(t) * Math.sin(longitude),
    ];
    for (let i = 0; i < 48; i++)
      line(
        lines,
        point((i * Math.PI) / 48),
        point(((i + 1) * Math.PI) / 48),
        [0.67, 0.84, 0.74],
      );
  }
  // A gold orbit and two raised markers make the journey visible from any angle.
  for (let i = 0; i < 128; i++)
    line(
      lines,
      orbit((i * Math.PI) / 64),
      orbit(((i + 1) * Math.PI) / 64),
      gold,
    );
  sphere(mesh, [0.61, 0.75, 0.71], 0.067, gold, 0.3, 12, 16);
  sphere(mesh, [-0.72, 0.43, 0.83], 0.067, gold, 0.3, 12, 16);
  return { parts: [{ mesh: upload(mesh) }, { mesh: upload(lines, gl.LINES) }] };
}
function cloud() {
  const parts = [];
  for (const [i, values] of [
    [-0.65, 0.78, -0.08, 0.43],
    [0, 1.0, -0.1, 0.58],
    [0.61, 0.76, -0.09, 0.44],
    [0.04, 0.57, 0.04, 0.49],
  ].entries()) {
    const mesh = [];
    sphere(mesh, [0, 0, 0], values[3], [0.89, 0.91, 0.86], 0.05);
    parts.push({
      mesh: upload(mesh),
      position: values.slice(0, 3),
      motion: "cloud",
      phase: i,
    });
  }
  for (let i = 0; i < 3; i++) {
    const mesh = [];
    roundedBox(mesh, [0, 0, 0], [0.57, 1.25, 0.64], [0.16, 0.32, 0.36], 0.075);
    for (let row = 0; row < 4; row++) {
      roundedBox(
        mesh,
        [0, 0.43 - row * 0.27, 0.324],
        [0.44, 0.16, 0.028],
        dark,
        0.014,
      );
      sphere(mesh, [0.14, 0.43 - row * 0.27, 0.345], 0.027, mint, 1, 8, 12);
      roundedBox(
        mesh,
        [-0.06, 0.43 - row * 0.27, 0.345],
        [0.19, 0.022, 0.015],
        [0.45, 0.64, 0.61],
        0.007,
      );
    }
    parts.push({
      mesh: upload(mesh),
      position: [(i - 1) * 0.7, -0.62, 0.17],
      motion: "server",
      phase: i,
    });
  }
  for (const [i, p] of [
    [-1.42, 0.17, 0.3],
    [1.42, 0.18, 0.35],
    [-0.99, 1.47, -0.15],
    [0.99, 1.5, -0.1],
  ].entries()) {
    const mesh = [];
    sphere(mesh, [0, 0, 0], 0.092, gold, 0.3, 14, 20);
    parts.push({ mesh: upload(mesh), position: p, motion: "node", phase: i });
  }
  return { parts };
}
function fallback() {
  cancelAnimationFrame(frame);
  body.classList.remove("scene-ready");
  body.classList.add("motion-paused");
  area.hidden = true;
  document.querySelector(".journey-controls-bar").hidden = true;
  chapters.forEach((chapter) => {
    chapter.hidden = false;
  });
  document.querySelector(".scene-fallback").hidden = false;
}

function start() {
  gl = canvas.getContext("webgl", { alpha: true, antialias: true });
  if (!gl) throw new Error("WebGL is unavailable");
  const program = createProgram();
  gl.useProgram(program);
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 0);
  const names = [
    "u_projection",
    "u_pose",
    "u_offset",
    "u_scale",
    "u_bob",
    "u_local",
  ];
  const uniforms = Object.fromEntries(
    names.map((name) => [name, gl.getUniformLocation(program, name)]),
  );
  const attributes = ["a_position", "a_normal", "a_color", "a_glow"].map(
    (name) => gl.getAttribLocation(program, name),
  );
  const models = [computer(), globe(), cloud()];
  const markerData = [];
  sphere(markerData, [0, 0, 0], 0.09, gold, 0.7, 12, 16);
  const marker = upload(markerData);
  const connections = upload([], gl.LINES);
  const ctx = particles.getContext("2d");
  const petals = Array.from({ length: 30 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: 2 + Math.random() * 3,
    speed: 10 + Math.random() * 14,
    phase: Math.random() * 6.28,
  }));
  let width = 0,
    height = 0,
    ratio = 1,
    projection;
  const captions = [
    "The first spark",
    "A foundation in security",
    "A world of possibilities",
    "Connecting what I’ve learned",
    "Room to grow",
  ];
  const modelIndex = () => (active < 2 ? 0 : active === 2 ? 1 : 2);

  function resize() {
    ratio = Math.min(window.devicePixelRatio || 1, 1.75);
    const bounds = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(bounds.width * ratio));
    canvas.height = Math.max(1, Math.round(bounds.height * ratio));
    width = window.innerWidth;
    height = window.innerHeight;
    particles.width = Math.round(width * ratio);
    particles.height = Math.round(height * ratio);
    const aspect = canvas.width / canvas.height,
      f = 1 / Math.tan(0.62 / 2),
      near = 0.1,
      far = 30;
    projection = new Float32Array([
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
    ]);
  }
  function draw(mesh, offset = [0, 0, 0], local = 0) {
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
    gl.uniform3fv(uniforms.u_offset, offset);
    gl.uniform1f(uniforms.u_local, local);
    gl.drawArrays(mesh.mode, 0, mesh.count);
  }
  function drawPetals() {
    if (!ctx) return;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    for (const p of petals) {
      const x = ((p.x * width + time * p.speed) % (width + 60)) - 30;
      const y =
        ((p.y * height + time * p.speed * 0.4) % (height + 60)) -
        30 +
        Math.sin(time * 0.6 + p.phase) * 18;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(time * 0.5 + p.phase);
      ctx.scale(1, 0.35 + Math.abs(Math.sin(time * 0.8 + p.phase)) * 0.45);
      ctx.fillStyle = x < width * 0.44 ? "#f4c7a12b" : "#f9d3bd99";
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r * 1.6, p.r, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  function render() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(uniforms.u_projection, false, projection);
    const isGlobe = active === 2;
    const yaw = isGlobe
      ? time * 0.09 + 0.24
      : -0.24 + Math.sin(time * 0.85) * 0.1;
    gl.uniform3fv(uniforms.u_pose, [
      0.13 + pose.x,
      yaw + pose.y,
      Math.sin(time * 0.75) * 0.028,
    ]);
    gl.uniform1f(uniforms.u_bob, Math.sin(time * 1.1) * 0.055);
    gl.uniform1f(
      uniforms.u_scale,
      Math.min(1.04, (canvas.width / canvas.height) * 1.03),
    );
    const wires = [];
    for (const part of models[modelIndex()].parts) {
      let position = part.position ? [...part.position] : [0, 0, 0],
        tilt = 0;
      if (part.motion === "cloud")
        position[1] += Math.sin(time * 1.2 + part.phase * 0.7) * 0.035;
      if (part.motion === "server")
        tilt = Math.sin(time * 1.3 + part.phase * 0.6) * 0.032;
      if (part.motion === "node") {
        position = position.map((v) => v * (active === 4 ? 1.12 : 1));
        position[1] += Math.sin(time + part.phase) * 0.05;
        line(wires, [0, 0.35, 0.1], position, gold);
      }
      draw(part.mesh, position, tilt);
    }
    if (active === 1) draw(models[0].shield);
    if (isGlobe) draw(marker, orbit(time * 0.45 + 0.3));
    if (wires.length) {
      gl.bindBuffer(gl.ARRAY_BUFFER, connections.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wires), gl.DYNAMIC_DRAW);
      connections.count = wires.length / 10;
      draw(connections);
    }
    drawPetals();
  }
  function tick(now) {
    frame = 0;
    if (paused || document.hidden || !body.classList.contains("scene-ready"))
      return;
    const elapsed = now - previous;
    if (elapsed >= 1000 / 30) {
      const dt = Math.min(elapsed / 1000, 0.05);
      previous = now;
      time += dt;
      // A damped spring: pointer targets move the model, release lets it settle.
      for (const key of ["x", "y"]) {
        const velocity = "v" + key,
          target = "t" + key;
        pose[velocity] +=
          ((pose[target] - pose[key]) * 65 - pose[velocity] * 11) * dt;
        pose[key] += pose[velocity] * dt;
      }
      render();
    }
    frame = requestAnimationFrame(tick);
  }
  function refresh() {
    if (!body.classList.contains("scene-ready")) return;
    resize();
    render();
    if (!paused && !document.hidden && !frame) {
      previous = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }
  function release() {
    if (pointer !== null && area.hasPointerCapture(pointer.id))
      area.releasePointerCapture(pointer.id);
    pointer = null;
    pose.tx = 0;
    pose.ty = 0;
    area.classList.remove("is-dragging");
  }
  function select(index) {
    release();
    active = index;
    Object.keys(pose).forEach((key) => {
      pose[key] = 0;
    });
    chapters.forEach((chapter, i) => {
      chapter.hidden = i !== index;
    });
    buttons.forEach((button, i) =>
      button.setAttribute("aria-pressed", String(i === index)),
    );
    document.querySelector(".object-caption").textContent = captions[index];
    document.querySelector(".object-number").textContent = [
      "01 / 03 — THE COMPUTER",
      "02 / 03 — THE GLOBE",
      "03 / 03 — THE CLOUD",
    ][modelIndex()];
    area.dataset.object = ["computer", "globe", "cloud"][modelIndex()];
    refresh();
  }
  function setPaused(value) {
    paused = value;
    release();
    cancelAnimationFrame(frame);
    frame = 0;
    body.classList.toggle("motion-paused", paused);
    motionButton.textContent = paused ? "Resume motion" : "Pause motion";
    motionButton.setAttribute("aria-pressed", String(paused));
    document.querySelector(".object-hint").textContent = paused
      ? "Motion paused · Chapters are still available"
      : "Drag to turn · Arrow keys to explore";
    refresh();
  }
  area.addEventListener("pointerdown", (event) => {
    if (paused || event.button !== 0) return;
    pointer = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      tx: pose.ty,
      ty: pose.tx,
    };
    area.setPointerCapture(event.pointerId);
    area.classList.add("is-dragging");
  });
  area.addEventListener("pointermove", (event) => {
    if (paused) return;
    if (pointer && event.pointerId === pointer.id) {
      pose.ty = clamp(
        pointer.tx + (event.clientX - pointer.x) * 0.008,
        -1.3,
        1.3,
      );
      pose.tx = clamp(
        pointer.ty + (event.clientY - pointer.y) * 0.005,
        -0.55,
        0.55,
      );
    } else if (event.pointerType === "mouse") {
      const b = area.getBoundingClientRect();
      pose.ty = ((event.clientX - b.left) / b.width - 0.5) * 0.35;
      pose.tx = ((event.clientY - b.top) / b.height - 0.5) * 0.18;
    }
  });
  for (const name of ["pointerup", "pointercancel", "lostpointercapture"])
    area.addEventListener(name, release);
  area.addEventListener("pointerleave", () => {
    if (!pointer) {
      pose.tx = 0;
      pose.ty = 0;
    }
  });
  area.addEventListener("keydown", (event) => {
    if (
      paused ||
      !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(
        event.key,
      )
    )
      return;
    event.preventDefault();
    if (event.key === "Home") {
      pose.tx = 0;
      pose.ty = 0;
    }
    if (event.key === "ArrowLeft") pose.ty = clamp(pose.ty - 0.25, -1.3, 1.3);
    if (event.key === "ArrowRight") pose.ty = clamp(pose.ty + 0.25, -1.3, 1.3);
    if (event.key === "ArrowUp") pose.tx = clamp(pose.tx - 0.15, -0.55, 0.55);
    if (event.key === "ArrowDown") pose.tx = clamp(pose.tx + 0.15, -0.55, 0.55);
  });
  area.addEventListener("blur", release);
  buttons.forEach((button) =>
    button.addEventListener("click", () =>
      select(Number(button.dataset.chapter)),
    ),
  );
  motionButton.addEventListener("click", () => setPaused(!paused));
  preference.addEventListener("change", (event) => setPaused(event.matches));
  window.addEventListener("resize", refresh);
  document.addEventListener("visibilitychange", () => {
    cancelAnimationFrame(frame);
    frame = 0;
    release();
    body.classList.toggle("page-hidden", document.hidden);
    if (!document.hidden) refresh();
  });
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    fallback();
  });
  body.classList.add("scene-ready");
  area.hidden = false;
  document.querySelector(".journey-controls-bar").hidden = false;
  select(0);
  setPaused(paused);
}
try {
  start();
} catch (error) {
  console.warn(
    "The 3D scene could not start. Showing the full story.",
    error.message,
  );
  fallback();
}
