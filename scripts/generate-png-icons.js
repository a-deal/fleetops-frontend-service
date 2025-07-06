#!/usr/bin/env node

/**
 * Generate PNG icons from SVG files for PWA manifest
 * ALL browsers require PNG icons - this is not Chrome-specific
 */

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

async function generatePngIcons() {
  // Universal requirements across all browsers
  const iconSizes = [
    192,  // Minimum for Chrome/Firefox/Edge install
    512,  // Recommended for splash screens and stores
    180,  // Apple touch icon for iOS
    152,  // iPad icon
  ];
  
  const inputSvg = path.join(__dirname, '../public/icons/icon.svg');
  const outputDir = path.join(__dirname, '../public/icons');

  console.log('🎨 Generating PNG icons for all browsers...');

  try {
    const svgBuffer = await fs.readFile(inputSvg);

    for (const size of iconSizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated ${size}x${size} PNG icon`);
    }

    // Special case: Apple touch icon with standard name
    await fs.copyFile(
      path.join(outputDir, 'icon-180x180.png'),
      path.join(outputDir, 'apple-touch-icon.png')
    );
    
    console.log('✅ Created apple-touch-icon.png');
    console.log('🎉 All PNG icons generated successfully!');
    console.log('\n📱 Browser coverage:');
    console.log('  - Chrome/Edge/Samsung: 192x192, 512x512');
    console.log('  - Firefox: 192x192');
    console.log('  - Safari iOS: 180x180 (apple-touch-icon)');
    console.log('  - Safari macOS: 512x512');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generatePngIcons();