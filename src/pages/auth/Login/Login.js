import React, { useState } from "react";
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, TextField, Typography, Link, Stack } from "@mui/material";
import AuthLayout from "../../../layouts/AuthLayout";

const Login = () => {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const validateInputs = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateInputs()) {
      const data = new FormData(event.currentTarget);
      console.log({
        email: data.get("email"),
        password: data.get("password"),
      });
    }
  };

  return (
    <AuthLayout>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: 400, padding: 2, background: "white", borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h4" component="h1" textAlign="center" marginBottom={2}>
          Sign In
        </Typography>
        <FormControl fullWidth margin="normal">
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            id="email"
            name="email"
            type="email"
            error={emailError}
            helperText={emailErrorMessage}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            id="password"
            name="password"
            type="password"
            error={passwordError}
            helperText={passwordErrorMessage}
            required
          />
        </FormControl>
        <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
          Sign In
        </Button>
        <Link href="/forgot-password" variant="body2" display="block" textAlign="center" marginTop={2}>
          Forgot your password?
        </Link>
        <Typography textAlign="center" marginTop={2}>
          Don't have an account? <Link href="/signup">Sign Up</Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
};

export default Login;
