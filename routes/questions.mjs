import { Router } from "express";
import connectionPool from "../utils/db.mjs";

const questionRouter = Router();

questionRouter
  .get("/", async (req, res) => {
    let result;
    try {
      result = await connectionPool.query(`SELECT * FROM questions`);
    } catch (error) {
      return res.status(500);
    }

    return res.status(200).json(result.rows);
  })
  .get("/:id", async (req, res) => {
    let result;
    try {
      result = await connectionPool.query(
        `SELECT * FROM questions WHERE id = $1`,
        [req.params.id]
      );
    } catch (error) {
      return res.status(500);
    }

    if (!result.rowCount) {
      return res.status(404).json("Question not found");
    }

    return res.status(200).json(result.rows[0]);
  });

questionRouter.post("/", async (req, res) => {
  if (!req.body.title || !req.body.description) {
    return res.status(400).json("Missing or invalid request data");
  }

  let result;
  try {
    result = await connectionPool.query(
      `INSERT INTO questions (title, description, category) VALUES ($1, $2, $3) RETURNING *`,
      [req.body.title, req.body.description, req.body.category]
    );
  } catch (error) {
    return res.status(500);
  }

  return res.status(201).json(result.rows[0]);
});

questionRouter.put("/:id", async (req, res) => {
  if (!req.body.title || !req.body.description) {
    return res.status(400).json("Missing or invalid request data");
  }

  let result;
  try {
    result = await connectionPool.query(
      `UPDATE questions SET title = $1 , description = $2, category = COALESCE($3, category), updated_at = NOW() WHERE id = $4 RETURNING *`,
      [req.body.title, req.body.description, req.body.category, req.params.id]
    );
  } catch (error) {
    return res.status(500);
  }

  if (!result.rowCount) {
    return res.status(404).json("Question not found");
  }

  return res.status(200).json(result.rows[0]);
});

questionRouter.delete("/:id", async (req, res) => {
  let result;
  try {
    result = await connectionPool.query(`DELETE FROM questions WHERE id = $1`, [
      req.params.id,
    ]);
  } catch (error) {
    return res.status(500);
  }

  if (!result.rowCount) {
    return res.status(404).json("Question not found");
  }

  return res.status(200).json({
    message: "Question deleted successfully",
  });
});

export default questionRouter;
