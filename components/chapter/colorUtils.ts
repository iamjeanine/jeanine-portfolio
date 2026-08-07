// Bridge endpoints must derive from spread palette data, not hand-copied
// hex (REDESIGN-PLAN.md 3.5), so the two never silently desync.

/** Every hex color literal in a CSS value, in the order it appears. */
export function gradientStops(field: string): string[] {
  return field.match(/#[0-9a-fA-F]{3,8}/g) ?? [];
}

/** The color a spread's field opens on (its first gradient stop). */
export function gradientStart(field: string): string {
  return gradientStops(field)[0] ?? field;
}

/** The color a spread's field closes on (its last gradient stop). */
export function gradientEnd(field: string): string {
  const stops = gradientStops(field);
  return stops[stops.length - 1] ?? field;
}
