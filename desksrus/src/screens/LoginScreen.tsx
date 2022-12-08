import { SyntheticEvent, useState } from 'react'
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface Props {
  setAuth: (isAuthenticated : boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

const LoginScreen = ({setAuth, setIsAdmin} : Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = async (e:SyntheticEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: email,
        password: password 
      })
    });

    const parseRes = await res.json();
    if (parseRes.token) {
      localStorage.setItem("token", parseRes.token);
      localStorage.setItem("isAdmin", parseRes.isAdmin)
      setAuth(true);
      if(parseRes.isAdmin) setIsAdmin(true)
    } else {
      setAuth(false);
      toast.error(parseRes);
    }

  }


  return (
    <FormContainer>
      <h1>Login</h1>
      <Form className="my-3" onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Enter email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <ToastContainer />
    </FormContainer>
  )
}

export default LoginScreen