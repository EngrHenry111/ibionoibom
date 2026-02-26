import mongoose from "mongoose";
import cloudinary from "../src/config/cloudinary.js";
import News from "../src/models/News.js";
import Leader from "../src/models/Leader.js";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
console.log("MongoDB connected");

/* =========================
   MIGRATE NEWS IMAGES
========================= */

const newsList = await News.find();

for (let news of newsList) {
  if (news.images && news.images.length > 0) {
    for (let i = 0; i < news.images.length; i++) {
      if (news.images[i].startsWith("/uploads")) {
        const localPath = `.${news.images[i]}`;

        if (fs.existsSync(localPath)) {
          const result = await cloudinary.uploader.upload(localPath, {
            folder: "ibiono/news",
          });

          news.images[i] = result.secure_url;
        }
      }
    }

    await news.save();
    console.log(`News Updated: ${news.title}`);
  }
}

/* =========================
   MIGRATE LEADER IMAGES
========================= */
const leaderList = await Leader.find();

for (let leader of leaderList) {
  if (
    leader.imageUrl &&
    leader.imageUrl.includes("/uploads/")
  ) {
    // Extract only the path after domain
    const uploadPath = leader.imageUrl.split("/uploads/")[1];

    const localPath = `./uploads/${uploadPath}`;

    if (fs.existsSync(localPath)) {
      const result = await cloudinary.uploader.upload(localPath, {
        folder: "ibiono/leaders",
      });

      leader.imageUrl = result.secure_url;
      await leader.save();

      console.log(`Leader Updated: ${leader.fullName}`);
    } else {
      console.log(`File not found locally: ${localPath}`);
    }
  }
}

console.log("Migration complete ✅");
process.exit();