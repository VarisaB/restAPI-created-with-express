import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateQuestionId } from "../middlewares/validation.mjs";

const questionVoteRouter = Router({ mergeParams: true });
questionVoteRouter.use(validateQuestionId);

questionVoteRouter
  .post("/upvote", async (req, res) => {
    try {
      const result = await connectionPool.query(
        `INSERT INTO question_votes (question_id, vote) VALUES ($1, 1) RETURNING *`,
        [req.params.id]
      );
      return res.status(200).json(result.rows[0]);
    } catch (error) {
      return res.status(500);
    }
  })
  .post("/downvote", async (req, res) => {
    try {
      const result = await connectionPool.query(
        `INSERT INTO question_votes (question_id, vote) VALUES ($1, -1) RETURNING *`,
        [req.params.id]
      );
      return res.status(200).json(result.rows[0]);
    } catch (error) {
      return res.status(500);
    }
  });

export default questionVoteRouter;
