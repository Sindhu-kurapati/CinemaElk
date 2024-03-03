import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Button, Card, Form, Container } from 'react-bootstrap';
import axios from 'axios';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './Firebase';
import { auth } from '../Pages/Firebase';
import RatingStar from 'react-rating-stars-component';
import wrong from '../assets/wrong.png';
import '../App.css';

const Image_API = 'https://image.tmdb.org/t/p/w500';

const Review = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const movie = location.state || {};
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [databaseReviews, setDatabaseReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isReviewFormActive, setIsReviewFormActive] = useState(false);
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);

  useEffect(() => {
  }, [movie.id]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = auth.currentUser;
      if (user) {
        setCurrentUser({
          username: user.displayName,
          userLogo: user.photoURL,
        });
      }
    };
    fetchCurrentUser();
  }, []);
  
  useEffect(() => {
    localStorage.setItem('review', userRating || 0 );
  }, [userRating]);

  const AllUsers = async () => {
    const Id = Math.floor(Math.random() * 10000);
    const collectionReference = collection(db, 'reviews');
    const user = auth.currentUser;
    const username = currentUser?.username || (user ? user.displayName : '');
    const userLogo = currentUser?.userLogo || (user ? user.photoURL : '');
    try {
      await addDoc(collectionReference, {
        reviewText: reviewText,
        rating: parseFloat(userRating),
        reviewId: Id,
        username:username,
        userData: {
          userLogo: userLogo,
          username: username,
        },
        movieData: {
          movieImg: Image_API + movie.poster_path,
          movieId: movie.id,
        },
      });
     
      const updatedReviews = [];
      const reviewsSnapshot = await getDocs(collectionReference);
      reviewsSnapshot.forEach((doc) => {
        updatedReviews.push(doc.data());
      });
     
      setReviews(updatedReviews);
      
      setShowReviewForm(false);
      setUserRating('');
      setDatabaseReviews(updatedReviews);
      setIsReviewSubmitted(true);
        
        setShowReviewForm(false);
        setIsReviewFormActive(false);
        setIsReviewSubmitted(false);
        
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    AllUsers();
  };

  useEffect(() => {
    const fetchReviews = async () => {
      if (movie.id) {
        try {
          const reviewsCollection = collection(db, 'reviews');
          const querySnapshot = await getDocs(reviewsCollection);
          const reviewsData = [];
          querySnapshot.forEach((doc) => {
            reviewsData.push(doc.data());
          });
          setDatabaseReviews(reviewsData);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      }
    };

    fetchReviews();
  }, [movie.id]);

  useEffect(() => {
    if (movie.id) {
      const SimilarMovies_API = `https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=fcdffb648581b9e03083fd089658d098&language=en-US&page=1`;
      axios.get(SimilarMovies_API).then((res) => {
        setSimilar(res.data.results);
      });
    }
  }, [movie.id]);

  useEffect(() => {
    if (movie.id) {
      const CastCrew_API = 'https://randomuser.me/api/?results=12';
      axios.get(CastCrew_API).then((res) => {
        setCast(res.data.results);
      }).catch((err) => {
        console.error(err);
      });
    }
  }, [movie.id]);

  const handlePostReviewClick = () => {
    setShowReviewForm(true);
    setIsReviewFormActive(true);
  };

  const wrongClick = () => {
    setShowReviewForm(false);
    setIsReviewFormActive(false);
  };

  return (
    <div>
      <div className={isReviewFormActive ? 'overlay' : ''}></div>
      <div style={{ height: '470vh', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }} className='review-page'>
        <Container>
          <Row style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <Col style={{ margin: '3rem',width:'600px'}}>
              <div>
                <img src={movie.poster_path ? Image_API + movie.poster_path : ''} alt={movie.title} height={400} width={300} />
                <h2 style={{color:'#000066'}}>{movie.title}</h2>
              </div>
              <div>
                {showReviewForm && !isReviewSubmitted ? (
                  <Form className={isReviewFormActive ? 'overlay' : ''}
                  style={{ border: '1px solid grey', margin: '1rem', borderRadius: '20px',position:'fixed',top:'150px',left:'450px',backgroundColor:'white',width:'500px',height:'50vh',zIndex: 1001}}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                      <img src={wrong} alt="Wrong" onClick={wrongClick} />
                    </div>
                    <Form.Group style={{ borderBottom: '2px solid grey', width: '90%', margin: ' auto' }} controlId="formReview">
                      <Form.Control
                        style={{ border: 'none', borderRadius: '10px', height: '100px', width: '350px', padding: 20, outline: 'none',maxHeight:'200px',overflow:'auto',fontSize:'15px' }}
                        rows={3} as="textarea" placeholder="Enter your Review Here" onChange={(e) => setReviewText(e.target.value)}
                      />
                    </Form.Group>
                    <div style={{ margin: 20, display: 'flex', alignItems: 'center' }}>
                      Rating of Stars
                      <Form.Control className='form-page-input y'
                        style={{ marginLeft: 7,marginRight: 7, width: 30,border: '2px solid grey',padding: 2,textAlign: 'center',borderRadius: '0px',}}
                        rows={3} value={userRating === null ? '' : userRating}
                        onChange={(e) => setUserRating(e.currentTarget.value !== '' ? parseFloat(e.currentTarget.value) : null)} 
                      />{' '}
                      Out Of 5
                    </div>
                    <Button variant='primary' type='submit' onClick={handleSubmit} style={{margin:'1rem 1rem 2rem 2rem',backgroundColor:'teal',borderRadius:'5px',color:'white',border:'none',height:'5vh',width:'150px'}}>
                      Submit Review
                    </Button>
                  </Form>
                ) : (
                  <Button style={{backgroundColor:'teal',color:'white',border:'none',fontWeight:'500',borderRadius:'5px',width:'200px',height:'5vh'}} onClick={handlePostReviewClick}>Post Review</Button>
                )}
              </div>
              <h4 style={{color:'#ff3300',fontWeight:'900'}}>Movie Overview :</h4>
              <p style={{ width: 400, color:"#00334d",fontWeight:'500'}}>{movie.overview}</p>
              <h2 style={{color:'#990033'}}>Cast & Crew</h2>
              <div>
                {cast ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)' }}>
                    {cast.map((user, index) => (
                      <div key={index}>
                        <img src={user.picture.large} alt={user.name.first} height={60} width={60} style={{ borderRadius: '50%' }} />
                        <h4 style={{color:'black'}}>{user.name.first}</h4>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No cast available</p>
                )}
              </div>
              <h2 style={{color:'#ff3300'}}>Similar Movies</h2>
              {similar ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
                  {similar.map((similarMovie, index) => (
                    <div key={index}>
                      <Card onClick={() => navigate(`/review/${similarMovie.id}`, { state: similarMovie })} key={similarMovie.id} style={{height:'40vh'}}>
                        <Card.Img src={`https://image.tmdb.org/t/p/w500${similarMovie.poster_path}`} alt={similarMovie.title} height={200} width={170}/>
                        <Card.Body>
                          <Card.Title style={{color:'purple',fontWeight:'700'}}>{similarMovie.title}</Card.Title>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{color:'white'}}>No similar movies available</p>
              )}
            </Col>
            <Col style={{width:'500px'}}>
              <h1 style={{ margin: '2rem',color:'#cc0099' }}>Reviews By Cinema ELK Users</h1>
              <div>
                {databaseReviews
                  .filter((review) => review.movieData && review.movieData.movieId === movie.id)
                  .map((review, index) => {
                    const { userLogo, username } = review.userData|| currentUser || {};
                    return (
                      <div key={index} style={{ display:'flex',justifyContent:'space-between',border: '2px solid grey', borderRadius: '20px', margin: '1rem', padding: '1rem',width:'auto',height:'auto',backgroundColor:'#ffeee6' }}>
                        <div style={{display:'flex',flexDirection:'column'}}>
                          <div style={{ display: 'flex',flexDirection:'row', alignItems: 'center',borderBottom:'2px solid grey' }}>
                            {userLogo ? (
                              <img src={'https://ui-avatars.com/api/?size=100&name=' + username} height={50} style={{borderRadius:'50%',backgroundColor:'crimson'}}/>
                            ) : (
                              <img src={'https://ui-avatars.com/api/?size=100&name=' + username} height={50} style={{borderRadius:'50%',backgroundColor:'crimson'}}/>
                            )}
                            {username && <h2 style={{marginLeft:'1rem',color:'#000066'}}>{username}</h2>}
                          </div>
                          <div style={{ width: '320px', overflowWrap: 'break-word'}}>
                            <p style={{color:"#ff3300",fontWeight:'600'}}>{review.reviewText}</p>
                            <RatingStar edit={false} isHalf={false} size={30} activeColor="#ffff1a" value={parseFloat(review.rating)} />
                          </div>
                        </div>
                        <h4>{review.movieData ? <img src={review.movieData.movieImg} alt={movie.title} height={120} width={80} /> : ''}</h4>
                      </div>
                    );
                  })}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Review;







