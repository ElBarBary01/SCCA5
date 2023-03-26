import express from 'express'
import dotenv from 'dotenv'
import multer from 'multer';
import bodyParser from 'body-parser';
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"
import { uuid } from 'uuidv4';
import cors from 'cors'

const app = express()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.use(cors())
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config()

const region = "us-west-2"
const bucketName = "sccassignment5"
const accessKey = process.env.AWS_ACCESS_KEY_ID
const secretAccess = process.env.AWS_SECRET_ACCESS_KEY

const s3Client = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccess,
  },
  region: region
})


app.get('/list', async (req, res) => {

  const command = new ListObjectsV2Command({
    Bucket: "sccassignment5",
    Prefix: 'files/',
    // The default and maximum number of keys returned is 1000. This limits it to
    // one for demonstration purposes.
    MaxKeys: 50,
  });

  let { Contents } = await s3Client.send(command)
  const result = Contents?.filter((file) => file.Size > 0).map((object) => { return ( object.Key?.replace('files/', '')) })
  //let result = Contents.map((item) => { return item.Key; })
  res.send(result)

})
app.post('/upload', upload.single('file'), async (req, res) => {

  let filename = req.file.originalname.split('.')
  console.log(filename)

  let key = filename[0] + "_" + uuid() + "." + filename[1]

  console.log(key)
  const params = {
    Bucket: bucketName,
    Key: "files/"+ key,
    Body: req.file.buffer,
    ContentType: req.file.mimetype

  }
  const command = new PutObjectCommand(params)

  let result = await s3Client.send(command)
  console.log(result)
  res.send(result)

})

app.post('/delete', async (req, res) => {

  console.log(req.body)
  let key = req.body.key

  let params = {
    Bucket: bucketName,
    Key:"files/" + key,
  }
  const command = new DeleteObjectCommand(params)

  let result = await s3Client.send(command)
  console.log(result)
  res.send(result)
})


app.listen(3000, () => console.log("listening on port 3000"))