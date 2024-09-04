import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import '../assets/stylesheets/Register.css';
import { Form, Button } from 'react-bootstrap';
import signupIllustrator from '../assets/images/signup-illustrator.png';
import axios from 'axios';
// Import Font Awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const [registerForm, setRegisterForm] = useState({
    name: '',
    userEmail: '',
    userPassword: '',
    phoneNumber: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    number: false,
  });

  const [phoneValid, setPhoneValid] = useState({
    length: false,
    numeric: true,
  });

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);

  const [hasTypedPassword, setHasTypedPassword] = useState(false);
  const [hasTypedPhone, setHasTypedPhone] = useState(false);

  const navigate = useNavigate();

  const updateRegisterForm = (value: object) => {
    return setRegisterForm((prev) => {
      return { ...prev, ...value };
    });
  };

  const validatePassword = (password: string) => {
    // Check if the password has at least 6 characters and includes at least one number
    const lengthValid = password.length >= 6;
    const numberValid = /\d/.test(password);
    setPasswordValid({ length: lengthValid, number: numberValid });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    updateRegisterForm({ userPassword: password });
    validatePassword(password);
    setHasTypedPassword(true); // Set to true when the user starts typing
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    // Check if the phone number is exactly 10 digits and only contains numbers
    const lengthValid = phoneNumber.length === 10;
    const numericValid = /^\d*$/.test(phoneNumber);
    setPhoneValid({ length: lengthValid, numeric: numericValid });
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = e.target.value;
    updateRegisterForm({ phoneNumber });
    validatePhoneNumber(phoneNumber);
    setHasTypedPhone(true); // Set to true when the user starts typing
  };

  const handleRegisterFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const newUser = { ...registerForm };

    try {
      const response = await axios.post(
        'http://localhost:4000/register',
        JSON.stringify(newUser),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      alert(response.data);
    } catch (err) {
      console.log(err);
    }

    setRegisterForm({
      name: '',
      userEmail: '',
      userPassword: '',
      phoneNumber: '',
    });
    setPasswordValid({ length: false, number: false });
    setPhoneValid({ length: false, numeric: true });
    setHasTypedPassword(false);
    setHasTypedPhone(false);
    navigate('/login');
  };

  return (
    <div className='container-fluid register'>
      <div className='row register-row'>
        <div className='col-lg-6 register-form'>
          <h2>Register with us</h2>
          <hr />
          <Form onSubmit={handleRegisterFormSubmit}>
            <Form.Group className='mb-3' controlId='name'>
              <Form.Label>Username</Form.Label>
              <Form.Control
                required
                type='text'
                placeholder='Enter Username'
                value={registerForm.name}
                onChange={(e) => updateRegisterForm({ name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='userEmail'>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                required
                type='email'
                placeholder='Enter email'
                value={registerForm.userEmail}
                onChange={(e) =>
                  updateRegisterForm({ userEmail: e.target.value })
                }
              />
              <Form.Text className='text-muted'>
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className='mb-3' controlId='userPassword'>
              <Form.Label>Password</Form.Label>
              <div
                className='password-container'
                style={{ position: 'relative' }}
              >
                <Form.Control
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                  autoComplete='true'
                  value={registerForm.userPassword}
                  onChange={handlePasswordChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  style={{
                    borderColor: hasTypedPassword
                      ? passwordValid.length && passwordValid.number
                        ? 'green'
                        : 'red'
                      : undefined,
                    paddingRight: '2.5rem', // Make space for the icon
                  }}
                />
                <Button
                  variant='link'
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '0',
                    margin: '0',
                    lineHeight: '1',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    color: 'blue', // Set color to blue
                  }}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </Button>
              </div>
              {isPasswordFocused && (
                <>
                  {!passwordValid.length && (
                    <Form.Text className='text-danger'>
                      Password must be at least 6 characters long.
                    </Form.Text>
                  )}
                  {!passwordValid.number && (
                    <Form.Text className='text-danger'>
                      Password must contain at least one number.
                    </Form.Text>
                  )}
                </>
              )}
            </Form.Group>

            <Form.Group className='mb-3' controlId='phoneNumber'>
              <Form.Label>Phone Number</Form.Label>
              <div style={{ position: 'relative' }}>
                <Form.Control
                  required
                  type='tel'
                  placeholder='Enter Phone Number'
                  value={registerForm.phoneNumber}
                  onChange={handlePhoneNumberChange}
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => setIsPhoneFocused(false)}
                  style={{
                    borderColor: hasTypedPhone
                      ? phoneValid.length && phoneValid.numeric
                        ? 'green'
                        : 'red'
                      : undefined,
                  }}
                />
              </div>
              {isPhoneFocused && (
                <>
                  {!phoneValid.length && (
                    <Form.Text className='text-danger'>
                      Phone number must be exactly 10 digits.
                    </Form.Text>
                  )}
                  {!phoneValid.numeric && (
                    <Form.Text className='text-danger'>
                      Phone number must contain only numbers.
                    </Form.Text>
                  )}
                </>
              )}
            </Form.Group>

            <Button
              variant='primary'
              type='submit'
              disabled={
                !passwordValid.length ||
                !passwordValid.number ||
                !phoneValid.length ||
                !phoneValid.numeric
              }
            >
              Submit
            </Button>
          </Form>
        </div>
        <div className='col-lg-6 register-image-container'>
          <img
            src={signupIllustrator}
            alt='Img not found'
            className='signup-img'
            draggable='false'
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
