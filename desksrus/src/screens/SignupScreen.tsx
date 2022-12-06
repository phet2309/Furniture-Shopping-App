import { render } from '@testing-library/react';
import { SyntheticEvent, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import FormContainer from '../components/FormContainer'

interface Props {
  setAuth: (isAuthenticated : boolean) => void;
}

const SignupScreen = ({setAuth} : Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [redirectToLogin, setRedirectToLogin] = useState(false);


  const submitHandler = async (e:SyntheticEvent) => {
    e.preventDefault();
    
    const res = await fetch('http://localhost:8000/auth/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        fname: firstName,
        lname: lastName,
        email: email,
        password: password 
      })
    });
    if(res.status === 200) {
      setRedirectToLogin(true);
    }
  }

  if (redirectToLogin) {
    return <Redirect to="/login" />;
  }

  return (
    <FormContainer>
      <h1>Signup</h1>
      <Form className="my-3" onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control type="firstName" placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control type="lastName" placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control type="email" placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </FormContainer>
  )
}

export default SignupScreen;