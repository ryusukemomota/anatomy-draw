// Level 1 / Level 2 共通: 得点計算・自己ベスト保存・シェア
// ※ 各ページのスクリプトと同じグローバル空間を使うため、名前の重複に注意。

// 得点 = 正確さ(0〜100) × ガイド倍率 × 難易度倍率（最大 400 点）
const GUIDE_MULT = { full: 1.0, faint: 1.5, off: 2.0 };
const GUIDE_NAME = { full: "ガイド濃い", faint: "ガイド薄い", off: "ガイドなし" };
const DIFF_MULT = { 1: 1.0, 2: 1.5, 3: 2.0 };
const IS_PREVIEW = new URLSearchParams(location.search).has("preview");
const BEST_KEY = "anatodraw-best";

function stars(d) {
  const n = Math.max(1, Math.min(3, Number(d) || 1));
  return "★".repeat(n) + "☆".repeat(3 - n);
}

function computePoints(accuracy, guideKey, difficulty) {
  const acc = Math.max(0, Math.min(1, accuracy));
  const g = GUIDE_MULT[guideKey] ?? 1;
  const d = DIFF_MULT[Math.max(1, Math.min(3, Number(difficulty) || 1))];
  return Math.round(acc * 100 * g * d);
}

// ---- 自己ベスト（この端末のみ。localStorage） ----
function readBest() {
  try { return JSON.parse(localStorage.getItem(BEST_KEY)) || {}; }
  catch { return {}; }
}
function getBest(id) { return readBest()[id] || 0; }
function saveBest(id, points) {
  const all = readBest();
  const prev = all[id] || 0;
  const isNew = points > prev;
  if (isNew) {
    all[id] = points;
    try { localStorage.setItem(BEST_KEY, JSON.stringify(all)); } catch { /* 保存できなくても続行 */ }
  }
  return { best: Math.max(prev, points), isNew };
}

// ---- 結果表示（#score と #btn-share を使う） ----
let lastResult = null;

function showScoreResult(problem, accuracy, guideKey, extraHtml = "") {
  const diff = problem.difficulty || 1;
  const points = computePoints(accuracy, guideKey, diff);
  let bestLine;
  if (IS_PREVIEW) {
    bestLine = "プレビューは記録されません";
  } else {
    const r = saveBest(problem.id, points);
    bestLine = r.isNew ? "自己ベスト更新！" : `最高 ${r.best}点`;
  }
  document.getElementById("score").innerHTML =
    `得点 <strong>${points}</strong>点<br>` +
    `正確さ ${Math.round(Math.max(0, Math.min(1, accuracy)) * 100)}%・${stars(diff)}・${GUIDE_NAME[guideKey]}<br>` +
    extraHtml + bestLine;
  lastResult = { title: problem.title, difficulty: diff, guideKey, points };
  const b = document.getElementById("btn-share");
  if (b) b.style.display = "";
  return points;
}

// 結果を消し、最高点だけ（あれば）表示する
function clearScore(problem) {
  lastResult = null;
  const el = document.getElementById("score");
  const best = !IS_PREVIEW && problem ? getBest(problem.id) : 0;
  el.innerHTML = best ? `<span style="font-size:12px">最高 ${best}点</span>` : "";
  const b = document.getElementById("btn-share");
  if (b) b.style.display = "none";
}

// ---- シェア ----
function openShareOnX(text, url) {
  window.open(
    "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(url),
    "_blank", "noopener"
  );
}
function shareResult() {
  if (!lastResult) return;
  const r = lastResult;
  const text =
    `AnatoDrawで『${r.title}』（${stars(r.difficulty)}・${GUIDE_NAME[r.guideKey]}）に挑戦して ${r.points}点！ #AnatoDraw #解剖学`;
  const url = new URL("index.html", location.href).href;
  if (navigator.share) {
    // スマホ: 端末の共有画面（X・LINE・Instagram など）
    navigator.share({ text, url }).catch((e) => { if (e.name !== "AbortError") openShareOnX(text, url); });
  } else {
    openShareOnX(text, url);
  }
}
document.getElementById("btn-share")?.addEventListener("click", shareResult);
