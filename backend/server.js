const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5002;
const multer = require('multer');
const path = require('path');


app.use(bodyParser.json());
app.use(cors());
// Include your routes here
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file)
    console.log(req.body)
    cb(null,__dirname+'/uploads'); // Set the directory where files will be stored
  },
  filename: (req, file, cb) => {
    const newFileName = Date.now()+"_"+Math.floor(1000 + Math.random() * 9000)+ path.extname(file.originalname);
    cb(null, newFileName); // Use the original file name
  },
});

const upload = multer({ storage: storage });

app.post('/auth/uploadFile', upload.single('file'), (req, res) => {
  console.log('uploading file')
  const file = req.file;
  return res.json({ filename: file.filename, size: file.size });
});

app.get("/auth/viewDoc/:fileName",(req, res)=>{
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname,'./uploads', fileName);
  console.log(filePath)
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
