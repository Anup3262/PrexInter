const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  const validMimeTypes = [
    "application/pdf",
    "application/octet-stream",
  ];

  const isPdfExtension = extension === ".pdf";
  const isValidMimeType = validMimeTypes.includes(
    file.mimetype
  );

  console.log("Uploaded file:", file.originalname);
  console.log("MIME type:", file.mimetype);

  if (isPdfExtension && isValidMimeType) {
    return callback(null, true);
  }

  return callback(
    new Error("Only PDF resumes are allowed"),
    false
  );
};

const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = uploadResume;