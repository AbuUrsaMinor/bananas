import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Get the directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const svgPath = path.join(__dirname, '..', 'public', 'bananas-icon.svg');
const outputDir = path.join(__dirname, '..', 'public', 'icons');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`✓ Created output directory: ${outputDir}`);
}

// Define icon sizes
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Function to generate PNG from SVG
async function generateIcons() {
  console.log('🍌 Starting icon generation');
  console.log(`📄 Reading SVG from: ${svgPath}`);
  
  try {
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Generate icons for each size
    const promises = sizes.map(async (size) => {
      const filename = `bananas-icon-${size}x${size}.png`;
      const outputPath = path.join(outputDir, filename);
      
      console.log(`🔄 Generating ${size}x${size} icon...`);
      
      try {
        await sharp(svgBuffer)
          .resize(size, size)
          .png()
          .toFile(outputPath);
        
        console.log(`✓ Created: ${filename}`);
        return { size, success: true };
      } catch (err) {
        console.error(`❌ Error creating ${filename}:`, err.message);
        return { size, success: false };
      }
    });
    
    const results = await Promise.all(promises);
    const successful = results.filter(r => r.success).length;
    
    console.log('\n📊 Summary:');
    console.log(`✓ Successfully generated ${successful} of ${sizes.length} icons`);
    console.log(`📁 Icons saved to: ${outputDir}`);
    
    if (successful === sizes.length) {
      console.log('✅ All icons generated successfully');
    } else {
      console.log(`⚠️ Warning: ${sizes.length - successful} icons failed to generate`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`❌ Error reading SVG file: ${err.message}`);
    process.exit(1);
  }
}

// Run the function
generateIcons();