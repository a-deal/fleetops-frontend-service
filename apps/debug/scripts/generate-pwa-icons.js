/**
 * PWA Icon Generator Script
 * 
 * This script creates placeholder PNG icons for PWA from an SVG source.
 * In production, these should be replaced with professionally designed icons.
 * 
 * USER CONTEXT:
 * - Icons appear on device home screens when app is installed
 * - Must be clear and recognizable at small sizes
 * - Should match industrial/fleet management theme
 * 
 * TECHNICAL CONTEXT:
 * - Uses sharp library for image processing
 * - Generates all required sizes for various devices
 * - Creates both regular and maskable versions
 * 
 * TO RUN:
 * node scripts/generate-pwa-icons.js
 */

const fs = require('fs').promises;
const path = require('path');

// Icon sizes required for PWA manifest
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Simple placeholder icon generator
async function generateIcons() {
  console.log('Generating PWA icons...');
  
  const iconDir = path.join(__dirname, '../public/icons');
  
  // Create placeholder icons (in production, use proper image generation)
  for (const size of sizes) {
    const svg = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.1875}" fill="#09090B"/>
  <text x="${size/2}" y="${size/2}" font-family="Arial" font-size="${size * 0.3}" font-weight="bold" text-anchor="middle" fill="#F59E0B" dy=".3em">FO</text>
</svg>`;
    
    await fs.writeFile(
      path.join(iconDir, `icon-${size}x${size}.svg`),
      svg
    );
    
    console.log(`Created icon-${size}x${size}.svg`);
  }
  
  // Create placeholder shortcuts icons
  const shortcutSvgs = {
    'check': `
<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="96" height="96" rx="18" fill="#09090B"/>
  <path d="M30 48 L42 60 L66 36" stroke="#F59E0B" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    'alert': `
<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="96" height="96" rx="18" fill="#09090B"/>
  <path d="M48 32 L48 52 M48 64 L48 64" stroke="#F59E0B" stroke-width="6" stroke-linecap="round"/>
</svg>`
  };
  
  for (const [name, svg] of Object.entries(shortcutSvgs)) {
    await fs.writeFile(
      path.join(iconDir, `${name}-96x96.svg`),
      svg
    );
    console.log(`Created ${name}-96x96.svg`);
  }
  
  console.log('Icon generation complete!');
  console.log('Note: These are placeholder SVGs. For production, convert to PNG with proper tools.');
}

generateIcons().catch(console.error);