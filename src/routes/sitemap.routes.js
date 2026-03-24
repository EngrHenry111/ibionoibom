import express from "express";
import { SitemapStream, streamToPromise } from "sitemap";

import News from "../models/News.js";
import BMT from "../models/bmt.model.js";

const router = express.Router();

router.get("/sitemap.xml", async (req, res) => {
  try {

    const smStream = new SitemapStream({
      hostname: "https://ibionoibom-2.onrender.com"
    });

    /* ================= STATIC PAGES ================= */

    smStream.write({ url: "/", changefreq: "daily", priority: 1.0 });

    smStream.write({ url: "/news", changefreq: "daily", priority: 0.9 });
    smStream.write({ url: "/leadership", changefreq: "monthly", priority: 0.8 });
    smStream.write({ url: "/departments", changefreq: "monthly", priority: 0.8 });
    smStream.write({ url: "/location", changefreq: "monthly", priority: 0.7 });

    /* ================= SERVICES ================= */

    smStream.write({ url: "/bursary", changefreq: "weekly", priority: 0.9 });
    smStream.write({ url: "/diaspora", changefreq: "weekly", priority: 0.8 });
    smStream.write({ url: "/feedback", changefreq: "monthly", priority: 0.6 });

    /* ================= SYSTEM ================= */

    smStream.write({ url: "/bmt", changefreq: "daily", priority: 0.9 });

    /* ================= SECTORS ================= */

    smStream.write({ url: "/education", changefreq: "monthly", priority: 0.7 });
    smStream.write({ url: "/health", changefreq: "monthly", priority: 0.7 });
    smStream.write({ url: "/agriculture", changefreq: "monthly", priority: 0.7 });
    smStream.write({ url: "/tourism", changefreq: "monthly", priority: 0.7 });

    /* ================= DYNAMIC NEWS ================= */

    const news = await News.find().sort({ createdAt: -1 });

    news.forEach(item => {
      smStream.write({
        url: `/news/${item._id}`,
        changefreq: "daily",
        priority: 0.9,
        lastmod: item.updatedAt || item.createdAt
      });
    });

    /* ================= DYNAMIC BMT ================= */

    const bmt = await BMT.find().sort({ createdAt: -1 });

    bmt.forEach(item => {
      smStream.write({
        url: `/bmt/${item._id}`,
        changefreq: "weekly",
        priority: 0.8,
        lastmod: item.updatedAt || item.createdAt
      });
    });

    smStream.end();

    const sitemap = await streamToPromise(smStream);

    res.header("Content-Type", "application/xml");
    res.send(sitemap.toString());

  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

export default router;