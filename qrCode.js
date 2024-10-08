import fs from "fs";
import qr from "qr-image";
import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3502;

// Serve static files from the folder directory
app.use(express.static("./folder"));
app.use(bodyParser.urlencoded({ extended: true }));

// Function to generate QR code
function generateQrCode(req, res, next) {
  const userInput = req.body["userInput"];

  if (!userInput) {
    return res.status(400).send("No input provided.");
  }

  const qrCode = qr.image(userInput, { type: "png" });
  const qrCodePath = "./folder/qrGen.png";

  // Pipe the QR code to a file
  const writeStream = fs.createWriteStream(qrCodePath);
  qrCode.pipe(writeStream);

  writeStream.on("finish", () => {
    next(); // Proceed to the next middleware
  });

  writeStream.on("error", (err) => {
    console.error("Error generating QR code:", err);
    res.status(500).send("Error generating QR code.");
  });
}

// Serve the homepage
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

// Handle form submission and send the result page
app.post("/result", generateQrCode, (req, res) => {
  res.sendFile(`${__dirname}/folder/result.html`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}...`);
});
