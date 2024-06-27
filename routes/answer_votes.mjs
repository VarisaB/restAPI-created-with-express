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
      return res.status(200).json();
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
      return res.status(200).json(result.rows[0]);
    } catch (error) {
      return res.status(500);
    }
  });

export default answerVoteRouter;
