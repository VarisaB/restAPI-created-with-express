import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateQuestionId } from "../middlewares/id-validation.mjs";
import { validatePostAnswer } from "../middlewares/post-ans-validation.mjs";

const answerRouter = Router({ mergeParams: true });
answerRouter.use(validateQuestionId);

answerRouter
  .post("/", [validatePostAnswer], async (req, res) => {
    try {
      const result = await connectionPool.query(
        `INSERT INTO answers (question_id, content) VALUES ($1, $2) RETURNING *`,
        [req.params.id, req.body.content]
      );
      return res.status(201).json(result.rows[0]);
    } catch (error) {
      return res.status(500);
    }
  })
  .get("/", async (req, res) => {
    try {
      const result = await connectionPool.query(
        `SELECT * FROM answers WHERE question_id = $1`,
        [req.params.id]
      );
      return res.status(200).json(result.rows);
    } catch (error) {
      return res.status(500);
    }
  });

export default answerRouter;
