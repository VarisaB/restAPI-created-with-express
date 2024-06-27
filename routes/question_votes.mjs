import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateQuestionId } from "../middlewares/id-validation.mjs";

const questionVoteRouter = Router({ mergeParams: true });
questionVoteRouter.use(validateQuestionId);

questionVoteRouter
  .post("/upvote", async (req, res) => {
    try {
      const result = await connectionPool.query(
        `INSERT INTO question_votes (question_id, vote) VALUES ($1, 1) RETURNING *`,
        [req.params.id]
      );
      const questionInfo = await connectionPool.query(
        `SELECT * FROM questions WHERE id = $1`,
        [req.params.id]
      );
      const upvotes = await connectionPool.query(
        `SELECT count(*) FROM question_votes WHERE vote = 1 AND question_id = $1`,
        [req.params.id]
      );
      const downvotes = await connectionPool.query(
        `SELECT count(*) FROM question_votes WHERE vote = -1 AND question_id = $1`,
        [req.params.id]
      );
      return res.status(200).json({
        ...questionInfo.rows[0],
        upvotes: Number(upvotes.rows[0].count),
        downvotes: Number(downvotes.rows[0].count),
      });
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
      const questionInfo = await connectionPool.query(
        `SELECT * FROM questions WHERE id = $1`,
        [req.params.id]
      );
      const upvotes = await connectionPool.query(
        `SELECT count(*) FROM question_votes WHERE vote = 1 AND question_id = $1`,
        [req.params.id]
      );
      const downvotes = await connectionPool.query(
        `SELECT count(*) FROM question_votes WHERE vote = -1 AND question_id = $1`,
        [req.params.id]
      );
      return res.status(200).json({
        ...questionInfo.rows[0],
        upvotes: Number(upvotes.rows[0].count),
        downvotes: Number(downvotes.rows[0].count),
      });
    } catch (error) {
      return res.status(500);
    }
  });

export default questionVoteRouter;
