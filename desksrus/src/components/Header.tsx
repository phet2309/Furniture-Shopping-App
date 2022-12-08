import React, { SyntheticEvent, useState } from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap';
import { toast } from 'react-toastify';


const Header = ({isAuth, setAuth, isAdmin, setIsAdmin} : any) => {
  const handleLogOut = async (e:SyntheticEvent) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      console.log("Logging out")
      setAuth(false);
      setIsAdmin(false);
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      toast.success("Logout successfully");
    } catch (err) {
      
    }
}
  return (
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
      <Container>
        <Navbar.Brand href="/">DesksRus</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!isAuth && <Nav.Link href="/signup">SignUp</Nav.Link> }
            {!isAuth && <Nav.Link href="/login">Login</Nav.Link> }
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            {isAuth && <Nav.Link href="/store">Store</Nav.Link>}
            {isAuth && <Nav.Link href="/orders">Orders</Nav.Link>}
            {isAuth && <Nav.Link href="/transactions">Transactions</Nav.Link>}
            {isAuth && isAdmin && <Nav.Link href="/adminstats">Statastics</Nav.Link>}
            {isAuth && <Nav.Link href="/" onClick={e => handleLogOut(e)}>Logout</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


export default Header

