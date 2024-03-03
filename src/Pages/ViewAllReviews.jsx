import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import RatingStar from 'react-rating-stars-component';
import { useNavigate, useParams ,Link} from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { auth } from '../Pages/Firebase';

const MovieReview = () => {
  
  const navigate = useNavigate();
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedReviews, setExpandedReviews] = useState([]);

  useEffect(() => {
    
    const fetchReviews = async () => { 
      try {
        const db = getFirestore();
        const reviewsCollection = collection(db, 'reviews');
        const reviewsSnapshot = await getDocs(reviewsCollection);
        const reviewsData = reviewsSnapshot.docs.map((doc) => ({ ...doc.data() }));
        setUserReviews(reviewsData);
        setExpandedReviews(Array(reviewsData.length).fill(false));
        setLoading(false);
        // console.log('Reviews data:', reviewsData); 
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleUserProfileClick = (username) => {
    const userReviewsData = userReviews.filter((review) => review.userData.username === username);
  
    navigate(`/profileimage/${username}`, { state: { reviews: userReviewsData } });
  };
  const handlePosterClick = (movieId) => {
    navigate(`/review/${movieId}`);
  };

  const handleReadMoreClick = (index) => {
    setExpandedReviews((prevExpandedReviews) => {
      const updatedExpandedReviews = [...prevExpandedReviews];
      updatedExpandedReviews[index] = !updatedExpandedReviews[index];
      return updatedExpandedReviews;
    });
  };

  return (
    <div>
    <h2 style={{color:'#cc0099',margin:'2rem'}}>Reviews By the Cinema ELK Users</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
      {loading ? (
        <p>Loading....</p>
      ) : userReviews && userReviews.length > 0 ? (
          userReviews
          .filter((review) => !review.deleted) 
          .map((review, index) => {
            const { rating, movieData, reviewText, userData } = review;
          const movieId = movieData?.movieId;
          const movieImg = movieData?.movieImg;

          const username = userData?.username || 'Unknown';
          const userLogo = userData?.userLogo || 'https://ui-avatars.com/api/?size=100&name=' + username;
          return (
            <div key={index}>
              <Card style={{backgroundColor:'#ffeee6' ,border: '2px solid grey', borderRadius: '10px', padding: '1rem', margin: '3rem', width: '500px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', borderBottom: '1px solid black', paddingBottom: '1rem' }}>
                      <Link to={`/profileimage/${username}`} state={{ reviews: userReviews }}>
                        <Card.Img onClick={() => handleUserProfileClick(username)} width={60} height={60} src={userLogo} alt={`User ${username}`} style={{ borderRadius: '50%' }} />
                      </Link>
                      <h2 style={{ marginLeft: '1rem',color:'#000066' }}>{username}</h2>
                    </div>
                    <Card.Text style={{ width: '350px', overflowWrap: 'break-word', height: expandedReviews[index] ? 'auto' : '40px',overflow: 'hidden', color:"#ff3300",fontWeight:'600' }}>
                      {reviewText}
                    </Card.Text>
                    <Button onClick={() => handleReadMoreClick(index)} style={{width:'150px',backgroundColor:'teal',border:'none',borderRadius:'10px',color:'white',height:'5vh',cursor:'pointer'}}>
                      {expandedReviews[index] ? 'Read Less' : 'Read More'}
                    </Button>
                    <RatingStar edit={false} isHalf={false} size={30} activeColor={parseFloat(rating) >= 1 ? '#ffff00' : '#808080'} value={parseFloat(rating)} />
                  </div>
                  <div>
                    <Link to={`/review/${movieId}`} state={{ movie: movieData }}>
                      <Card.Img onClick={() => handlePosterClick(movieId)} src={movieImg} width={100} height={100} alt={`Movie ${movieId}`} />
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          );
        })
      ) : (
        <p>No reviews available</p>
      )}
    </div>
  </div>
  );
};

export default MovieReview;
