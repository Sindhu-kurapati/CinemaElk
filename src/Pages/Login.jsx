import { auth } from '../Pages/Firebase';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {Link as MuiLink,InputBase} from '@mui/material';
import{Row,Col, Button} from 'react-bootstrap';
import ELKImg from '../assets/Elk1.png';
import { useNavigate } from 'react-router-dom';

import { useState } from 'react';
import Title from '../assets/TitleName.png';
import '../App.css'


const Login = () => {
    const navigate = useNavigate()
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    async function handleLogin() {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          console.log('Login successful:', userCredential.user);
          navigate('/');
        } catch (error) {
          console.error('Login failed:', error.message);
          navigate('/signup')
        }
      }

  return (
    <div style={{backgroundColor:'rgba(8,9,16,255)'}}>
    <Row style={{display:'flex',flexDirection:'row',justifyContent:'space-around',alignItems:'center',height:'97vh',maxWidth:'auto'}}>
        <Col>
            <img src={ELKImg} height={620} width={700}/>
        </Col>
        <Col style={{margin:'6rem'}}>
            <img src={Title} height={80} width={500}/>
            <div style={{margin:'2rem 7px',}}>
                <InputBase onChange={(e)=>setEmail(e.currentTarget.value)} id='emailaddress' type='email' value={email} placeholder='Enter Email Address' style={{fontSize:'1.2rem',padding:'0.5rem',margin:'1rem',borderRadius:'8px',backgroundColor:'white', color:'crimson',fontWeight:'700',border:'3px solid teal'}}/> 
                <InputBase onChange={(e)=>setPassword(e.currentTarget.value)} id='password' type='password' value={password} placeholder='Enter password' style={{margin:'1rem',fontSize:'1.2rem',padding:'0.5rem',borderRadius:'8px',backgroundColor:'white', color:'crimson',fontWeight:'700',border:'3px solid teal'}}/>
            </div>
            <Button onClick={handleLogin}
             style={{width:'530px',height:'7vh',margin:'5px 3rem',border:'none',background:'rgba(8,9,16,255)',fontSize:'1.2rem',fontWeight:'600',color:'white',border:'3px solid teal',borderRadius:'10px'}}>Login &nbsp; &nbsp; →</Button>
            <h3 style={{fontSize:'1.2rem',color:'white',margin:'2rem 8rem'}}>Join the Club, <MuiLink href="#" style={{color:'white',}} onClick={()=>navigate('/signup')}>Click here</MuiLink> </h3>
        </Col>
    </Row>
    </div>
  )
}

export default Login;




