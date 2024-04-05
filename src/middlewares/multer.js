import multer from "multer";

const storage = multer.memoryStorage();
const singleUpload = multer({ storage: storage }).single("file");
// console.log("upload");

export default singleUpload;
