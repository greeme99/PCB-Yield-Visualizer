import type { UnitMode } from './types';

const MM_PER_INCH = 25.4;

export function toDisplayLength(valueMm: number, unit: UnitMode) {
  return unit === 'inch' ? valueMm / MM_PER_INCH : valueMm;
}

export function fromDisplayLength(value: number, unit: UnitMode) {
  return unit === 'inch' ? value * MM_PER_INCH : value;
}

export function formatLength(valueMm: number, unit: UnitMode, options: { compact?: boolean } = {}) {
  const value = toDisplayLength(valueMm, unit);
  if (unit === 'inch') {
    const formatted = value.toLocaleString(undefined, {
      minimumFractionDigits: options.compact ? 0 : 2,
      maximumFractionDigits: options.compact ? 2 : 3
    });
    return `${formatted} in`;
  }
  return `${Math.round(value).toLocaleString()} mm`;
}

export function inputStep(unit: UnitMode) {
  return unit === 'inch' ? 0.01 : 1;
}

export function displayPrecision(unit: UnitMode) {
  return unit === 'inch' ? 3 : 0;
}
