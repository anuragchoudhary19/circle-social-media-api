const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.upload = async (req, res) => {
  let image = await cloudinary.uploader.upload(req.body.image, {
    public_id: `${Date.now()}`,
    resource_type: 'auto',
  });
  res.json({
    public_id: image.public_id,
    url: image.secure_url,
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
