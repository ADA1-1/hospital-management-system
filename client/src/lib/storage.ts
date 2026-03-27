/**
 * Client-side storage helper for uploading files to S3 via the backend API.
 * This helper makes a request to the backend to upload files securely.
 */

export async function storagePut(
  key: string,
  data: Uint8Array | ArrayBuffer | string,
  contentType: string = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  try {
    // Convert data to base64 for transmission
    let base64Data: string;
    if (typeof data === "string") {
      base64Data = btoa(data);
    } else if (data instanceof ArrayBuffer) {
      const uint8Array = new Uint8Array(data);
      base64Data = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
    } else {
      base64Data = btoa(String.fromCharCode.apply(null, Array.from(data)));
    }

    // Call backend API to upload file
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
        data: base64Data,
        contentType,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Upload failed");
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Failed to upload file");
  }
}

export async function uploadFile(
  file: File,
  keyPrefix: string
): Promise<string> {
  try {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        const data = e.target?.result as string;
        const base64Data = data.split(',')[1];
        const key = `${keyPrefix}-${Date.now()}.${file.name.split('.').pop()}`;
        
        try {
          const result = await storagePut(key, base64Data, file.type);
          resolve(result.url);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to upload file');
  }
}

export async function storageGet(
  key: string,
  expiresIn?: number
): Promise<{ key: string; url: string }> {
  try {
    const response = await fetch("/api/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
        expiresIn,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Download failed");
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Failed to get file URL");
  }
}
