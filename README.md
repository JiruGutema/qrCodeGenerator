# QR Code Generator

This is a simple QR Code generator application built using Node.js, Express, and the `qr-image` library. It allows users to input text and generate a corresponding QR code, which is then saved as an image file.

check it out at [Check it out Here](https://qrcodegenerator-74um.onrender.com/)

## Features

- Accepts user input through a form.
- Generates a QR code based on the input.
- Saves the generated QR code as a PNG file.
- Displays the result on a separate page.

## Prerequisites

- Node.js (v14 or later)
- npm (Node Package Manager)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

## Usage

1. Start the server:

   ```bash
   node app.js
   ```

   The server will run at `http://localhost:3333`.

2. Open your browser and go to `http://localhost:3333`.

3. Enter your text in the form and submit it to generate a QR code.

4. The generated QR code will be saved in the `./folder` directory, and you will be redirected to the result page.

## Directory Structure

```
/project-root
│
├── /folder                  # Directory for static files
│   ├── qrGen.png           # Generated QR code image
│   └── result.html         # Result page template
│
├── app.js                   # Main application file
└── package.json             # Project metadata and dependencies
```

## Dependencies

- `express`: Web framework for Node.js
- `body-parser`: Middleware for parsing request bodies
- `qr-image`: Library for generating QR codes
- `fs`: Node.js file system module (built-in)

## Contributing

Feel free to submit issues or pull requests if you have suggestions for improvements or new features!
