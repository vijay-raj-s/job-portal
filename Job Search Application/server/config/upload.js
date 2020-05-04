const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
    cloud_name: 'dylqrxzvj',
    api_key: 323518943525613,
    api_secret: 'qGC4mWQvuOi4zEUmhjq_47S3P10'
});

const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "job-search-employers",
    allowedFormats: ["jpg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }]
});

const parser = multer({ storage: storage }); 

module.exports = {
    parser
}