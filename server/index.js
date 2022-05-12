const express = require("express");
const upload = require("./upload");
const multer = require("multer");
const cors = require("cors");
const escape = require("sql-template-strings");
const db = require("./db");

const app = express();

//Add the client URL to the CORS policy
const whitelist = ["http://localhost:3001", "https://fgostar.com"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.post("/upload_file", upload.single("file"), async function (req, res) {
  if (!req.file) {
    //If the file is not uploaded, then throw custom error with message: FILE_MISSING
    throw Error("FILE_MISSING");
  } else {
    //If the file is uploaded, then send a success response.
    const body = req.body;
    const columns = await db.query(
      escape`INSERT INTO resume (fileName, message) VALUES(${req.file.filename}, ${
        body.message
      })`
    );
    
    res.send({ status: "success" });
  }
});

//Express Error Handling
app.use(function (err, req, res, next) {
  // Check if the error is thrown from multer
  if (err instanceof multer.MulterError) {
    res.statusCode = 400;
    res.send({ code: err.code });
  } else if (err) {
    // If it is not multer error then check if it is our custom error for FILE_MISSING & INVALID_TYPE
    if (err.message === "FILE_MISSING" || err.message === "INVALID_TYPE") {
      res.statusCode = 400;
      res.send({ code: err.message });
    } else {
      //For any other errors set code as GENERIC_ERROR
      res.statusCode = 500;
      res.send({ code: "GENERIC_ERROR" });
    }
  }
});

//Start the server in port 8081
const server = app.listen(3000, function () {
  const port = server.address().port;

  console.log("App started at http://localhost:%s", port);
});
