const MAX_SIDE = 1000;
const QUALITY = 0.72;

/** Read an image file, downscale it and return a compressed data URL (keeps localStorage small). */
export async function fileToDataUrl(file: File): Promise<string> {
  const dataUrl = await readAsDataUrl(file);
  try {
    const img = await decode(dataUrl);
    const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
    if (scale >= 1 && dataUrl.length < 400_000) return dataUrl;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', QUALITY);
  } catch {
    return dataUrl;
  }
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(fr.error);
    fr.readAsDataURL(file);
  });
}

function decode(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('decode failed'));
    img.src = src;
  });
}
