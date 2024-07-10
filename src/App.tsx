import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { User } from 'firebase/auth';
import { auth } from './firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Login from './components/Login';
import Header from './components/Header';
import Home from './components/Home';
import Items from './components/Items';
import Orders from './components/Orders';
import WarehouseDashboard from './components/WarehouseDashboard';
import BarcodeScanner from './components/BarcodeScanner';
import Chat from './components/Chat';
import theme from './theme';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user === null) {
    return <Login />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/items" element={<Items />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/warehouse" element={<WarehouseDashboard />} />
            <Route path="/scan" element={<BarcodeScanner />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;