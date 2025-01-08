import React from "react";
import { Typography, Grid, Box } from "@mui/material";

const features = [
  { title: "Feature 1", description: "Amazing feature 1 description" },
  { title: "Feature 2", description: "Amazing feature 2 description" },
  { title: "Feature 3", description: "Amazing feature 3 description" },
];

const FeaturesSection = () => {
  return (
    <Box sx={{ padding: "50px 20px" }}>
      <Typography variant="h4" gutterBottom>
        Our Features
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Typography variant="h6">{feature.title}</Typography>
            <Typography>{feature.description}</Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturesSection;
