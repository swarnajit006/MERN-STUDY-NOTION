const cloudinary = require("cloudinary").v2

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  const options = { folder }
  if (height) {
    options.height = height
  }
  if (quality) {
    options.quality = quality
  }
  options.resource_type = "auto"
  console.log("OPTIONS", options)

  if (file?.tempFilePath) {
    return await cloudinary.uploader.upload(file.tempFilePath, options)
  } else if (file?.data) {
    const dataUri = `data:${file.mimetype || "image/jpeg"};base64,${file.data.toString("base64")}`
    return await cloudinary.uploader.upload(dataUri, options)
  } else if (typeof file === "string") {
    return await cloudinary.uploader.upload(file, options)
  } else {
    throw new Error("No file or valid path found for upload")
  }
}
