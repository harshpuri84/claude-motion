// =====================================================================
//  ERAS, CAMERAS, BRIDGES — 8 shape morphs and one hard cut (31s, the touchdown)
// =====================================================================
const ERA_BG = ['#283888', '#3995cb', '#283888', '#151a48', '#3995cb', '#2b58b9', '#151a48', '#5b5fae', '#5b5fae', '#283888'];
function pieceCam(era, t) {
  if (era === 5) return push(t, 23.4, 27.4, { z: 1.12, p: [600, 900], to: [540, 820] }, 27.4, 27.8);   // drift toward the sun before it becomes the origin glow
  if (era === 9) return push(t, 40.6, 44.4, { z: 1.1, p: [470, 1010], to: [540, 900] });             // settle on the carton
  return null;
}
const slipPts = () => xform(bpRect(0, 0, 300, 210), 640, 560, 0.05);
const truckBox = (t) => { const tx = 300 + (t - 4) * 70, ty = 1150; return bpRect(tx - 247, ty - 218.5, 355, 190); };
const uldPts = (x, y, s) => resample([[x - s * 0.5, y], [x + s * 0.28, y], [x + s * 0.5, y - s * 0.32], [x + s * 0.5, y - s * 0.84], [x - s * 0.5, y - s * 0.84]], true, 14);
const vanPts = (vx, vy = 1180) => resample([[vx - 220, vy - 40], [vx - 220, vy - 250], [vx + 120, vy - 250], [vx + 220, vy - 150], [vx + 220, vy - 40]], true, 14);
const BRIDGES = [
  { tc: 4,  A: () => ({ P: slipPts(), c: '#f6f1e2' }), B: () => ({ P: truckBox(4), c: '#f2ecdc' }) },                                       // the booking slip -> the truck box
  { tc: 9,  A: () => ({ P: truckBox(9), c: '#f2ecdc' }), B: () => ({ P: uldPts(540, 1210, 620), c: '#c8cce0' }) },                          // the truck box -> the ULD
  { tc: 14, A: () => ({ P: uldPts(540, 1210, 620), c: '#c8cce0' }), B: () => ({ P: uldPts(560, 1000, 260), c: '#c8cce0' }) },              // the ULD -> the ULD on the loader
  { tc: 18, A: () => ({ P: uldPts(560, 690, 260), c: '#c8cce0' }), B: () => ({ P: ellipsePts(160, 1090, 280, 170, 0, 64), c: '#ece6d3' }) }, // the ULD -> a cloud
  { tc: 23, A: () => ({ P: ellipsePts(980, 930, 250, 150, 0, 64), c: '#ece6d3' }), B: () => ({ P: ellipsePts(600, 1230, 300, 140, 0, 64), c: '#f3d9c4' }) }, // cloud -> the cloud sea
  { tc: 28, A: () => ({ P: ellipsePts(600, 975, 200, 200, 0, 64), c: '#f2c84b' }), B: () => ({ P: ellipsePts(190, 1010, 200, 200, 0, 64), c: '#ef8f3c' }) }, // the sun -> the origin glow
  { tc: 33, A: () => ({ P: ellipsePts(605, 931, 200, 200, 0, 64), c: '#1b2358' }), B: () => ({ P: vanPts(260), c: '#f6f1e2' }) },          // the x-ray window -> the van
  { tc: 39, A: () => ({ P: vanPts(680), c: '#f6f1e2' }), B: () => ({ P: bpRect(570, 720, 200, 200), c: '#ffd98a' }) },                       // the van -> the lit front door
];
