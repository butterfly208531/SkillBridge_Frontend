/**
 * Upload an image file directly to Cloudinary (unsigned upload).
 *
 * Setup (one-time):
 * 1. Create a free account at https://cloudinary.com
 * 2. In your Cloudinary dashboard go to Settings → Upload → Upload presets
 * 3. Click "Add upload preset", set Signing Mode to "Unsigned", and save.
 * 4. Copy your Cloud Name and the Preset Name into your .env.local:
 *      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *      NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_name
 */

export interface UploadResult {
  url: string;       // secure HTTPS URL
  publicId: string;  // Cloudinary public_id (useful for deletions)
}

/**
 * Uploads a File object to Cloudinary and returns the hosted URL.
 * Throws an Error with a human-readable message on failure.
 */
export async function uploadImage(
  file: File,
  folder = "courses",
  onProgress?: (percent: number) => void,
): Promise<UploadResult> {
  // Read at call-time so Vercel env vars are always picked up after a redeploy
  const CLOUD_NAME    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and " +
      "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to your .env.local file.",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  // Use XMLHttpRequest so we can report upload progress
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({ url: data.secure_url, publicId: data.public_id });
        } catch {
          reject(new Error("Unexpected response from Cloudinary."));
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err.error?.message || `Upload failed (${xhr.status})`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error during upload.")));
    xhr.addEventListener("abort", () => reject(new Error("Upload was cancelled.")));

    xhr.open("POST", url);
    xhr.send(formData);
  });
}
