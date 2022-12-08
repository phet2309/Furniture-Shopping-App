import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import StoreScreen from './screens/StoreScreen/StoreScreen';
import ProductDetailScreen from './screens/ProductDetailScreen/ProductDetailScreen';
import TransactionScreen from './screens/TransactionsScreens/TransactionScreen';
import OrderScreen from './screens/OrdersScreen/OrderScreen';
import OrderScreenItem from './screens/OrderScreenItem/OrderScreenItem';
import CheckoutScreen from './screens/CheckoutScreen/CheckoutScreen';
import StatisticsScreen from './screens/StatasticsScreen/StatisticsScreen';

function App() {

  const [isAuth, setIsAuth] = useState<any>(localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState<any>(localStorage.getItem('token'));

  const setAuth = (isAuthenticated: boolean) => {
    console.log("Inside setAuth")
    setIsAuth(isAuthenticated);
  };

  return (
    <>
      <Router>
        <Header isAuth={isAuth} setAuth={setAuth} isAdmin={isAdmin} setIsAdmin={setIsAdmin}/>
        <main>
          <Container>
            <Route exact path='/' render={(props) => 
              isAuth ? (<HomeScreen {...props} setAuth={setAuth}/>) : (<Redirect to="/login" />)
            } />
            <Route exact path='/signup' render={(props) => 
              !isAuth ? (<SignupScreen {...props} setAuth={setAuth} />) : (<Redirect to="/dashboard" />)
            } />
            <Route exact path='/login' render={(props) =>
              !isAuth ? (<LoginScreen {...props} setAuth={setAuth} setIsAdmin={setIsAdmin} />) : (<Redirect to="/" />)
            } />
            <Route exact path='/store' render={(props) => 
              isAuth ? (<StoreScreen {...props} setAuth={setAuth}/>) : (<Redirect to="/login" />) }/>
            <Route path='/product/:id' render={() => 
              isAuth && <ProductDetailScreen />} />
            <Route path='/transactions' render={() => 
              isAuth && <TransactionScreen />} />
            <Route path='/transactions/:id' render={() => 
              isAuth && <TransactionScreen />} />
            <Route exact path='/orders' render={() => 
              isAuth && <OrderScreen isAdmin={isAdmin}/>} />
            <Route exact path='/orders/:id/:date' render={() => 
              isAuth && <OrderScreenItem />} />
            <Route path='/payment' render={() => 
              isAuth && <CheckoutScreen />} />
            <Route path='/adminstats' render={() => 
              isAuth && isAdmin && <StatisticsScreen />} />
          </Container>
        </main>
        {/* <Footer /> */}
      </Router>
    </>
  );
}

export default App;
