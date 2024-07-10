import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';

const Header: React.FC = () => {
  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <Box mb={2}> {/* Add margin bottom to create padding below */}
      <AppBar position="static">
        <Toolbar>
        <img src="logo192.png" alt="Logo" style={{ marginRight: '10px', height: '30px' }}/>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            FD Order App
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/items">Items</Button>
          <Button color="inherit" component={Link} to="/orders">Orders</Button>
          <Button color="inherit" component={Link} to="/warehouse">Warehouse</Button>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
