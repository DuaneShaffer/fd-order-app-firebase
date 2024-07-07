import React from 'react';
   import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
   import { CssBaseline, Container } from '@mui/material';
  //  import Header from './components/Header';
  //  import Home from './pages/Home';
  //  import Items from './pages/Items';
  //  import Orders from './pages/Orders';
  //  import Warehouse from './pages/Warehouse';
  const Header = () => <div>Header Div</div>;
  const Home = () => <div>Home Page</div>;
const Items = () => <div>Items Page</div>;
const Orders = () => <div>Orders Page</div>;
const Warehouse = () => <div>Warehouse Page</div>;

   const App: React.FC = () => {
     return (
       <Router>
         <CssBaseline />
         <Header />
         <Container>
           <Routes>
             <Route path="/" Component={Home} />
             <Route path="/items" Component={Items} />
             <Route path="/orders" Component={Orders} />
             <Route path="/warehouse" Component={Warehouse} />
           </Routes>
         </Container>
       </Router>
     );
   };

   export default App;
   