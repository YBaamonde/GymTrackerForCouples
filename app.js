const { useState, useMemo, useRef } = React;
const USERS = ["Yago", "Adri"];
const UC = { Yago: "#38bdf8", Adri: "#f472b6" };
const SK = { R: "gtr_r4", S: "gtr_s4" };

const ex = (id, name, muscles, tips, yS, yR, aS, aR, alt) => ({
  id,
  name,
  muscles,
  tips,
  Yago: { sets: yS, reps: yR },
  Adri: { sets: aS, reps: aR },
  ...(alt ? { alt } : {})
});

const DEFAULT_ROUTINES = [{
  id: "rA",
  name: "RUTINA A",
  color: "#f97316",
  exercises: [
    ex("rdl", "Peso muerto rumano (RDL)", "Isquiotibiales, glúteos, erectores espinales, core", "De pie con barra o mancuernas frente a los muslos. Empuja la cadera hacia atrás bajando la carga y mantiene la espalda neutral.", 4, 8, 4, 8),
    ex("goblet", "Goblet squat", "Cuádriceps, glúteos, core", "Sujeta la pesa a la altura del pecho y baja en sentadilla con control, manteniendo el torso erguido.", 4, 12, 4, 12),
    ex("press_banca", "Press de banca", "Pectorales, hombros, tríceps", "Ajusta la espalda y evita que los glúteos se despeguen del banco. Baja con control y empuja con todo el cuerpo.", 4, 7, 4, 8),
    ex("hip_thrust", "Hip thrust", "Glúteos, isquiotibiales, core", "Apoya la espalda en el banco, lleva la barra hacia la cadera y empuja con los glúteos sin hiperextender la espalda.", 3, 15, 3, 12),
    ex("dorsales_iso", "Dominadas / remos isométricos", "Dorsales, trapecio, bíceps", "Mantén la tensión en toda la fase y controla la bajada para que la carga sea estable.", 3, 10, 3, 12)
  ]
}, {
  id: "rB",
  name: "RUTINA B",
  color: "#38bdf8",
  exercises: [
    ex("sq_trasera", "Sentadilla trasera (back squat)", "Cuádriceps, glúteos, erectores espinales, core", "Barra sobre los trapecios, pies algo más anchos que los hombros, cadera y rodillas alineadas. Baja controlando y empuja fuerte.", 4, 8, 4, 10),
    ex("rdl_ligero", "RDL ligero", "Isquiotibiales, glúteos, core", "Baja la carga manteniendo la columna neutra y la cadera atrás hasta sentir un estiramiento hamstring en los isquios.", 3, 10, 3, 12),
    ex("press_mil_maq", "Press militar máquina", "Hombros, trapecio, tríceps", "Empuja con todo el torso alineado, sin arquear la espalda ni compensar con el tronco.", 3, 10, 3, 12),
    ex("jalon", "Jalón / lat pulldown", "Dorsales, bíceps, deltoides posteriores", "Llevar la barra hacia el pecho y devolver con control, sin tirar de la cabeza.", 3, 12, 3, 15),
    ex("face_b", "Face pull", "Deltoides posteriores, romboides, trapecio", "Mira al frente, separa los codos y lleva la polea hacia la cara. Controla la bajada.", 3, 18, 3, 15)
  ]
}, {
  id: "rC",
  name: "RUTINA C",
  color: "#4ade80",
  exercises: [
    ex("kb_swing", "Kettlebell swing", "Glúteos, isquiotibiales, core", "Bisagra de cadera, no mecer con la espalda. El peso se mueve con la fuerza de la cadera y el core.", 4, 15, 4, 12),
    ex("zancadas", "Zancadas", "Cuádriceps, glúteos, core", "Ajusta el paso y evita que la rodilla delantera se desplace hacia adentro. Baja y empuja con la pierna delantera.", 3, 10, 3, 10),
    ex("press_incl", "Press inclinado", "Pectorales, hombros, tríceps", "Mantén la espalda pegada al banco y baja con control para trabajar estabilidad y potencia.", 3, 8, 3, 12),
    ex("remo_maq_c", "Remo máquina", "Dorsales, romboides, bíceps", "Espalda neutra, pecho abierto, lleva la barra hacia el abdomen y vuelve con control.", 3, 12, 3, 14)
  ]
}];

const DEFAULT_SESSIONS = [{
  id: "s5",
  date: "2026-03-10T10:00:00.000Z",
  routineId: "rB",
  routineName: "RUTINA B",
  logs: {
    Yago: [{ exId: "sq_trasera", weight: 40, reps: 10, sets: 4, difficulty: 3, done: true }, { exId: "rdl_ligero", weight: 25, reps: 12, sets: 3, difficulty: 2, done: true }, { exId: "press_mil_maq", weight: 25, reps: 12, sets: 3, difficulty: 3, done: true }, { exId: "jalon", weight: 45, reps: 12, sets: 3, difficulty: 4, done: true }],
    Adri: [{ exId: "sq_trasera", weight: 20, reps: 12, sets: 4, difficulty: 3, done: true }, { exId: "rdl_ligero", weight: 10, reps: 5, sets: 3, difficulty: 4, done: true }, { exId: "press_mil_maq", weight: 10, reps: 10, sets: 3, difficulty: 3, done: true }, { exId: "jalon", weight: 17.5, reps: 15, sets: 3, difficulty: 2, done: true }]
  }
}, {
  id: "s4",
  date: "2026-02-24T10:00:00.000Z",
  routineId: "rA",
  routineName: "RUTINA A",
  logs: {
    Yago: [{ exId: "rdl", weight: 35, reps: 8, sets: 4, difficulty: 3, done: true }, { exId: "goblet", weight: 20, reps: 12, sets: 4, difficulty: 2, done: true }, { exId: "press_banca", weight: 50, reps: 7, sets: 4, difficulty: 4, done: true }, { exId: "hip_thrust", weight: 25, reps: 15, sets: 3, difficulty: 3, done: true }, { exId: "dorsales_iso", weight: 30, reps: 11, sets: 3, difficulty: 2, done: true }],
    Adri: [{ exId: "rdl", weight: 20, reps: 8, sets: 4, difficulty: 3, done: true }, { exId: "goblet", weight: 10, reps: 12, sets: 4, difficulty: 2, done: true }, { exId: "press_banca", weight: 20, reps: 8, sets: 4, difficulty: 3, done: true }, { exId: "hip_thrust", weight: 15, reps: 12, sets: 3, difficulty: 3, done: true }, { exId: "dorsales_iso", weight: 10, reps: 15, sets: 3, difficulty: 2, done: true }]
  }
}, {
  id: "s3",
  date: "2026-01-26T10:00:00.000Z",
  routineId: "rC",
  routineName: "RUTINA C",
  logs: {
    Yago: [{ exId: "kb_swing", weight: 10, reps: 20, sets: 4, difficulty: 2, done: true }, { exId: "zancadas", weight: 12.5, reps: 10, sets: 3, difficulty: 3, done: true }, { exId: "press_incl", weight: 22.5, reps: 8, sets: 3, difficulty: 4, done: true }, { exId: "remo_maq_c", weight: 52.5, reps: 12, sets: 3, difficulty: 3, done: true }],
    Adri: [{ exId: "kb_swing", weight: 6, reps: 10, sets: 4, difficulty: 3, done: true }, { exId: "zancadas", weight: 5, reps: 10, sets: 3, difficulty: 3, done: true }, { exId: "press_incl", weight: 7.5, reps: 12, sets: 3, difficulty: 4, done: true }, { exId: "remo_maq_c", weight: 25, reps: 14, sets: 3, difficulty: 2, done: true }]
  }
}, {
  id: "s2",
  date: "2026-01-20T10:00:00.000Z",
  routineId: "rB",
  routineName: "RUTINA B",
  logs: {
    Yago: [{ exId: "sq_trasera", weight: 40, reps: 12, sets: 4, difficulty: 3, done: true }, { exId: "rdl_ligero", weight: 20, reps: 12, sets: 3, difficulty: 3, done: true }, { exId: "press_mil_maq", weight: 17.5, reps: 12, sets: 3, difficulty: 2, done: true }, { exId: "jalon", weight: 45, reps: 10, sets: 3, difficulty: 4, done: true }, { exId: "face_b", weight: 37.5, reps: 20, sets: 3, difficulty: 2, done: true }],
    Adri: [{ exId: "sq_trasera", weight: 20, reps: 12, sets: 4, difficulty: 3, done: true }, { exId: "rdl_ligero", weight: 10, reps: 12, sets: 3, difficulty: 2, done: true }, { exId: "press_mil_maq", weight: 15, reps: 12, sets: 3, difficulty: 3, done: true }, { exId: "jalon", weight: 17.5, reps: 15, sets: 3, difficulty: 2, done: true }, { exId: "face_b", weight: 20, reps: 15, sets: 3, difficulty: 2, done: true }]
  }
}, {
  id: "s1",
  date: "2026-01-19T10:00:00.000Z",
  routineId: "rA",
  routineName: "RUTINA A",
  logs: {
    Yago: [{ exId: "rdl", weight: 35, reps: 8, sets: 4, difficulty: 2, done: true }, { exId: "goblet", weight: 20, reps: 12, sets: 4, difficulty: 3, done: true }, { exId: "press_banca", weight: 40, reps: 7, sets: 4, difficulty: 3, done: true }, { exId: "remo_brazo", weight: 22.5, reps: 15, sets: 3, difficulty: 2, done: true }, { exId: "hip_thrust", weight: 25, reps: 15, sets: 3, difficulty: 3, done: true }, { exId: "face_a", weight: 32.5, reps: 20, sets: 3, difficulty: 2, done: true }],
    Adri: [{ exId: "rdl", weight: 20, reps: 8, sets: 4, difficulty: 2, done: true }, { exId: "goblet", weight: 10, reps: 12, sets: 4, difficulty: 3, done: true }, { exId: "press_banca", weight: 20, reps: 8, sets: 4, difficulty: 3, done: true }, { exId: "remo_brazo", weight: 10, reps: 12, sets: 3, difficulty: 2, done: true }, { exId: "hip_thrust", weight: 15, reps: 12, sets: 3, difficulty: 3, done: true }, { exId: "face_a", weight: 17.5, reps: 15, sets: 3, difficulty: 2, done: true }]
  }
}];

const load = (k, d) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : d;
  } catch {
    return d;
  }
};

const persist = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

const getSiblingIds = (routines, exId) => {
  let name = null;
  for (const r of routines) {
    const e = r.exercises.find(e => e.id === exId);
    if (e) {
      name = e.name;
      break;
    }
  }
  if (!name) return [exId];
  const ids = [];
  routines.forEach(r => r.exercises.forEach(e => {
    if (e.name === name) ids.push(e.id);
  }));
  return ids;
};

const getLastWeight = (sessions, user, exId, routines) => {
  const ids = getSiblingIds(routines, exId);
  const sorted = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));
  for (const s of sorted) {
    const log = s.logs?.[user]?.find(l => ids.includes(l.exId) && l.weight !== "" && l.weight != null && !isNaN(parseFloat(l.weight)));
    if (log) return log.weight;
  }
  return null;
};

const DIFFICULTY_LABELS = ["Muy fácil", "Fácil", "Normal", "Difícil", "Muy difícil"];
const DIFFICULTY_COLORS = ["#4ade80", "#38bdf8", "#a78bfa", "#f59e0b", "#f87171"];

const getDifficultyLabel = (value) => {
  const safe = Math.max(1, Math.min(5, Number(value) || 3));
  return DIFFICULTY_LABELS[safe - 1];
};

const getDifficultyColor = (value) => {
  const safe = Math.max(1, Math.min(5, Number(value) || 3));
  return DIFFICULTY_COLORS[safe - 1];
};

const getExerciseHistory = (sessions, user, exId, routines) => {
  const ids = getSiblingIds(routines, exId);
  const history = [];
  [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(s => {
    const log = s.logs?.[user]?.find(l => ids.includes(l.exId) && l.weight !== "" && l.weight != null && !isNaN(parseFloat(l.weight)));
    if (!log) return;
    history.push({
      date: s.date,
      weight: parseFloat(log.weight),
      difficulty: typeof log.difficulty === "number" ? log.difficulty : 3,
      reps: parseFloat(log.reps) || 0,
      sets: parseInt(log.sets) || 0
    });
  });
  return history;
};

const clampToStep = (value, step = 2.5) => Math.round(value / step) * step;

const getSuggestedWeight = (sessions, user, exId, routines) => {
  const history = getExerciseHistory(sessions, user, exId, routines);
  if (!history.length) return null;

  const recent = history.slice(0, 4);
  const avgWeight = recent.reduce((sum, item) => sum + item.weight, 0) / recent.length;
  const avgDifficulty = recent.reduce((sum, item) => sum + item.difficulty, 0) / recent.length;
  const last = recent[0];
  const prev = recent[1] || recent[0];

  const difficultyBias = (3 - avgDifficulty) * 1.3;
  const trendBias = (last.weight - prev.weight) * 0.2;
  const suggestion = avgWeight + difficultyBias + trendBias;
  return clampToStep(Math.max(2.5, suggestion), 2.5);
};

function SparkChart({ data, color }) {
  if (!data || data.length < 2) {
    return React.createElement("div", {
      style: { color: "#475569", fontSize: 13, textAlign: "center", padding: "24px 0" }
    }, "Necesitas al menos 2 sesiones registradas para ver la gráfica.");
  }

  const vals = data.map(d => parseFloat(d.weight));
  const minV = Math.min(...vals);
  const maxV = Math.max(...vals);
  const range = maxV - minV || 1;
  const W = 300;
  const H = 170;
  const pad = { t: 28, r: 12, b: 42, l: 46 };
  const cw = W - pad.l - pad.r;
  const ch = H - pad.t - pad.b;
  const pts = data.map((d, i) => ({
    x: pad.l + i / Math.max(data.length - 1, 1) * cw,
    y: pad.t + ch - (parseFloat(d.weight) - minV) / range * ch,
    d
  }));
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaD = pathD + ` L${pts[pts.length - 1].x.toFixed(1)},${(pad.t + ch).toFixed(1)} L${pts[0].x.toFixed(1)},${(pad.t + ch).toFixed(1)} Z`;
  const gId = `g${color.replace(/[^a-z0-9]/gi, "")}`;
  const yL = [minV, minV + range * 0.5, maxV].map((v, i) => ({ v: Math.round(v * 10) / 10, y: pad.t + ch * (1 - i * 0.5) }));

  return React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    style: { width: "100%", overflow: "visible" }
  },
    React.createElement("defs", null,
      React.createElement("linearGradient", { id: gId, x1: "0", y1: "0", x2: "0", y2: "1" },
        React.createElement("stop", { offset: "0%", stopColor: color, stopOpacity: "0.25" }),
        React.createElement("stop", { offset: "100%", stopColor: color, stopOpacity: "0" })
      )
    ),
    yL.map((l, i) => React.createElement("g", { key: i },
      React.createElement("line", { x1: pad.l, y1: l.y, x2: pad.l + cw, y2: l.y, stroke: "#1e293b", strokeWidth: "1" }),
      React.createElement("text", { x: pad.l - 4, y: l.y + 4, fill: "#475569", fontSize: "10", textAnchor: "end" }, l.v)
    )),
    React.createElement("path", { d: areaD, fill: `url(#${gId})` }),
    React.createElement("path", { d: pathD, fill: "none", stroke: color, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }),
    pts.map((p, i) => {
      const isLast = i === pts.length - 1;
      const isFirst = i === 0;
      const show = isLast || isFirst || data.length <= 5;
      return React.createElement("g", { key: i },
        React.createElement("circle", { cx: p.x, cy: p.y, r: isLast ? 5 : 3.5, fill: color }),
        show && React.createElement("text", { x: p.x, y: p.y - 10, fill: color, fontSize: "11", textAnchor: "middle", fontWeight: "bold" }, parseFloat(p.d.weight), "kg"),
        React.createElement("text", { x: p.x, y: pad.t + ch + 20, fill: "#475569", fontSize: "9", textAnchor: "middle" }, new Date(p.d.date).toLocaleDateString("es", { day: "numeric", month: "short" }))
      );
    })
  );
}

function InfoModal({ exercise, mode, onClose }) {
  if (!exercise) return null;
  return React.createElement("div", {
    style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 300 },
    onClick: onClose
  },
    React.createElement("div", {
      style: { background: "#1e293b", borderRadius: "20px 20px 0 0", padding: "20px 20px 36px", width: "100%", maxWidth: 480 },
      onClick: e => e.stopPropagation()
    },
      React.createElement("div", { style: { width: 36, height: 4, background: "#334155", borderRadius: 2, margin: "0 auto 18px" } }),
      React.createElement("div", { style: { fontWeight: 700, fontSize: 18, color: "#f1f5f9", marginBottom: 12 } }, exercise.name),
      exercise.alt && React.createElement("div", { style: { display: "inline-block", background: "#0f172a", borderRadius: 20, padding: "4px 10px", fontSize: 11, color: "#475569", marginBottom: 14 } }, "Alternativa · ", exercise.alt),
      exercise.muscles && React.createElement("div", { style: { background: "#0f172a", borderRadius: 10, padding: "12px 14px", marginBottom: 12 } },
        React.createElement("div", { style: { fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 } }, "Músculos principales"),
        React.createElement("div", { style: { fontSize: 13, color: "#94a3b8", lineHeight: 1.6 } }, exercise.muscles)
      ),
      mode === "workout" && exercise.tips && React.createElement("div", { style: { background: "#0f172a", borderRadius: 10, padding: "12px 14px", marginBottom: 14 } },
        React.createElement("div", { style: { fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 } }, "Cómo realizarlo"),
        React.createElement("div", { style: { fontSize: 13, color: "#94a3b8", lineHeight: 1.7 } }, exercise.tips)
      ),
      React.createElement("button", { onClick: onClose, style: { width: "100%", background: "#334155", border: "none", borderRadius: 12, padding: 14, color: "#f1f5f9", fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 4 } }, "Cerrar")
    )
  );
}

const NAV = [{ id: "home", label: "Hoy", d: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z", fill: true }, { id: "workout", label: "Entreno", d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" }, { id: "routines", label: "Rutinas", d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }, { id: "progress", label: "Progreso", d: "M3 3v18h18M7 16l4-4 4 4 4-8" }];

function BottomNav({ tab, setTab, hasWorkout }) {
  return React.createElement("div", {
    style: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#0f172a", borderTop: "1px solid #1e293b", display: "flex", zIndex: 100, paddingBottom: "env(safe-area-inset-bottom, 0px)" }
  }, NAV.map(item => {
    const active = tab === item.id;
    return React.createElement("button", {
      key: item.id,
      onClick: () => setTab(item.id),
      style: { flex: 1, padding: "10px 0 8px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: active ? "#38bdf8" : "#475569", position: "relative" }
    },
      item.id === "workout" && hasWorkout && React.createElement("div", { style: { position: "absolute", top: 8, right: "calc(50% - 18px)", width: 7, height: 7, borderRadius: "50%", background: "#4ade80", border: "1px solid #0f172a" } }),
      React.createElement("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: item.fill && active ? "currentColor" : "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: item.d })),
      React.createElement("span", { style: { fontSize: 10, fontWeight: active ? 700 : 400, letterSpacing: 0.2 } }, item.label)
    );
  }));
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return React.createElement("div", {
    style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }
  },
    React.createElement("div", { style: { background: "#1e293b", borderRadius: 16, padding: 24, width: "100%", maxWidth: 320, textAlign: "center" } },
      React.createElement("div", { style: { fontSize: 15, lineHeight: 1.6, marginBottom: 24, color: "#e2e8f0" } }, message),
      React.createElement("div", { style: { display: "flex", gap: 10 } },
        React.createElement("button", { onClick: onCancel, style: { flex: 1, background: "#334155", border: "none", borderRadius: 10, padding: 14, color: "#94a3b8", fontSize: 14, fontWeight: 600, cursor: "pointer" } }, "Volver"),
        React.createElement("button", { onClick: onConfirm, style: { flex: 1, background: "#ef4444", border: "none", borderRadius: 10, padding: 14, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" } }, "Cancelar")
      )
    )
  );
}

function HomeTab({ routines, sessions, onStart }) {
  const today = new Date();
  const dateStr = today.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
  const recent = sessions.slice(0, 6);

  return React.createElement("div", { style: { padding: "28px 16px 16px" } },
    React.createElement("p", { style: { color: "#475569", fontSize: 13, margin: "0 0 2px", textTransform: "capitalize" } }, dateStr),
    React.createElement("h1", { style: { fontSize: 26, fontWeight: 700, margin: "0 0 28px", color: "#f1f5f9", lineHeight: 1.2 } }, "¡Hola,", React.createElement("br", null), React.createElement("span", { style: { color: "#38bdf8" } }, "Yago"), " y ", React.createElement("span", { style: { color: "#f472b6" } }, "Adri"), "! 💪"),
    React.createElement("p", { style: { color: "#64748b", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12 } }, "¿Qué entrenamos hoy?"),
    React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 36 } }, routines.map(r => {
      const lastS = sessions.find(s => s.routineId === r.id);
      const lastDate = lastS ? new Date(lastS.date).toLocaleDateString("es-ES", { day: "numeric", month: "short" }) : null;
      return React.createElement("button", {
        key: r.id,
        onClick: () => onStart(r),
        style: { background: "#1e293b", border: `1px solid ${r.color}22`, borderLeft: `4px solid ${r.color}`, borderRadius: 14, padding: "18px 20px", textAlign: "left", cursor: "pointer", color: "#f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }
      },
        React.createElement("div", null,
          React.createElement("div", { style: { fontWeight: 700, fontSize: 16 } }, r.name),
          React.createElement("div", { style: { color: "#475569", fontSize: 12, marginTop: 4 } }, r.exercises.length, " ejercicios", lastDate ? ` · Último: ${lastDate}` : " · Sin historial")
        ),
        React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: r.color, strokeWidth: "2.5", strokeLinecap: "round" }, React.createElement("path", { d: "M5 12h14M12 5l7 7-7 7" }))
      );
    })),
    recent.length > 0 && React.createElement(React.Fragment, null,
      React.createElement("p", { style: { color: "#64748b", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12 } }, "Historial reciente"),
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, recent.map(s => {
        const r = routines.find(x => x.id === s.routineId);
        return React.createElement("div", {
          key: s.id,
          style: { background: "#1e293b", borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `3px solid ${r?.color ?? "#475569"}` }
        },
          React.createElement("div", null,
            React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, s.routineName),
            React.createElement("div", { style: { color: "#475569", fontSize: 12, marginTop: 2 } }, new Date(s.date).toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" }))
          ),
          React.createElement("span", { style: { color: "#4ade80", fontSize: 16, fontWeight: 700 } }, "✓")
        );
      }))
    )
  );
}

function DataManager({ routines, sessions, onImport }) {
  const [msg, setMsg] = useState(null);
  const toast = (m, ok = true) => {
    setMsg({ text: m, ok });
    setTimeout(() => setMsg(null), 3500);
  };
  const fileRef = useRef();
  const exportData = () => {
    const data = JSON.stringify({ version: 2, exported: new Date().toISOString(), routines, sessions }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gym-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Exportado correctamente");
  };
  const importData = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.routines || !data.sessions) throw new Error();
        onImport(data.routines, data.sessions);
        toast("Datos importados correctamente");
      } catch {
        toast("Error: archivo no válido", false);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };
  return React.createElement("div", { style: { marginTop: 28, borderTop: "1px solid #1e293b", paddingTop: 24, paddingBottom: 8 } },
    React.createElement("p", { style: { fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 12px" } }, "Gestión de datos"),
    msg && React.createElement("div", { style: { background: "#1e293b", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 13, color: msg.ok ? "#4ade80" : "#f87171" } }, (msg.ok ? "✓" : "✗") + " " + msg.text),
    React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 8 } },
      React.createElement("button", { onClick: exportData, style: { flex: 1, background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: "13px 8px", color: "#94a3b8", fontSize: 13, cursor: "pointer", fontWeight: 500 } }, "⬆ Exportar JSON"),
      React.createElement("label", { style: { flex: 1, background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: "13px 8px", color: "#94a3b8", fontSize: 13, cursor: "pointer", textAlign: "center", fontWeight: 500, display: "block" } }, "⬇ Importar JSON",
        React.createElement("input", { ref: fileRef, type: "file", accept: ".json", onChange: importData, style: { display: "none" } })
      )
    ),
    React.createElement("p", { style: { fontSize: 11, color: "#334155", margin: "6px 0 0", lineHeight: 1.5 } }, "Exporta regularmente como backup. Al importar se sobreescriben todos los datos actuales.")
  );
}

function RoutineEditor({ routines, updateRoutines, onInfo }) {
  const [expanded, setExpanded] = useState(null);
  const [editEx, setEditEx] = useState(null);
  const [addingTo, setAddingTo] = useState(null);
  const [newExName, setNewExName] = useState("");
  const [showNewRoutine, setShowNewRoutine] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState("");
  const COLORS = ["#f97316", "#38bdf8", "#4ade80", "#a78bfa", "#fb7185", "#facc15", "#34d399"];

  const addRoutine = () => {
    if (!newRoutineName.trim()) return;
    const r = { id: `r_${Date.now()}`, name: newRoutineName.trim().toUpperCase(), color: COLORS[routines.length % COLORS.length], exercises: [] };
    updateRoutines([...routines, r]);
    setNewRoutineName("");
    setShowNewRoutine(false);
  };

  const addEx = rId => {
    if (!newExName.trim()) return;
    const e = { id: `ex_${Date.now()}`, name: newExName.trim(), muscles: "", tips: "", Yago: { sets: 3, reps: "8-12" }, Adri: { sets: 3, reps: "8-12" } };
    updateRoutines(routines.map(r => r.id === rId ? { ...r, exercises: [...r.exercises, e] } : r));
    setNewExName("");
    setAddingTo(null);
  };

  const removeEx = (rId, eId) => {
    updateRoutines(routines.map(r => r.id === rId ? { ...r, exercises: r.exercises.filter(e => e.id !== eId) } : r));
    setEditEx(null);
  };

  const upField = (rId, eId, user, field, val) => updateRoutines(routines.map(r => r.id === rId ? { ...r, exercises: r.exercises.map(e => e.id === eId ? { ...e, [user]: { ...e[user], [field]: field === "sets" ? parseInt(val) || 0 : val } } : e) } : r));
  const upExName = (rId, eId, name) => updateRoutines(routines.map(r => r.id === rId ? { ...r, exercises: r.exercises.map(e => e.id === eId ? { ...e, name } : e) } : r));
  const upMuscles = (rId, eId, muscles) => updateRoutines(routines.map(r => r.id === rId ? { ...r, exercises: r.exercises.map(e => e.id === eId ? { ...e, muscles } : e) } : r));

  const inp = (ov = {}) => ({
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: 8,
    color: "#f1f5f9",
    fontSize: 13,
    padding: "8px 10px",
    outline: "none",
    boxSizing: "border-box",
    ...ov
  });

  return React.createElement("div", { style: { padding: "24px 16px" } },
    React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 } },
      React.createElement("h1", { style: { fontSize: 22, fontWeight: 700, margin: 0, color: "#f1f5f9" } }, "Rutinas"),
      React.createElement("button", { onClick: () => setShowNewRoutine(!showNewRoutine), style: { background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: "8px 14px", color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer" } }, "+ Nueva")
    ),
    showNewRoutine && React.createElement("div", { style: { background: "#1e293b", borderRadius: 12, padding: 14, marginBottom: 14, display: "flex", gap: 8 } },
      React.createElement("input", { value: newRoutineName, onChange: e => setNewRoutineName(e.target.value), onKeyDown: e => e.key === "Enter" && addRoutine(), placeholder: "Nombre (ej: HOMBRO)", autoFocus: true, style: { ...inp(), flex: 1 } }),
      React.createElement("button", { onClick: addRoutine, style: { background: "#3b82f6", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", fontWeight: 700, cursor: "pointer" } }, "+"),
      React.createElement("button", { onClick: () => setShowNewRoutine(false), style: { background: "#334155", border: "none", borderRadius: 8, padding: "8px 12px", color: "#94a3b8", cursor: "pointer" } }, "✕")
    ),
    React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, routines.map(r => React.createElement("div", { key: r.id, style: { background: "#1e293b", borderRadius: 12, overflow: "hidden" } },
      React.createElement("button", { onClick: () => setExpanded(expanded === r.id ? null : r.id), style: { width: "100%", background: "none", border: "none", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", color: "#f1f5f9" } },
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
          React.createElement("div", { style: { width: 4, height: 28, borderRadius: 2, background: r.color } }),
          React.createElement("div", { style: { textAlign: "left" } },
            React.createElement("div", { style: { fontWeight: 700, fontSize: 15 } }, r.name),
            React.createElement("div", { style: { color: "#475569", fontSize: 12 } }, r.exercises.length, " ejercicios")
          )
        ),
        React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "#64748b", strokeWidth: "2.5" }, React.createElement("path", { d: expanded === r.id ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6" }))
      ),
      expanded === r.id && React.createElement("div", { style: { borderTop: "1px solid #0f172a" } }, r.exercises.map(ex => React.createElement("div", { key: ex.id, style: { padding: "12px 16px", borderBottom: "1px solid #0f172a88" } },
        editEx === ex.id ? React.createElement("div", null,
          React.createElement("input", { value: ex.name, onChange: e => upExName(r.id, ex.id, e.target.value), placeholder: "Nombre del ejercicio", style: { ...inp(), width: "100%", marginBottom: 8, border: "1px solid #3b82f666" } }),
          React.createElement("input", { value: ex.muscles || "", onChange: e => upMuscles(r.id, ex.id, e.target.value), placeholder: "Músculos (ej: Cuádriceps, glúteos)", style: { ...inp(), width: "100%", marginBottom: 10, fontSize: 12 } }),
          React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 10 } }, USERS.map(u => React.createElement("div", { key: u, style: { flex: 1 } },
            React.createElement("div", { style: { fontSize: 11, color: UC[u], fontWeight: 700, marginBottom: 5 } }, u),
            React.createElement("div", { style: { display: "flex", gap: 5 } },
              React.createElement("div", { style: { flex: 1 } },
                React.createElement("div", { style: { fontSize: 10, color: "#475569", marginBottom: 3 } }, "Series"),
                React.createElement("input", { type: "number", value: ex[u].sets, onChange: e => upField(r.id, ex.id, u, "sets", e.target.value), style: { ...inp(), width: "100%", textAlign: "center", padding: "7px 4px" } })
              ),
              React.createElement("div", { style: { flex: 1 } },
                React.createElement("div", { style: { fontSize: 10, color: "#475569", marginBottom: 3 } }, "Reps"),
                React.createElement("input", { type: "text", value: ex[u].reps, onChange: e => upField(r.id, ex.id, u, "reps", e.target.value), placeholder: "6-10", style: { ...inp(), width: "100%", textAlign: "center", padding: "7px 4px" } })
              )
            )
          ))),
          React.createElement("div", { style: { display: "flex", gap: 8 } },
            React.createElement("button", { onClick: () => setEditEx(null), style: { flex: 1, background: "#3b82f6", border: "none", borderRadius: 8, padding: "9px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" } }, "Guardar"),
            React.createElement("button", { onClick: () => removeEx(r.id, ex.id), style: { background: "#ef444418", border: "1px solid #ef444444", borderRadius: 8, padding: "9px 14px", color: "#ef4444", fontSize: 13, cursor: "pointer" } }, "Eliminar")
          )
        ) : React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
          React.createElement("div", { style: { flex: 1, minWidth: 0 } },
            React.createElement("div", { style: { fontWeight: 500, fontSize: 14, color: "#e2e8f0" } }, ex.name),
            React.createElement("div", { style: { fontSize: 12, color: "#475569", marginTop: 3 } }, React.createElement("span", { style: { color: UC.Yago } }, "Y"), " ", ex.Yago.sets, "×", ex.Yago.reps, "  ", React.createElement("span", { style: { color: UC.Adri } }, "A"), " ", ex.Adri.sets, "×", ex.Adri.reps, ex.alt && React.createElement("span", { style: { marginLeft: 8, color: "#334155", fontSize: 11 } }, ex.alt)),
            ex.muscles && React.createElement("div", { style: { fontSize: 11, color: "#334155", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, ex.muscles)
          ),
          React.createElement("div", { style: { display: "flex", gap: 6, marginLeft: 8, flexShrink: 0 } },
            React.createElement("button", { onClick: () => onInfo(ex, "routines"), style: { background: "#0f172a", border: "1px solid #334155", borderRadius: 8, width: 32, height: 32, color: "#475569", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" } }, "ℹ"),
            React.createElement("button", { onClick: () => setEditEx(ex.id), style: { background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "6px 12px", color: "#94a3b8", fontSize: 12, cursor: "pointer" } }, "Editar")
          )
        )
      ))),
      addingTo === r.id ? React.createElement("div", { style: { padding: "12px 16px", display: "flex", gap: 8 } },
        React.createElement("input", { value: newExName, onChange: e => setNewExName(e.target.value), placeholder: "Nombre del ejercicio", onKeyDown: e => e.key === "Enter" && addEx(r.id), autoFocus: true, style: { ...inp(), flex: 1, border: "1px solid #3b82f666" } }),
        React.createElement("button", { onClick: () => addEx(r.id), style: { background: "#3b82f6", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 16 } }, "+"),
        React.createElement("button", { onClick: () => { setAddingTo(null); setNewExName(""); }, style: { background: "#334155", border: "none", borderRadius: 8, padding: "8px 12px", color: "#94a3b8", cursor: "pointer" } }, "✕")
      ) : React.createElement("button", { onClick: () => setAddingTo(r.id), style: { width: "100%", background: "none", border: "none", padding: "12px 16px", color: "#475569", fontSize: 13, cursor: "pointer", textAlign: "left" } }, "+ Añadir ejercicio")
    ))),
    React.createElement(DataManager, { routines, sessions: routines.map(() => []), onImport: () => {} })
  );
}

function ProgressTab({ sessions, routines }) {
  const [user, setUser] = useState("Yago");
  const [mode, setMode] = useState("ejercicio");
  const [selExName, setSelExName] = useState(null);
  const [selRoutineId, setSelRoutineId] = useState(null);
  const color = UC[user];

  const uniqueExercises = useMemo(() => {
    const seen = new Set();
    const result = [];
    routines.forEach(r => r.exercises.forEach(e => {
      if (!seen.has(e.name)) {
        seen.add(e.name);
        result.push(e);
      }
    }));
    return result;
  }, [routines]);

  const chartData = useMemo(() => {
    if (!selExName) return [];
    const allIds = [];
    routines.forEach(r => r.exercises.forEach(e => {
      if (e.name === selExName) allIds.push(e.id);
    }));
    return sessions.filter(s => allIds.some(id => s.logs?.[user]?.find(l => l.exId === id && l.weight !== "" && l.weight != null && !isNaN(parseFloat(l.weight))))).sort((a, b) => new Date(a.date) - new Date(b.date)).map(s => {
      const log = s.logs[user].find(l => allIds.includes(l.exId) && l.weight !== "" && l.weight != null && !isNaN(parseFloat(l.weight)));
      return { date: s.date, weight: parseFloat(log.weight), routineName: s.routineName };
    }).filter(d => !isNaN(d.weight));
  }, [sessions, user, selExName, routines]);

  const stats = chartData.length > 0 ? {
    max: Math.max(...chartData.map(d => d.weight)),
    last: chartData[chartData.length - 1]?.weight,
    delta: chartData.length > 1 ? chartData[chartData.length - 1].weight - chartData[0].weight : null
  } : null;

  const routineSummary = useMemo(() => {
    if (!selRoutineId) return [];
    const r = routines.find(r => r.id === selRoutineId);
    if (!r) return [];
    return r.exercises.map(ex => {
      const allIds = [];
      routines.forEach(r2 => r2.exercises.forEach(e => {
        if (e.name === ex.name) allIds.push(e.id);
      }));
      const pts = sessions.filter(s => allIds.some(id => s.logs?.[user]?.find(l => l.exId === id && l.weight !== "" && l.weight != null && !isNaN(parseFloat(l.weight))))).sort((a, b) => new Date(a.date) - new Date(b.date)).map(s => {
        const log = s.logs[user].find(l => allIds.includes(l.exId) && l.weight !== "" && l.weight != null);
        return log ? parseFloat(log.weight) : null;
      }).filter(v => v != null && !isNaN(v));
      return { name: ex.name, first: pts[0] ?? null, last: pts[pts.length - 1] ?? null, delta: pts.length > 1 ? Math.round((pts[pts.length - 1] - pts[0]) * 10) / 10 : null, sessions: pts.length };
    });
  }, [selRoutineId, sessions, user, routines]);

  const selRoutine = routines.find(r => r.id === selRoutineId);

  return React.createElement("div", { style: { padding: "24px 16px" } },
    React.createElement("h1", { style: { fontSize: 22, fontWeight: 700, marginBottom: 20, color: "#f1f5f9" } }, "Progreso"),
    React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 20 } }, USERS.map(u => React.createElement("button", { key: u, onClick: () => { setUser(u); setSelExName(null); }, style: { flex: 1, padding: "11px", border: "none", borderRadius: 12, background: user === u ? UC[u] : "#1e293b", color: user === u ? "#0f172a" : "#475569", fontWeight: 700, fontSize: 15, cursor: "pointer" } }, u))),
    React.createElement("div", { style: { display: "flex", gap: 0, marginBottom: 24, background: "#1e293b", borderRadius: 12, padding: 4 } }, [
      ["ejercicio", "Por ejercicio"],
      ["rutina", "Por rutina"]
    ].map(([m, label]) => React.createElement("button", { key: m, onClick: () => { setMode(m); setSelExName(null); setSelRoutineId(null); }, style: { flex: 1, padding: "9px", border: "none", borderRadius: 9, background: mode === m ? "#0f172a" : "transparent", color: mode === m ? color : "#475569", fontWeight: mode === m ? 700 : 400, fontSize: 13, cursor: "pointer", transition: "all 0.2s" } }, label))),
    mode === "ejercicio" && React.createElement(React.Fragment, null,
      React.createElement("div", { style: { marginBottom: 24 } },
        React.createElement("div", { style: { fontSize: 11, color: "#475569", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 } }, "Ejercicio"),
        React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } }, uniqueExercises.map(ex => React.createElement("button", { key: ex.name, onClick: () => setSelExName(ex.name === selExName ? null : ex.name), style: { padding: "8px 14px", border: `1px solid ${selExName === ex.name ? color : "#1e293b"}`, borderRadius: 20, background: selExName === ex.name ? `${color}22` : "#1e293b", color: selExName === ex.name ? color : "#64748b", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" } }, ex.name)))
      ),
      selExName ? React.createElement("div", { style: { background: "#1e293b", borderRadius: 14, padding: 16 } },
        React.createElement("div", { style: { fontWeight: 700, fontSize: 16, color: "#f1f5f9", marginBottom: 2 } }, selExName),
        React.createElement("div", { style: { fontSize: 12, color: "#475569", marginBottom: 16 } }, chartData.length, " ", chartData.length === 1 ? "sesión" : "sesiones", " registradas con ", user),
        React.createElement(SparkChart, { data: chartData, color }),
        stats && chartData.length >= 2 && React.createElement("div", { style: { display: "flex", gap: 8, marginTop: 20 } }, [{ label: "Máximo", value: `${stats.max}kg` }, { label: "Último", value: `${stats.last}kg` }, { label: "Ganado", value: stats.delta != null ? `${stats.delta > 0 ? "+" : ""}${Math.round(stats.delta * 10) / 10}kg` : "—", color: stats.delta > 0 ? "#4ade80" : stats.delta < 0 ? "#f87171" : "#94a3b8" }].map(s => React.createElement("div", { key: s.label, style: { flex: 1, background: "#0f172a", borderRadius: 10, padding: "12px 8px", textAlign: "center" } }, React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: s.color || color } }, s.value), React.createElement("div", { style: { fontSize: 10, color: "#475569", marginTop: 3 } }, s.label))))
      ) : React.createElement("div", { style: { background: "#1e293b", borderRadius: 14, padding: "36px 16px", textAlign: "center", color: "#475569" } }, React.createElement("div", { style: { fontSize: 36, marginBottom: 10 } }, "👆"), React.createElement("div", { style: { fontSize: 14 } }, "Selecciona un ejercicio para ver la evolución"))
    ),
    mode === "rutina" && React.createElement(React.Fragment, null,
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 } }, routines.map(r => React.createElement("button", { key: r.id, onClick: () => setSelRoutineId(r.id === selRoutineId ? null : r.id), style: { background: "#1e293b", border: `1px solid ${selRoutineId === r.id ? r.color : "#1e293b"}`, borderLeft: `4px solid ${r.color}`, borderRadius: 12, padding: "14px 16px", textAlign: "left", cursor: "pointer", color: "#f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" } },
        React.createElement("div", { style: { fontWeight: 700, fontSize: 15 } }, r.name),
        React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "#64748b", strokeWidth: "2.5" }, React.createElement("path", { d: selRoutineId === r.id ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6" }))
      ))),
      selRoutineId && selRoutine && React.createElement("div", { style: { background: "#1e293b", borderRadius: 14, overflow: "hidden" } },
        React.createElement("div", { style: { padding: "12px 16px", borderBottom: "1px solid #0f172a", display: "flex", alignItems: "center", gap: 8 } },
          React.createElement("div", { style: { width: 4, height: 20, borderRadius: 2, background: selRoutine.color } }),
          React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "#f1f5f9" } }, selRoutine.name),
          React.createElement("div", { style: { fontSize: 12, color: "#475569", marginLeft: "auto" } }, "Progreso de ", user)
        ),
        routineSummary.map((ex, i) => React.createElement("div", { key: ex.name, style: { padding: "12px 16px", borderBottom: i < routineSummary.length - 1 ? "1px solid #0f172a88" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" } },
          React.createElement("div", { style: { flex: 1, minWidth: 0 } },
            React.createElement("div", { style: { fontSize: 13, fontWeight: 500, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, ex.name),
            React.createElement("div", { style: { fontSize: 11, color: "#475569", marginTop: 2 } }, ex.sessions, " ", ex.sessions === 1 ? "sesión" : "sesiones")
          ),
          React.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center", flexShrink: 0, marginLeft: 12 } },
            ex.last != null && React.createElement(React.Fragment, null,
              React.createElement("div", { style: { textAlign: "right" } },
                React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color } }, ex.last, "kg"),
                React.createElement("div", { style: { fontSize: 10, color: "#475569" } }, "último")
              ),
              ex.delta != null && React.createElement("div", { style: { background: ex.delta > 0 ? "#4ade8018" : ex.delta < 0 ? "#ef444418" : "#1e293b", borderRadius: 8, padding: "4px 8px", minWidth: 44, textAlign: "center" } }, React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: ex.delta > 0 ? "#4ade80" : ex.delta < 0 ? "#f87171" : "#64748b" } }, ex.delta > 0 ? "+" : "", ex.delta, "kg"))
            )
          )
        ))
      ),
      !selRoutineId && React.createElement("div", { style: { background: "#1e293b", borderRadius: 14, padding: "36px 16px", textAlign: "center", color: "#475569" } }, React.createElement("div", { style: { fontSize: 36, marginBottom: 10 } }, "👆"), React.createElement("div", { style: { fontSize: 14 } }, "Selecciona una rutina para ver el resumen"))
    )
  );
}

function WorkoutTab({ workout, routines, sessions, setWorkout, onFinish, onCancel, onInfo }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const routine = routines.find(r => r.id === workout?.routineId);

  if (!workout || !routine) {
    return React.createElement("div", { style: { padding: "60px 16px", textAlign: "center" } },
      React.createElement("div", { style: { fontSize: 48, marginBottom: 16 } }, "🏋️"),
      React.createElement("p", { style: { color: "#94a3b8", fontSize: 16, marginBottom: 8 } }, "No hay entrenamiento activo."),
      React.createElement("p", { style: { color: "#475569", fontSize: 13 } }, "Ve a la pestaña Hoy y selecciona una rutina.")
    );
  }

  const updateLog = (user, exId, val) => setWorkout(prev => ({
    ...prev,
    logs: { ...prev.logs, [user]: prev.logs[user].map(l => l.exId === exId ? { ...l, weight: val } : l) }
  }));

  const adjustWeight = (user, exId, delta) => setWorkout(prev => {
    const log = prev.logs[user].find(l => l.exId === exId);
    const cur = parseFloat(log?.weight) || 0;
    const nv = Math.round(Math.max(0, cur + delta) * 10) / 10;
    return { ...prev, logs: { ...prev.logs, [user]: prev.logs[user].map(l => l.exId === exId ? { ...l, weight: nv } : l) } };
  });

  const setDifficulty = (user, exId, value) => setWorkout(prev => ({
    ...prev,
    logs: { ...prev.logs, [user]: prev.logs[user].map(l => l.exId === exId ? { ...l, difficulty: value } : l) }
  }));

  const toggleDone = exId => setWorkout(prev => {
    const newLogs = { ...prev.logs };
    const isDone = newLogs[USERS[0]].find(l => l.exId === exId)?.done;
    USERS.forEach(u => {
      newLogs[u] = newLogs[u].map(l => l.exId === exId ? { ...l, done: !isDone } : l);
    });
    return { ...prev, logs: newLogs };
  });

  const doneCount = routine.exercises.filter(ex => workout.logs.Yago?.find(l => l.exId === ex.id)?.done).length;
  const anyDone = doneCount > 0;
  const allDone = doneCount === routine.exercises.length;

  return React.createElement(React.Fragment, null,
    showConfirm && React.createElement(ConfirmDialog, { message: "¿Cancelar el entrenamiento? Se perderán los datos no guardados.", onConfirm: () => { setShowConfirm(false); onCancel(); }, onCancel: () => setShowConfirm(false) }),
    React.createElement("div", { style: { padding: "16px 16px 16px" } },
      React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingTop: 8 } },
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
          React.createElement("div", { style: { width: 4, height: 36, borderRadius: 2, background: workout.routineColor, flexShrink: 0 } }),
          React.createElement("div", null,
            React.createElement("div", { style: { fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: 1 } }, "Entrenando ahora"),
            React.createElement("div", { style: { fontSize: 19, fontWeight: 700, color: "#f1f5f9" } }, workout.routineName)
          )
        ),
        React.createElement("button", { onClick: () => setShowConfirm(true), style: { background: "none", border: "1px solid #1e293b", borderRadius: 8, padding: "7px 12px", color: "#475569", fontSize: 12, cursor: "pointer", flexShrink: 0 } }, "✕ Cancelar")
      ),
      React.createElement("div", { style: { background: "#1e293b", borderRadius: 6, height: 5, marginBottom: 8, overflow: "hidden" } },
        React.createElement("div", { style: { background: workout.routineColor, height: "100%", width: `${doneCount / routine.exercises.length * 100}%`, transition: "width 0.4s", borderRadius: 6 } })
      ),
      React.createElement("p", { style: { color: "#475569", fontSize: 12, textAlign: "center", marginBottom: 18 } }, doneCount, "/", routine.exercises.length, " completados"),
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, routine.exercises.map(ex => {
        const yLog = workout.logs.Yago?.find(l => l.exId === ex.id);
        const aLog = workout.logs.Adri?.find(l => l.exId === ex.id);
        const done = yLog?.done;
        const difficultyLabelY = getDifficultyLabel(yLog?.difficulty ?? 3);
        const difficultyLabelA = getDifficultyLabel(aLog?.difficulty ?? 3);

        return React.createElement("div", { key: ex.id, style: { background: "#1e293b", borderRadius: 14, overflow: "hidden", border: `1px solid ${done ? "#4ade8033" : "#1e293b"}`, transition: "border 0.2s" } },
          React.createElement("div", { style: { padding: "11px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #0f172a" } },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 } },
              React.createElement("span", { style: { fontWeight: 700, fontSize: 15, color: done ? "#4ade80" : "#f1f5f9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, done ? "✓ " : "", ex.name),
              ex.alt && React.createElement("span", { style: { fontSize: 10, color: "#334155", background: "#0f172a", borderRadius: 10, padding: "2px 7px", flexShrink: 0, whiteSpace: "nowrap" } }, ex.alt)
            ),
            React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center", flexShrink: 0, marginLeft: 8 } },
              React.createElement("button", { onClick: () => onInfo(ex, "workout"), style: { background: "#0f172a", border: "1px solid #334155", borderRadius: 8, width: 32, height: 32, color: "#475569", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" } }, "ℹ"),
              React.createElement("button", { onClick: () => toggleDone(ex.id), style: { background: done ? "#4ade8018" : "#0f172a", border: `1px solid ${done ? "#4ade8055" : "#334155"}`, borderRadius: 8, padding: "6px 12px", color: done ? "#4ade80" : "#64748b", fontSize: 12, cursor: "pointer", fontWeight: 700, whiteSpace: "nowrap" } }, done ? "Hecho" : "Marcar")
            )
          ),
          React.createElement("div", { style: { padding: "14px 14px", display: "flex", gap: 14 } },
            [
              ["Yago", yLog, UC.Yago, difficultyLabelY],
              ["Adri", aLog, UC.Adri, difficultyLabelA]
            ].map(([user, log, color, difficultyLabel]) => {
              const suggestedWeight = getSuggestedWeight(sessions, user, ex.id, routines);
              const difficulty = log?.difficulty ?? 3;
              return React.createElement("div", { key: user, style: { flex: 1, minWidth: 0 } },
                React.createElement("div", { style: { color, fontSize: 12, fontWeight: 700, marginBottom: 2, letterSpacing: 0.5 } }, user),
                React.createElement("div", { style: { fontSize: 12, color: "#475569", marginBottom: 8 } }, log?.sets, "×", log?.reps, " reps"),
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4 } },
                  React.createElement("button", { onPointerDown: e => { e.preventDefault(); adjustWeight(user, ex.id, -2.5); }, style: { background: "#0f172a", border: "1px solid #334155", borderRadius: 9, width: 40, height: 44, color: "#f1f5f9", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, userSelect: "none" } }, "−"),
                  React.createElement("input", { type: "number", value: log?.weight ?? "", onChange: e => updateLog(user, ex.id, e.target.value), placeholder: "kg", style: { flex: 1, background: "#0f172a", border: `2px solid ${color}44`, borderRadius: 9, color: "#f1f5f9", fontSize: 18, fontWeight: 700, textAlign: "center", padding: "10px 0", outline: "none", minWidth: 0, width: "100%" } }),
                  React.createElement("button", { onPointerDown: e => { e.preventDefault(); adjustWeight(user, ex.id, +2.5); }, style: { background: "#0f172a", border: "1px solid #334155", borderRadius: 9, width: 40, height: 44, color: "#f1f5f9", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, userSelect: "none" } }, "+")
                ),
                React.createElement("div", { style: { textAlign: "center", fontSize: 10, color: "#334155", marginTop: 3 } }, "kg"),
                React.createElement("div", { style: { marginTop: 10, padding: "10px 10px 8px", background: "#0f172a", borderRadius: 10, border: "1px solid #1e293b" } },
                  React.createElement("div", { style: { fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 } }, "Dificultad"),
                  React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } }, [1, 2, 3, 4, 5].map(level => {
                    const active = difficulty === level;
                    return React.createElement("button", { key: level, onClick: () => setDifficulty(user, ex.id, level), style: { flex: 1, minWidth: 46, background: active ? getDifficultyColor(level) : "#1e293b", border: `1px solid ${active ? getDifficultyColor(level) : "#334155"}`, borderRadius: 8, padding: "7px 0", color: active ? "#0f172a" : "#94a3b8", fontSize: 11, fontWeight: 700, cursor: "pointer" } }, level);
                  })),
                  React.createElement("div", { style: { marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, color: "#94a3b8", fontSize: 10 } },
                    React.createElement("span", { style: { color: "#64748b" } }, difficultyLabel),
                    suggestedWeight != null && React.createElement("span", { style: { color: "#f8fafc", fontWeight: 700 } }, `Sug.: ${suggestedWeight} kg`)
                  )
                )
              );
            })
          )
        );
      })),
      React.createElement("button", { onClick: anyDone ? onFinish : undefined, style: { marginTop: 20, width: "100%", background: allDone ? "#4ade80" : anyDone ? "#1e293b" : "#0f172a", border: allDone ? "none" : anyDone ? "1px solid #334155" : "1px dashed #1e293b", borderRadius: 14, padding: "18px", color: allDone ? "#0f172a" : anyDone ? "#94a3b8" : "#334155", fontSize: 16, fontWeight: 700, cursor: anyDone ? "pointer" : "default", transition: "all 0.3s" } }, allDone ? "✓ Guardar entrenamiento" : anyDone ? `Finalizar sesión (${doneCount}/${routine.exercises.length} completados)` : "Marca al menos un ejercicio para finalizar")
    )
  );
}

function App() {
  const [tab, setTab] = useState("home");
  const [routines, setRoutines] = useState(() => load(SK.R, DEFAULT_ROUTINES));
  const [sessions, setSessions] = useState(() => load(SK.S, DEFAULT_SESSIONS));
  const [workout, setWorkout] = useState(null);
  const [infoModal, setInfoModal] = useState({ ex: null, mode: "workout" });

  const updateRoutines = r => {
    setRoutines(r);
    persist(SK.R, r);
  };

  const updateSessions = s => {
    setSessions(s);
    persist(SK.S, s);
  };

  const handleImport = (r, s) => {
    updateRoutines(r);
    updateSessions(s);
  };

  const startWorkout = routine => {
    const logs = {};
    USERS.forEach(user => {
      logs[user] = routine.exercises.map(ex => ({
        exId: ex.id,
        weight: getLastWeight(sessions, user, ex.id, routines) ?? "",
        reps: ex[user].reps,
        sets: ex[user].sets,
        difficulty: 3,
        done: false
      }));
    });
    setWorkout({ routineId: routine.id, routineName: routine.name, routineColor: routine.color, logs });
    setTab("workout");
  };

  const finishWorkout = () => {
    if (!workout) return;
    const session = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      routineId: workout.routineId,
      routineName: workout.routineName,
      logs: workout.logs
    };
    updateSessions([session, ...sessions]);
    setWorkout(null);
    setTab("home");
  };

  const openInfo = (ex, mode) => setInfoModal({ ex, mode });
  const closeInfo = () => setInfoModal({ ex: null, mode: "workout" });

  return React.createElement("div", { style: { background: "#0f172a", color: "#f1f5f9", minHeight: "100dvh", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", position: "relative" } },
    infoModal.ex && React.createElement(InfoModal, { exercise: infoModal.ex, mode: infoModal.mode, onClose: closeInfo }),
    React.createElement("div", { style: { flex: 1, overflowY: "auto", paddingBottom: 80 } },
      tab === "home" && React.createElement(HomeTab, { routines, sessions, onStart: startWorkout }),
      tab === "workout" && React.createElement(WorkoutTab, { workout, routines, sessions, setWorkout, onFinish: finishWorkout, onCancel: () => { setWorkout(null); setTab("home"); }, onInfo: openInfo }),
      tab === "routines" && React.createElement(RoutineEditor, { routines, updateRoutines, onInfo: openInfo }),
      tab === "progress" && React.createElement(ProgressTab, { sessions, routines })
    ),
    React.createElement(BottomNav, { tab, setTab, hasWorkout: !!workout })
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));
