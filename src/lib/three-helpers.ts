import * as THREE from 'three';
import type { Vec3, Vec4, RGBA } from '../types/map';

export function quatToEulerDeg(q: Vec4): Vec3 {
  const euler = new THREE.Euler().setFromQuaternion(
    new THREE.Quaternion(q[0], q[1], q[2], q[3])
  );
  return [
    THREE.MathUtils.radToDeg(euler.x),
    THREE.MathUtils.radToDeg(euler.y),
    THREE.MathUtils.radToDeg(euler.z),
  ];
}

export function eulerDegToQuat(deg: Vec3): Vec4 {
  const q = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(
      THREE.MathUtils.degToRad(deg[0]),
      THREE.MathUtils.degToRad(deg[1]),
      THREE.MathUtils.degToRad(deg[2])
    )
  );
  return [q.x, q.y, q.z, q.w];
}

export function rgbaToHex(rgba: RGBA): string {
  const r = Math.round(rgba[0] * 255).toString(16).padStart(2, '0');
  const g = Math.round(rgba[1] * 255).toString(16).padStart(2, '0');
  const b = Math.round(rgba[2] * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

export function hexToRgba(hex: string, alpha = 1): RGBA {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b, alpha];
}

export function vec3ToColor(v: Vec3): string {
  return rgbaToHex([v[0], v[1], v[2], 1]);
}

export function hexToVec3(hex: string): Vec3 {
  const rgba = hexToRgba(hex);
  return [rgba[0], rgba[1], rgba[2]];
}
