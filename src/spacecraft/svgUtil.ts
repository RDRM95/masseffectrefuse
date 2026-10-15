/** Helpers for authoring 2.5D spacecraft in SVG. */

export type Pt = [number, number];

export const pts = (p: Pt[]): string => p.map(([x, y]) => `${x},${y}`).join(' ');

export const path = (p: Pt[], close = true): string =>
  p.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' ') + (close ? ' Z' : '');

/** Quadratic bezier point. */
const qb = (p0: Pt, c: Pt, p1: Pt, t: number): Pt => {
  const u = 1 - t;
  return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]];
};

const qbTangent = (p0: Pt, c: Pt, p1: Pt, t: number): Pt => {
  const u = 1 - t;
  return [2 * u * (c[0] - p0[0]) + 2 * t * (p1[0] - c[0]), 2 * u * (c[1] - p0[1]) + 2 * t * (p1[1] - c[1])];
};

/**
 * A tapered limb along a quadratic bezier: width w0 at the start, w1 at the end.
 * Returns a closed polygon path. Used for Reaper legs and swept fins.
 */
export const taperedCurve = (p0: Pt, c: Pt, p1: Pt, w0: number, w1: number, segments = 14): string => {
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const [x, y] = qb(p0, c, p1, t);
    const [tx, ty] = qbTangent(p0, c, p1, t);
    const l = Math.hypot(tx, ty) || 1;
    const nx = -ty / l;
    const ny = tx / l;
    // ease the taper so the limb is thick near the body and thins toward the tip
    const w = (w0 + (w1 - w0) * Math.pow(t, 0.8)) / 2;
    left.push([x + nx * w, y + ny * w]);
    right.push([x - nx * w, y - ny * w]);
  }
  return path([...left, ...right.reverse()]);
};

/** Points along a bezier for placing joint lines / lights. */
export const alongCurve = (p0: Pt, c: Pt, p1: Pt, count: number): Pt[] => {
  const out: Pt[] = [];
  for (let i = 1; i <= count; i++) out.push(qb(p0, c, p1, i / (count + 1)));
  return out;
};

export const mirrorY = (p: Pt[]): Pt[] => p.map(([x, y]) => [x, -y]);

export const mirrorX = (p: Pt[]): Pt[] => p.map(([x, y]) => [-x, y]);
