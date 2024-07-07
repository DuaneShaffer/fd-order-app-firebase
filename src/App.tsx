import React from 'react';
   import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
   import { CssBaseline, Container } from '@material-ui/core';
   import Header from './components/Header';
   import Home from './pages/Home';
   import Items from './pages/Items';
   import Orders from './pages/Orders';
   import Warehouse from './pages/Warehouse';

   const App: React.FC = () => {
     return (
       <Router>
         <CssBaseline />
         <Header />
         <Container>
           <Switch>
             <Route exact path="/" component={Home} />
             <Route path="/items" component={Items} />
             <Route path="/orders" component={Orders} />
             <Route path="/warehouse" component={Warehouse} />
           </Switch>
         </Container>
       </Router>
     );
   };

   export default App;
   