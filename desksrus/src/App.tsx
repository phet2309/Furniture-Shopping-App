import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import StoreScreen from './screens/StoreScreen';



function App() {

  const [isAuth, setIsAuth] = useState(true);

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
            <Route exact path='/store' render={StoreScreen} />
          </Container>
        </main>
        <Footer />
      </Router>
    </>
  );
}

export default App;
