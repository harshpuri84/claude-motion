// =====================================================================
//  ERAS, CAMERAS, BRIDGES — projects-two. Hard cuts only (BRIDGES = []).
// =====================================================================
const ERA_BG = ['#ede5cc', '#ede5cc', '#0e142d', '#0e142d', '#ede5cc', '#ede5cc', '#ede5cc', '#0e142d', '#ede5cc', '#0e142d', '#ede5cc', '#ede5cc'];
// a slow push-in across every beat, towards where the action is
const FOCUS = Array.from({ length: 12 }, () => [960, 560]);
function pieceCam(era, t) { const [a, b] = ERA_LIST[era]; return push(t, a, b, { z: 1.08, p: FOCUS[era], to: FOCUS[era] }); }
const BRIDGES = [];
