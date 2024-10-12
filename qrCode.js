import fs from "fs";
import qr from "qr-image";
import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Set up the directory path
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3502;
const folderPath = `${__dirname}/folder`;

// Create a folder if it doesn't exist
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

// Middleware to serve static files
app.use(express.static(folderPath));
app.use(express.static("./"));
app.use(bodyParser.urlencoded({ extended: true }));

// Function to generate QR code
function generateQrCode(req, res, next) {
  const userInput = req.body["userInput"];

  if (!userInput) {
    return res.status(400).send("No input provided.");
  }

  const qrCode = qr.image(userInput, { type: "png" });
  const qrCodePath = `${folderPath}/qrGen.png`;

  // Pipe the QR code to a file
  qrCode
    .pipe(fs.createWriteStream(qrCodePath))
    .on("finish", () => {
      next(); // Proceed to the next middleware
    })
    .on("error", (err) => {
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
  // Serve the static result page
  res.sendFile(`${folderPath}/result.html`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}...`);
});
