import { auth } from '../Pages/Firebase';
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import {Link,InputBase} from '@mui/material';
import{Row,Col, Button} from 'react-bootstrap';
import ELKImg from '../assets/Elk1.png';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Title from '../assets/TitleName.png'
import '../App.css'



const Signup = () => {

    const navigate = useNavigate();
    const [name,setName]= useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(auth.currentUser, {
            displayName: name,
          });
    
          console.log('Sign-up successful:', userCredential);
          navigate('/');
        } catch (err) {
          console.error('Sign-up failed:', err);
          setError('Failed to sign up. Please check your details and try again.');
        } finally {
          setLoading(false);
        }
      };
    
  return (

<div style={{ backgroundColor: 'rgba(8,9,16,255)' }}>
      <Row
        style={{display: 'flex',flexDirection: 'row',justifyContent: 'space-around',alignItems: 'center',height: '97vh',}}
      >
        <Col>
          <img src={ELKImg} height={610} width={700} alt="Elk Image" />
        </Col>
        <Col style={{ margin: '6rem' }}>
          <img src={Title} height={80} width={500} alt="Title" />

          <form onSubmit={handleSignup}>
            <div style={{ margin: '2rem 7px' }}>
              <InputBase onChange={(e) => setEmail(e.currentTarget.value)} id="email" type="emailaddress" value={email}
                placeholder="Enter Email Address"
                style={{ fontSize: '1.2rem', width: '250px', padding: '0.5rem', margin: '1rem',borderRadius: '8px',backgroundColor: 'white', color: 'crimson',fontWeight: '700', border: '3px solid teal', }}
                required autoComplete="off"
              />
              <InputBase onChange={(e) => setPassword(e.currentTarget.value)} id="password" type="password" value={password} placeholder="Enter password"
                style={{margin: '1rem',width: '250px', fontSize: '1.2rem', padding: '0.5rem', borderRadius: '8px', backgroundColor: 'white', color: 'crimson', fontWeight: '700', border: '3px solid teal',}}
                required autoComplete="off"
              />
            </div>
            <InputBase onChange={(e) => setName(e.currentTarget.value)} type="text" placeholder="Enter Fullname" value={name} id="name"
              required autoComplete="off"
              style={{ width: '545px', margin: '0rem 0 2rem 1rem', fontSize: '1.2rem', padding: '0.5rem', borderRadius: '8px',backgroundColor: 'white', color: 'crimson',fontWeight: '700',border: '3px solid teal', }}
            />
            <Button
              type="submit" disabled={loading}
              style={{ width: '530px',height: '7vh',margin: '5px 1.5rem', border: 'none', background: 'rgba(8,9,16,255)', fontSize: '1.2rem', fontWeight: '600', color: 'white',borderRadius: '10px', border: '3px solid teal',}}
            >
              {loading ? 'Signing up...' : 'Join the Club →'}
            </Button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <h3 style={{ fontSize: '1.2rem', color: 'white', margin: '2rem 8rem' }}>
            Already a member?{' '}
            <Link href="#" style={{ color: 'white' }} onClick={() => navigate('/login')}>
              Click here
            </Link>{' '}
          </h3>
        </Col>
      </Row>
    </div>

  )
}

export default Signup;
