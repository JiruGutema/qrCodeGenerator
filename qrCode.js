import fs from "fs";
import qr from "qr-image";
import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3500;

app.use(bodyParser.urlencoded({ extended: true }));

function generateQrCode(req, res) {
  const userInput = req.body["userInput"];

  if (!userInput) {
    return res.status(400).send("No input provided.");
  }

  const qrCode = qr.image(userInput, { type: "png" });

  res.setHeader("Content-Type", "image/png");
  qrCode.pipe(res);
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/result", generateQrCode);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}...`);
});
