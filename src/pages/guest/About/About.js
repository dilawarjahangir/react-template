import React from "react";
import GuestLayout from "../../../layouts/GuestLayout";
import { Typography, Box } from "@mui/material";

const About = () => {
  return (
    <GuestLayout>
      <Box sx={{ padding: "50px 20px" }}>
        <Typography variant="h4" gutterBottom>
          About Us
        </Typography>
        <Typography>
          We are a company dedicated to providing the best products and services to our customers. Our mission is to make a positive impact in the world through innovation and excellence.
        </Typography>
      </Box>
    </GuestLayout>
  );
};

export default About;
