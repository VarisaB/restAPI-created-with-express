import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateAnswerId } from "../middlewares/id-validation.mjs";

const answerVoteRouter = Router({ mergeParams: true });
answerVoteRouter.use(validateAnswerId);

answerVoteRouter
  .post("/upvote", async (req, res) => {
    try {
      const result = await connectionPool.query(
        `INSERT INTO answer_votes (answer_id, vote) VALUES ($1, 1) RETURNING *`,
        [req.params.id]
      );
      const answerInfo = await connectionPool.query(
        `SELECT * FROM answers WHERE id = $1`,
        [req.params.id]
      );
      const upvotes = await connectionPool.query(
        `SELECT count(*) FROM answer_votes WHERE vote = 1 AND answer_id = $1`,
        [req.params.id]
      );
      const downvotes = await connectionPool.query(
        `SELECT count(*) FROM answer_votes WHERE vote = -1 AND answer_id = $1`,
        [req.params.id]
      );
      return res.status(200).json({
        ...answerInfo.rows[0],
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
        `INSERT INTO answer_votes (answer_id, vote) VALUES ($1, -1) RETURNING *`,
        [req.params.id]
      );
      const answerInfo = await connectionPool.query(
        `SELECT * FROM answers WHERE id = $1`,
        [req.params.id]
      );
      const upvotes = await connectionPool.query(
        `SELECT count(*) FROM answer_votes WHERE vote = 1 AND answer_id = $1`,
        [req.params.id]
      );
      const downvotes = await connectionPool.query(
        `SELECT count(*) FROM answer_votes WHERE vote = -1 AND answer_id = $1`,
        [req.params.id]
      );
      return res.status(200).json({
        ...answerInfo.rows[0],
        upvotes: Number(upvotes.rows[0].count),
        downvotes: Number(downvotes.rows[0].count),
      });
    } catch (error) {
      return res.status(500);
    }
  });

export default answerVoteRouter;
