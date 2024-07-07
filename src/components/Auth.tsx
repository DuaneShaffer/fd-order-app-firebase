import React, { useState } from 'react';
   import { auth } from '../firebase';
   import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
   import { Button, TextField, Typography, Container } from '@material-ui/core';

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
         <Typography variant="h5">{isSignUp ? 'Sign Up' : 'Sign In'}</Typography>
         <form onSubmit={handleAuth}>
           <TextField
             fullWidth
             label="Email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             margin="normal"
           />
           <TextField
             fullWidth
             label="Password"
             type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             margin="normal"
           />
           <Button type="submit" fullWidth variant="contained" color="primary">
             {isSignUp ? 'Sign Up' : 'Sign In'}
           </Button>
         </form>
         <Button onClick={() => setIsSignUp(!isSignUp)}>
           {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
         </Button>
       </Container>
     );
   };

   export default Auth;
