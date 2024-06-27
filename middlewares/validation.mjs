import connectionPool from "../utils/db.mjs";

export async function validateQuestionId(req, res, next) {
  try {
    const result = await connectionPool.query(
      `SELECT * FROM questions WHERE id = $1`,
      [req.params.id]
    );

    if (!result.rowCount) {
      return res.status(404).send("Question not found.");
    }
  } catch (error) {
    return res.status(500);
  }

  next();
}

export async function validateAnswerId(req, res, next) {
  try {
    const result = await connectionPool.query(
      `SELECT * FROM answers WHERE id = $1`,
      [req.params.id]
    );
    console.log(req.params.id);
    if (!result.rowCount) {
      return res.status(404).send("Answer not found.");
    }
  } catch (error) {
    return res.status(500);
  }

  next();
}
