import express from "express";
import questionRouter from "./routes/questions.mjs";
import answerRouter from "./routes/answers.mjs";
import answerVoteRouter from "./routes/answer_votes.mjs";
import questionVoteRouter from "./routes/question_votes.mjs";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const app = express();
const port = 4000;

app.use(express.json());
app.use("/questions", questionRouter);
app.use("/questions/:id/answers", answerRouter);
app.use("/answers/:id", answerVoteRouter);
app.use("/questions/:id", questionVoteRouter);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Question and Answer API",
      description: "API for handling questions, answers, and votes",
    },
    tags: [
      {
        name: "Questions",
        description: "Operations related to questions",
      },
      {
        name: "Answers",
        description: "Operations related to answers",
      },
    ],
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Local development server",
      },
    ],
  },
  apis: ["./swagger-text/*.yaml"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
