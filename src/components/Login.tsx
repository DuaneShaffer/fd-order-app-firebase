import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

const Login: React.FC = () => {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <Grid
      container
      spacing={2}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item>
        <img src="/logo512.png" alt="Logo" style={{ height: 100, marginBottom: 20 }} />
      </Grid>
      <Grid item>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Welcome to the Fairbanks Distributors Order App
        </Typography>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          size="large"
        >
          Login with Google
        </Button>
      </Grid>
    </Grid>
  );
};

export default Login;
