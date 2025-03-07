const express = require("express");

const fs = require("fs");

const path = require("path");

const cors = require("cors");
const port = 8888;

const app = express();

app.use(express.json());
app.use(cors());

const BASE_DIR = path.join(__dirname, "storage"); // Base directory for folders and files

// Ensure base directory exists
if (!fs.existsSync(BASE_DIR)) {
  fs.mkdirSync(BASE_DIR);
}

// Create a new folder
app.post("/create-folder", (req, res) => {
  const folderName = `Folder_${Date.now()}`;
  const folderPath = path.join(BASE_DIR, folderName);

  fs.mkdir(folderPath, { recursive: true }, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error creating folder", error: err });
    }
    res.json({ message: "Folder created", folderName });
  });
});

app.post("/create-file", (req, res) => {
  const fileName = `File_${Date.now()}.txt`;
  const filePath = path.join(BASE_DIR, fileName);

  fs.writeFile(filePath, "This is a new file.", (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error creating file", error: err });
    }
    res.json({ message: "File created", fileName });
  });
});

app.get("/list", (req, res) => {
    fs.readdir(BASE_DIR, { withFileTypes: true }, (err, items) => {
        if (err) {
            return res.status(500).json({ message: "Error reading directory", error: err });
        }
        const data = items.map((item) => ({
            name: item.name,
            type: item.isDirectory() ? "folder" : "file",
        }));
        res.json(data);
    });
});

app.listen(port, () => {
  console.log("server is running on port " + port);
});
