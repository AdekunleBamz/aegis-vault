import sharp from 'sharp';

async function generateLogo() {
  // Create a beautiful logo with shield and vault elements
  const svg = `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <!-- Background gradient -->
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0f3460;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e94560;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="vaultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f1c40f;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="512" height="512" fill="url(#bgGradient)" rx="64" />
      
      <!-- Main shield shape -->
      <path d="M256 64 L416 128 L384 384 L256 448 L128 384 L96 128 Z" 
            fill="url(#shieldGradient)" 
            stroke="#ffffff" 
            stroke-width="8" 
            opacity="0.9" />
      
      <!-- Inner vault symbol -->
      <g transform="translate(256, 256)">
        <!-- Vault door -->
        <circle r="80" fill="url(#vaultGradient)" stroke="#2c3e50" stroke-width="6" />
        
        <!-- Vault lock mechanism -->
        <circle r="20" fill="#2c3e50" />
        <circle r="40" fill="none" stroke="#ffffff" stroke-width="3" />
        <circle r="60" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.5" />
        
        <!-- Decorative elements -->
        <path d="M-60 0 L60 0" stroke="#2c3e50" stroke-width="4" />
        <path d="M0 -60 L0 60" stroke="#2c3e50" stroke-width="4" />
        
        <!-- Aegis symbol -->
        <path d="M-25 -25 L25 25 M25 -25 L-25 25" stroke="#2c3e50" stroke-width="6" stroke-linecap="round" />
      </g>
      
      <!-- Outer ring -->
      <circle cx="256" cy="256" r="220" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.3" />
      
      <!-- Bottom text -->
      <text x="256" y="460" font-family="Arial, sans-serif" font-size="32" font-weight="bold" 
            text-anchor="middle" fill="#ffffff" opacity="0.8">AEGIS VAULT</text>
    </svg>
  `;

  // Generate logo
  await sharp(Buffer.from(svg))
    .png()
    .toFile('public/images/logo.png');

  // Generate favicon (16x16, 32x32, 48x48, 64x64)
  const faviconSizes = [16, 32, 48, 64];
  
  for (const size of faviconSizes) {
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(`public/images/favicon-${size}x${size}.png`);
  }

  console.log('Logo and favicon generated successfully!');
}

generateLogo().catch(console.error);