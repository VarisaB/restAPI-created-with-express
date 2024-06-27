export function validatePostAnswer(req, res, next) {
  if (!req.body.content) {
    return res.status(400).send("Missing or invalid request data.");
  }

  if (req.body.content.length > 300) {
    return res.status(400).send("Content could not exceed 300 character.");
  }
  next();
}
