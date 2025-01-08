import React from "react";
import { Typography, Button, Box } from "@mui/material";

const HeroSection = () => {
  return (
    <Box sx={{ textAlign: "center", padding: "50px 20px" }}>
      <Typography variant="h2" gutterBottom>
        Welcome to Our Marketing Page
      </Typography>
      <Typography variant="h6" gutterBottom>
        Discover our amazing products and services.
      </Typography>
      <Button variant="contained" color="primary">
        Learn More
      </Button>
    </Box>
  );
};

export default HeroSection;
