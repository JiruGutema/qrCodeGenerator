import fs from "fs";
import qr from "qr-image";
import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3500;

const folderPath = `${__dirname}`;
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(folderPath)); // Serve static files from folderPath

function generateQrCode(req, res, next) {
  const userInput = req.body["userInput"];

  if (!userInput) {
    return res.status(400).send("No input provided.");
  }

  const qrCode = qr.image(userInput, { type: "png" });
  const qrCodePath = `${folderPath}/qrGen.png`;

  qrCode
    .pipe(fs.createWriteStream(qrCodePath))
    .on("finish", () => {
      console.log("QR code generated successfully.");
      next();
    })
    .on("error", (err) => {
      console.error("Error generating QR code:", err);
      res.status(500).send("Error generating QR code.");
    });
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/result", generateQrCode, (req, res) => {
  const qrCodePath = `${folderPath}/qrGen.png`;
  res.sendFile(qrCodePath, (err) => {
    if (err) {
      console.error("Error sending QR code:", err);
      res.status(err.status).end();
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}...`);
});
