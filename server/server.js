require("dotenv").config();
const express = require("express");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

let vehicleData = {
  lat: 0,
  lng: 0,
  motion: "NO MOTION",
  relay: "OFF",
  imageUrl: ""
};

/////////////////////////////
// ESP32 UPDATE
/////////////////////////////
app.post("/api/update", async (req, res) => {

  if (req.headers["x-device-key"] !== "MY_SECRET")
    return res.status(403).send("Unauthorized");

  const { lat, lng, motion, relay, image } = req.body;

  let uploadedImage = "";

  if (image) {
    const upload = await cloudinary.uploader.upload(
      "data:image/jpeg;base64," + image,
      { folder: "vehicle" }
    );
    uploadedImage = upload.secure_url;
  }

  vehicleData = {
    lat,
    lng,
    motion,
    relay,
    imageUrl: uploadedImage
  };

  res.json({ success: true });
});

app.get("/api/status", (req, res) => {
  res.json(vehicleData);
});

app.post("/api/ignition", (req, res) => {
  vehicleData.relay = req.body.state;
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
