import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import '../assets/stylesheets/Login.css';
import { Form, Button } from 'react-bootstrap';
import { AuthContext, UserContext, AuthContextType, UserContextType } from '../context/AuthContext';
import signinIllustrator from '../assets/images/movie-watching.gif';
import axios from 'axios';
import decode from 'jwt-decode';

// Import Font Awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const auth = useContext(AuthContext) as AuthContextType;
  const user = useContext(UserContext) as UserContextType;

  const [loginForm, setLoginForm] = useState({
    userEmail: '',
    userPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const updateLoginForm = (value: object) => {
    return setLoginForm((prev) => {
      return { ...prev, ...value };
    });
  };

  const handleLoginFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loginUser = { ...loginForm };
    try {
      const response = await axios.post(
        'http://localhost:4000/login',
        JSON.stringify(loginUser),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data.isLoggedIn) {
        auth.login();
        const data: any = decode(response.data.token);
        user.setData(data);
        localStorage.setItem('loginToken', response.data.token);
        if (data.role === "admin") {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        alert(response.data.msg);
      }
    } catch (err) {
      console.log(err);
    }
    setLoginForm({
      userEmail: '',
      userPassword: '',
    });
  };

  return (
    <div className='container-fluid login'>
      <div className='row login-row'>
        <div className='col-lg-6 login-image-container'>
          <img
            src={signinIllustrator}
            alt='Img not found'
            className='login-img'
            draggable='false'
          />
        </div>
        <div className='col-lg-6 login-form'>
          <h2>Login</h2>
          <hr />
          <Form onSubmit={handleLoginFormSubmit}>
            <Form.Group className='mb-3' controlId='userEmail'>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                required
                type='email'
                placeholder='Enter email'
                value={loginForm.userEmail}
                onChange={(e) => updateLoginForm({ userEmail: e.target.value })}
              />
              <Form.Text className='text-muted'>
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className='mb-3 position-relative' controlId='userPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type={showPassword ? 'text' : 'password'}  // Toggle between 'text' and 'password'
                placeholder='Password'
                autoComplete='true'
                value={loginForm.userPassword}
                onChange={(e) =>
                  updateLoginForm({ userPassword: e.target.value })
                }
              />
              <Button
                  variant='link'
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '75%',
                    transform: 'translateY(-50%)',
                    padding: '0',
                    margin: '0',
                    lineHeight: '1',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                  }}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </Button>
            </Form.Group>

            <Button variant='primary' type='submit'>
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
