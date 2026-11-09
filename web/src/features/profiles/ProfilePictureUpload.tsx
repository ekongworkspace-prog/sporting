"use client";

import React, { useRef, useState } from "react";
import { Button, Spinner } from "@heroui/react";

export interface UploadedImage {
  url: string;
  publicId: string;
}

// 1. Clean Single-File Cloudinary Utility
export async function uploadSingleImageToCloudinary(
  file: File
): Promise<UploadedImage> {
  const signatureResponse = await fetch("/api/profiles/upload-signature", {
    method: "POST",
    credentials: "include",
  });

  if (!signatureResponse.ok) {
    throw new Error("Unable to prepare image upload");
  }

  const signature = await signatureResponse.json();

  const uploadData = new FormData();
  uploadData.append("file", file);
  uploadData.append("api_key", signature.apiKey);
  uploadData.append("timestamp", String(signature.timestamp));
  uploadData.append("folder", signature.folder);
  uploadData.append("signature", signature.signature);
  const endpoint = [
    "https://",
    "api.cloudinary.com",
    "/v1_1/",
    signature.cloudName,
    "/image/upload",
  ].join("");

  const res = await fetch(
    endpoint,
    {
      method: "POST",
      body: uploadData,
    }
  );

  if (!res.ok) {
    throw new Error("Unable to upload image");
  }

  const uploaded = await res.json();
  return { url: uploaded.secure_url, publicId: uploaded.public_id };
}

// 2. Native Ref + HeroUI v3 Button Component
interface ProfilePictureUploadProps {
  onUploadSuccess: (image: UploadedImage) => void;
  label?: string;
}

export function ProfilePictureUpload({
  onUploadSuccess,
  label = "Upload Profile Picture",
}: ProfilePictureUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so selecting the exact same file again still triggers onChange
    e.target.value = "";

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const uploadedImage = await uploadSingleImageToCloudinary(file);
      onUploadSuccess(uploadedImage);
    } catch (err: any) {
      setError(err.message || "An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      {/* Hidden native input for mobile OS camera/gallery access */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        // color="success"
        // variant="flat"
        isDisabled={isUploading}
        onPress={() => fileInputRef.current?.click()}
        className="font-medium"
      >
        {isUploading ? (
          <>
            <Spinner size="sm" color="success" />
            <span>Uploading...</span>
          </>
        ) : (
          label
        )}
      </Button>

      {error && (
        <p className="text-xs font-medium text-danger">{error}</p>
      )}
    </div>
  );
}
