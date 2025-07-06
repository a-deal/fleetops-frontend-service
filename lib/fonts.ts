import { cn } from '@/lib/utils';
import { gtAmerica, gtPressura, gtPressuraMono } from '@/styles/fonts';

// Font class mapping
const fontMap = {
  sans: gtPressura,
  heading: gtAmerica,
  mono: gtPressuraMono,
  body: gtPressura, // alias for sans
} as const;

// Type-safe font utility function
export function font(name: keyof typeof fontMap) {
  return fontMap[name].className;
}

// Utility for combining font with other classes
export function fontClass(name: keyof typeof fontMap, ...classes: string[]) {
  return cn(fontMap[name].className, ...classes);
}

// Export direct access to font objects if needed
export const fonts = {
  gtAmerica,
  gtPressura,
  gtPressuraMono,
} as const;