const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = async (req, res) => {
  try {
    const image = await cloudinary.uploader.upload(req.body.image, {
      public_id: `${Date.now()}`,
      resource_type: 'auto',
    });
    return res.json({
      public_id: image.public_id,
      url: image.secure_url,
    });
  } catch (error) {
    return res.status(400).json('Error in uploading images');
  }
};
exports.uploadVideo = async (req, res) => {
  try {
    const fileName = req.headers['file-name'];
    const isLastChunk = req.headers['last-chunk'];
    // console.log(isLastChunk);
    req.on('data', (chunk) => {
      // console.log(chunk);
      fs.appendFileSync(fileName, chunk);
    });
    if (isLastChunk === 'true') {
      let video = await cloudinary.uploader.upload(`./${fileName}`, {
        public_id: `${Date.now()}`,
        resource_type: 'video',
      });
      fs.unlinkSync(`./${fileName}`);
      return res.json({
        public_id: video.public_id,
        url: video.secure_url,
      });
    }
    res.end(`recieved chunk`);
  } catch (error) {
    console.log(error);
    res.json('error');
  }
};

exports.remove = async (req, res) => {
  console.log(req.body);
  let image_id = req.body.public_id;
  cloudinary.uploader.destroy(image_id, (err, result) => {
    console.log(result);
    if (err) return res.status(401).json({ success: false, err });
    res.status(200).json({ success: true });
  });
};
