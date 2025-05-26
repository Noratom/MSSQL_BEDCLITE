// cloudinary_config.js
const cloudinary = require('cloudinary').v2;
const crypto = require('crypto');

// Cloudinary setup (replace with your credentials)
cloudinary.config({
    cloud_name: 'dmm1bpbxi',
    api_key: '969197375199626',
    api_secret: 'V0IuzIsDZJLQ2UOF1kuhG1-Kdw8'
});

// Function to upload image to Cloudinary (includes signature and timestamp)
const uploadImage = (filePath, folderName) => {
  const timestamp = Math.floor(Date.now() / 1000);  // Get current Unix timestamp

  // Create the string to sign
  const stringToSign = `folder=${folderName}&timestamp=${timestamp}`;

  // Generate the signature
  const signature = crypto
    .createHash('sha1')
    .update(stringToSign + cloudinary.config().api_secret)
    .digest('hex');

  // Upload the image to Cloudinary
  return cloudinary.uploader.upload(filePath, {
    folder: folderName,
    timestamp: timestamp,
    signature: signature,
    api_key: cloudinary.config().api_key
  });
};

module.exports = { uploadImage };
