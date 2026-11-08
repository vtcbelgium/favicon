// TypeScript code for src/tool.ts

export interface ToolResult {
  success: boolean;
  data: string; // The formatted, final output string ready for display
  error?: string;
  warnings?: string[];
}

const ICON_SIZES = [16, 32, 48, 180, 192, 512];

function buildManifest(name: string, shortName: string, mime: string, src: string): object {
  return {
    name,
    short_name: shortName,
    icons: ICON_SIZES.map(size => ({
      src,
      sizes: `${size}x${size}`,
      type: mime,
      purpose: "any"
    })),
    start_url: "/",
    display: "standalone",
    version: "1.0"
  };
}

function buildHtmlLinks(src: string): string {
  return ICON_SIZES.map(size => {
    const sizeStr = `${size}x${size}`;
    return `<link rel="icon" href="${src}" sizes="${sizeStr}">`;
  }).join('\n');
}

function base64EncodeUnicode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function processInput(input: string): ToolResult {
  // Detect if input is a data URL with base64.
  if (input.startsWith('data:')) {
    const mimeMatch = input.match(/^data:image\/(\w+);base64,(.+)$/);
    if (mimeMatch) {
      const mime = mimeMatch[1];
      const base64 = mimeMatch[2];
      try {
        // Validate base64 by decoding
        atob(base64);
        const manifest = buildManifest("Generated Favicon", "favicon", `image/${mime}`, input);
        const htmlLinks = buildHtmlLinks(input);
        return {
          success: true,
          data: JSON.stringify({
            iconSpecs: ICON_SIZES,
            webmanifest: manifest,
            htmlLinks: htmlLinks
          }, null, 2)
        };
      } catch (e) {
        return {
          success: false,
          data: '',
          error: "Invalid data URL"
        };
      }
    }
  }
  // Detect emoji: simple check if contains any Unicode emoji range
  if (/[\u{1F600}-\u{1F64F}]/u.test(input)) {
    // Use a simple SVG with the emoji as text (placeholder SVG)
    const emojiSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="48">${input}</text></svg>`;
    const emojiBase64 = base64EncodeUnicode(emojiSvg);
    const emojiDataUrl = `data:image/svg+xml;base64,${emojiBase64}`;
    const manifest = buildManifest("Emoji Icon", "emoji", "image/svg+xml", emojiDataUrl);
    const htmlLinks = buildHtmlLinks(emojiDataUrl);
    return {
      success: true,
      data: JSON.stringify({
        iconSpecs: ICON_SIZES,
        webmanifest: manifest,
        htmlLinks: htmlLinks
      }, null, 2)
    };
  }
  // Default: unsupported input
  return {
    success: false,
    data: '',
    error: "Unsupported input"
  };
}

