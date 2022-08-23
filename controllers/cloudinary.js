const cloudinary = require('cloudinary').v2;

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
  const fileName = req.headers['file-name'];
  req.on('data', (chunk) => {
    //   console.log(`recieved chunk${chunk.length}`);
    console.log(chunk);
    fs.appendFileSync(fileName, chunk);
  });
  res.end('upload complete');
  let video = await cloudinary.uploader.upload(req.body.video, {
    public_id: `${Date.now()}`,
    resource_type: 'video',
  });
  res.json({
    public_id: video.public_id,
    url: video.secure_url,
  });
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
