export const uploadLeaderPhoto = (req, res) => {
  res.json({ imageUrl: `/uploads/leaders/${req.file.filename}` });
};

export const uploadNewsPhoto = (req, res) => {
  res.json({ imageUrl: `/uploads/news/${req.file.filename}` });
};
