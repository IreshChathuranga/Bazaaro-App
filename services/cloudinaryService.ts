export const uploadImageToCloudinary = async (imageUri: string) => {
  const data = new FormData()

  const response = await fetch(imageUri)
  const blob = await response.blob()

  data.append("file", blob)
  data.append("upload_preset", "bazaaro")

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dkf2yc9vt/image/upload",
      {
        method: "POST",
        body: data,
      }
    )

    const result = await res.json()

    if (!res.ok) {
      console.log("Cloudinary Error:", result)
      throw new Error(result.error?.message || "Upload failed")
    }

    return result.secure_url
  } catch (error) {
    console.log("Cloudinary Upload Error:", error)
    throw error
  }
}
