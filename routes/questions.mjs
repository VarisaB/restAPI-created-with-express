import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateQuestionId } from "../middlewares/id-validation.mjs";

const questionRouter = Router();

questionRouter
  .get("/", async (req, res) => {
    for (let key in req.query) {
      if (key !== "title" && key !== "category") {
        return res.status(400).send("Invalid query parameters.");
      }
    }

    try {
      const searchTitle = `%${req.query.title ?? ""}%`;
      const result = await connectionPool.query(
        `SELECT * FROM questions WHERE (title LIKE $1 or $1 is null or $1 = '') AND (category = $2 or $2 is null or $2 = '')`,
        [searchTitle, req.query.category]
      );

      return res.status(200).json(result.rows);
    } catch (error) {
      return res.status(500);
    }
  })
  .get("/:id", [validateQuestionId], async (req, res) => {
    try {
      const result = await connectionPool.query(
        `SELECT * FROM questions WHERE id = $1`,
        [req.params.id]
      );
      return res.status(200).json(result.rows[0]);
    } catch (error) {
      return res.status(500);
    }
  });

questionRouter.post("/", async (req, res) => {
  if (!req.body.title || !req.body.description) {
    return res.status(400).json("Missing or invalid request data");
  }

  try {
    const result = await connectionPool.query(
      `INSERT INTO questions (title, description, category) VALUES ($1, $2, $3) RETURNING *`,
      [req.body.title, req.body.description, req.body.category]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500);
  }
});

questionRouter.put("/:id", [validateQuestionId], async (req, res) => {
  if (!req.body.title || !req.body.description) {
    return res.status(400).json("Missing or invalid request data");
  }

  try {
    const result = await connectionPool.query(
      `UPDATE questions SET title = $1 , description = $2, category = COALESCE($3, category), updated_at = NOW() WHERE id = $4 RETURNING *`,
      [req.body.title, req.body.description, req.body.category, req.params.id]
    );
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500);
  }
});

questionRouter.delete("/:id", [validateQuestionId], async (req, res) => {
  try {
    const result = await connectionPool.query(
      `DELETE FROM questions WHERE id = $1`,
      [req.params.id]
    );

    return res.status(200).json({
      message: "Question and its answers deleted successfully.",
    });
  } catch (error) {
    return res.status(500);
  }
});

export default questionRouter;
