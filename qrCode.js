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
  //
  // const resultHtml = `
  //   <!DOCTYPE html>
  //   <html lang="en">
  //   <head>
  //       <meta charset="UTF-8">
  //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //       <title>QR Code Result</title>
  //   </head>
  //   <body>
  //       <h1>Your QR Code</h1>
  //       <img src="/qrGen.png" alt="QR Code" />
  //       <p><a href="/">Generate another QR code</a></p>
  //   </body>
  //   </html>
  // `;
  const qrCodePath = `${folderPath}/qrGen.png`;
  res.sendFile(qrCodePath);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}...`);
});
