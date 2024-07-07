import React from 'react';
import { Typography, Container, Grid, Paper } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome to the Order App
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6">Quick Stats</Typography>
            <Typography>Total Orders: 0</Typography>
            <Typography>Active Items: 0</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6">Recent Activity</Typography>
            <Typography>No recent activity</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;