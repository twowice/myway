'use client';

const MAX_IMAGE_SIZE_BYTES = 1024 * 1024;
const MAX_DIMENSION = 512;
const QUALITY_STEPS = [0.8, 0.7, 0.6];

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (error) => {
      URL.revokeObjectURL(url);
      reject(error);
    };
    img.src = url;
  });

export const compressProfileImage = async (file: File) => {
  if (file.type === 'image/gif') {
    return file;
  }

  const image = await loadImage(file);
  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(image.width, image.height)
  );
  const targetWidth = Math.max(1, Math.round(image.width * scale));
  const targetHeight = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return file;
  }

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

  for (const quality of QUALITY_STEPS) {
    // eslint-disable-next-line no-await-in-loop
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    );
    if (!blob) continue;
    if (blob.size <= MAX_IMAGE_SIZE_BYTES) {
      return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), {
        type: 'image/jpeg',
      });
    }
  }

  const fallbackBlob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', QUALITY_STEPS[QUALITY_STEPS.length - 1])
  );

  if (!fallbackBlob) {
    return file;
  }

  return new File([fallbackBlob], file.name.replace(/\.\w+$/, '.jpg'), {
    type: 'image/jpeg',
  });
};

export const uploadProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/user/profile-image', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  return {
    status: response.status,
    imageUrl: data?.imageUrl as string | undefined,
    message: data?.message as string | undefined,
  };
};
