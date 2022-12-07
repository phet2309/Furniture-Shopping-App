import { useState } from 'react';
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



function App() {

  const [isAuth, setIsAuth] = useState(false);

  const setAuth = (isAuthenticated: boolean) => {
    setIsAuth(isAuthenticated);
  };


  return (
    <>
      <Router>
        <Header />
        <main>
          <Container>
            <Route exact path='/' render={(props) => 
              isAuth ? (<HomeScreen {...props} setAuth={setAuth}/>) : (<Redirect to="/login" />)
            } />
            <Route exact path='/signup' render={(props) => 
              !isAuth ? (<SignupScreen {...props} setAuth={setAuth} />) : (<Redirect to="/dashboard" />)
            } />
            <Route exact path='/login' render={(props) =>
              !isAuth ? (<LoginScreen {...props} setAuth={setAuth} />) : (<Redirect to="/" />)
            } />
            <Route exact path='/store' render={(props) => <StoreScreen setAuth={setAuth}/>} />
            <Route path='/product/:id' render={(props) => <ProductDetailScreen setAuth={setAuth}/>} />
            <Route path='/transactions' render={(props) => <TransactionScreen setAuth={setAuth}/>} />
            <Route exact path='/orders' render={(props) => <OrderScreen setAuth={setAuth}/>} />
            <Route exact path='/orders/:id/:date' render={(props) => <OrderScreenItem setAuth={setAuth}/>} />
          </Container>
        </main>
        <Footer />
      </Router>
    </>
  );
}

export default App;
