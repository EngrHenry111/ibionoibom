import express from "express";
import News from "../models/News.js";

const router = express.Router();

router.get("/og/news/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) return res.status(404).send("Not found");

    const getImageUrl = (img) => {
      if (!img) return "https://ibionoibomlga.com/logo.png";
      if (img.startsWith("http")) return img;
      return `https://ibionoibom-2.onrender.com/uploads/news/${img}`;
    };

    const image = getImageUrl(news.images?.[0]);

    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${news.title}</title>

        <meta property="og:title" content="${news.title}" />
        <meta property="og:description" content="${news.content.slice(0,150)}" />
        <meta property="og:image" content="${image}" />
        <meta property="og:url" content="https://ibionoibomlga.com/news/${news._id}" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Ibiono Ibom LGA" />

        <meta name="twitter:card" content="summary_large_image" />

        <!-- ✅ MOBILE SAFE REDIRECT -->
                    
            <script>
            setTimeout(() => {
                window.location.href = "https://ibionoibomlga.com/news/${news._id}";
            }, 3000);
            </script>  
        </head>
      <body></body>
    </html>
    `);

  } catch (err) {
    console.error("OG ERROR:", err);
    res.status(500).send("Server error");
  }
});

export default router;