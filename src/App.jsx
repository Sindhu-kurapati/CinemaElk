
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Home from './Pages/Home';
import Review from './Pages/MovieDetailspage';
import MovieReview from './Pages/ViewAllReviews';
import ProfileImage from './Pages/ProfileImageClick';
import Profile from './Pages/Userprofile';
import TitleName from './assets/Title.png';
import TitleLogo from './assets/Elk8.png';
import Homebtn from './assets/Home.png';
import Reviewsbtn from './assets/Movie.png';
import Userbtn from './assets/Profile.png';

import { Nav,Navbar,Button,Row,Col } from 'react-bootstrap';
import { Routes,Route, useNavigate, useParams,useLocation} from 'react-router-dom';
import { useEffect, useState } from 'react';
import {auth} from './Pages/Firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './App.css';

function App() {

  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [activeButton, setActiveButton] = useState('');
  const users = auth.currentUser;

  useEffect(()=>{
    const unSubscribe = onAuthStateChanged(auth,(user)=>{
      if(user){
        navigate('/');
        //user is logged in
      }
      else{
        navigate('/login');
        //user is logged out
      }
    });
    return()=>unSubscribe();
  },[]);

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === '/') {
      setActiveButton('home');
    } else if (pathname === '/moviereview') {
      setActiveButton('moviereview');
    } else if (pathname.startsWith('/userprofile')) {
      setActiveButton('profile');
    } else {
      setActiveButton('');
    }
  }, [location.pathname]); 

  
  

const name = localStorage.getItem('name');

//logout
const handleLogout = () =>{
  signOut(auth).then(()=>{
    console.log('Logout successful');
    navigate('/login')
  }).catch(err=>{
    console.log('LogOut Error',err);
  });
};

  const handleHomeLogin = ()=>{
    navigate('/');
  };

  const handleMoviesLogin = ()=>{
    const movieData = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US';
    if(movieData){
      navigate('/moviereview',{state:{movie:movieData}});
    }else{
      console.error('Movie data not available for ID:');
    }
  };
    
  const handleProfileLogin = ()=>{
    navigate('/userprofile/:username');
  };

  return (
    <div style={{backgroundColor:'#f5f5f0'}}>
          {users && 
          <Navbar>
              <Navbar.Brand style={{backgroundColor:'rgba(0,150,136,255)',display:'flex',justifyContent:'space-between',fontSize:'1.7rem', cursor:"pointer",height:'15vh',borderBottom:'3px solid grey',width:'100%'}} 
                  onClick={()=>navigate('/')}>
                    <div style={{display:'flex',justifyContent:'space-evenly',margin:'0.5rem'}}>
                        <img alt="" src={ TitleLogo } width="70" height="70" className="d-inline-block align-top accordion "/>{' '}{' '}{' '}{' '}{' '}{' '}
                        <img alt="" src={ TitleName } width="250" height="40" className="d-inline-block align-top" style={{margin:'1.5rem 1px'}}/>
                    </div>
                    <Button style={{width:'150px',height:'5vh',backgroundColor:' #cc0000',border:'none',color:'white',fontWeight:'700',margin:'2rem',borderRadius:'30px'}} className='logout-bt' onClick={handleLogout}>Log Out</Button>
              </Navbar.Brand>
            </Navbar>
          }
          <Row style={{display:'flex'}}>
              {users && 
              <Col style={{borderRight:'2px solid grey'}}>
                <Nav style={{display:"flex",flexDirection:'column', alignItems:"center",margin:' 5rem 1rem'}}>
                  
                  <div onClick={() => setActiveButton('home')} style={{ backgroundColor: activeButton === 'home' ? '#ffcc66' : 'white', borderRadius: '10px', padding: '5px', margin: '2rem 0 ' }}>
                    <Nav.Link onClick={handleHomeLogin}>
                      <img src={Homebtn} width="50" height="50" alt="Home button logo" />
                    </Nav.Link>
                  </div>

                  <div onClick={() => setActiveButton('moviereview')} style={{ backgroundColor: activeButton === 'moviereview' ? '#ffcc66' : 'white', borderRadius: '10px', padding: '5px', margin: '2rem 0 ' }}>
                    <Nav.Link onClick={handleMoviesLogin}>
                      <img src={Reviewsbtn} width="50" height="50" alt="Reviews button logo" />
                    </Nav.Link>
                  </div>

                  <div onClick={() => setActiveButton('profile')} style={{ backgroundColor: activeButton === 'profile' ? '#ffcc66' : 'white', borderRadius: '10px', padding: '5px', margin: '2rem 0 ' }}>
                    <Nav.Link onClick={handleProfileLogin}>
                      <img src={Userbtn} width="50" height="50" alt="User logo" />
                    </Nav.Link>
                  </div>

                </Nav>
              </Col>
              }
              <Col>
                <Routes>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/signup' element={<Signup/>}/>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/review/:id' element={<Review/>} />
                    <Route path='/moviereview' element={< MovieReview/>}/>
                    <Route path='/profileimage/:userId' element={<ProfileImage/>}/>
                    <Route path='/userprofile/:username' element={<Profile/>}/>
                  </Routes>
              </Col>
          </Row>

    </div>
  )
}

export default App;




