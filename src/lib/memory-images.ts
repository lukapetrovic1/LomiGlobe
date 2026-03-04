import { supabase } from "@/integrations/supabase/client";

export const DEFAULT_MEMORY_IMAGE = "/placeholder.svg";
export const MEMORY_IMAGES_BUCKET =
  import.meta.env.VITE_SUPABASE_MEMORY_IMAGES_BUCKET || "memory-images";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

export const validateMemoryImage = (file: File) => {
  if (!file.type.startsWith("image/")) {
    return "Please choose an image file.";
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "Images must be 10 MB or smaller.";
  }

  return null;
};

const getFileExtension = (file: File) => {
  const fileNameExtension = file.name.split(".").pop()?.toLowerCase();
  if (fileNameExtension) {
    return fileNameExtension.replace(/[^a-z0-9]/g, "") || "jpg";
  }

  const mimeExtension = file.type.split("/")[1]?.toLowerCase();
  return mimeExtension?.replace(/[^a-z0-9]/g, "") || "jpg";
};

export const uploadMemoryImage = async (file: File) => {
  const validationError = validateMemoryImage(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const filePath = `memories/${Date.now()}-${crypto.randomUUID()}.${getFileExtension(file)}`;
  const { error: uploadError } = await supabase.storage
    .from(MEMORY_IMAGES_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(MEMORY_IMAGES_BUCKET).getPublicUrl(filePath);

  if (!publicUrl) {
    throw new Error("Supabase did not return a public URL for the uploaded image.");
  }

  return publicUrl;
};

const getManagedMemoryImagePath = (imageUrl: string) => {
  if (!SUPABASE_URL) {
    return null;
  }

  const publicPrefix = `${SUPABASE_URL}/storage/v1/object/public/${MEMORY_IMAGES_BUCKET}/`;
  if (!imageUrl.startsWith(publicPrefix)) {
    return null;
  }

  const encodedPath = imageUrl.slice(publicPrefix.length).split("?")[0];
  return encodedPath ? decodeURIComponent(encodedPath) : null;
};

export const deleteMemoryImage = async (imageUrl: string) => {
  const imagePath = getManagedMemoryImagePath(imageUrl);
  if (!imagePath) {
    return;
  }

  const { error } = await supabase.storage.from(MEMORY_IMAGES_BUCKET).remove([imagePath]);
  if (error) {
    throw new Error(error.message);
  }
};
