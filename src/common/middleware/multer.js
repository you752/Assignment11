import multer from "multer";
export const upload = (file) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9)+file.originalname ;
      cb(null,uniqueName);
    },
  });
  const upload = multer({ storage });
  return upload;
};
