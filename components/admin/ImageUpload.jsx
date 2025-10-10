"use client";
import { useState } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import Image from "next/image";

export default function ImageUpload({ onImageUpload, initialImages }) {
  const [images, setImages] = useState(initialImages || []);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = files.map((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "soundaryas"); // ✅ Replace this with your actual preset name

        return fetch(
          `https://api.cloudinary.com/v1_1/dz2x5ge2n/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        )
          .then((res) => res.json())
          .then((data) => ({
            url: data.secure_url,
            alt: file.name,
          }));
      });

      const newImages = await Promise.all(uploadPromises);
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onImageUpload(updatedImages);
    } catch (err) {
      console.error("Error uploading images:", err);
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
    onImageUpload(updatedImages);
  };

  return (
    <div className="border p-4 rounded-lg">
      <h3 className="font-semibold mb-2">Product Images</h3>
      <div className="flex flex-wrap gap-4 mb-4">
        {images.map((img, index) => {
          if (!img.url) return null;
          return (
            <div key={index} className="relative w-24 h-24 rounded overflow-hidden">
              <Image
                src={img.url}
                alt={img.alt || "Product image"}
                layout="fill"
                objectFit="cover"
                className="rounded"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
              >
                <FaTrash size={10} />
              </button>
            </div>
          );
        })}
        <label className="w-24 h-24 flex items-center justify-center border border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          <FaPlus className="text-gray-400" />
        </label>
      </div>
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
    </div>
  );
}