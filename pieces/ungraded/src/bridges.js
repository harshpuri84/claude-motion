// =====================================================================
//  CAMERAS AND (NO) BRIDGES: ungraded. Every era boundary is a hard cut on the grid (BRIDGES = []).
// =====================================================================
const ERA_BG = ERA_LIST.map(() => '#f4ecd9');
const CAMS = {
  wide: null,
  close: { z: 1.5, p: [680, 420], to: [540, 560] },   // the hero and the top of its bar
};
function pieceCam(era, t) { const c = CAMS[SHOT_LIST[era][2]]; return c ? camOf(c) : null; }
const BRIDGES = [];
