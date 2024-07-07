import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Button, TextField, Typography, Container, Box } from '@mui/material';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5">{isSignUp ? 'Sign Up' : 'Sign In'}</Typography>
        <Box component="form" onSubmit={handleAuth} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </Box>
        <Button onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </Button>
      </Box>
    </Container>
  );
};

export default Auth;