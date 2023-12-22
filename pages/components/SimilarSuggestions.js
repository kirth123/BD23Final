import React from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

const SimilarSuggestions = ({ result }) => {
  // Destructure the data for easier access
  const { randomlySelectedQuestion, topSimilarQuestions } = result;

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Top SimilarQuestions
        </Typography>
        <Typography variant="h6" gutterBottom>
          Randomly Selected Question
        </Typography>
        <Typography variant="body1" gutterBottom>
          ID: {randomlySelectedQuestion.id}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Tags: {randomlySelectedQuestion.tags}
        </Typography>
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{ __html: randomlySelectedQuestion.body }}
          gutterBottom
        />

        <Typography variant="h6" gutterBottom>
          Top Similar Questions
        </Typography>
        {topSimilarQuestions.map((question, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              ID: {question.id}, Similarity: {question.similarity.toFixed(2)}
            </Typography>
            <Typography variant="subtitle2">Tags: {question.tags}</Typography>
            <Typography
              variant="body2"
              dangerouslySetInnerHTML={{ __html: question.body }}
            />
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default SimilarSuggestions;
