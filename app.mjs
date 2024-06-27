import express from "express";
import questionRouter from "./routes/questions.mjs";
import answerRouter from "./routes/answers.mjs";
import answerVoteRouter from "./routes/answer_votes.mjs";
import questionVoteRouter from "./routes/question_votes.mjs";

const app = express();
const port = 4000;

app.use(express.json());
app.use("/questions", questionRouter);
app.use("/questions/:id/answers", answerRouter);
app.use("/answers/:id", answerVoteRouter);
app.use("/questions/:id", questionVoteRouter);

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
