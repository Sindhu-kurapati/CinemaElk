import React from 'react';
import {Card} from 'react-bootstrap';
import RatingStars from 'react-rating-stars-component';
import { useLocation,useParams } from 'react-router-dom';

const ProfileImageClick = () => {
  const { userId } = useParams();
    const location = useLocation();

    console.log("userId:", userId);
    console.log("location.state:", location.state);

    if (!location.state || !location.state.reviews || location.state.reviews.length === 0) {
      return <h4>No user reviews available.</h4>;
    }

  const userReviews = location.state.reviews;
  console.log("userReviews:", userReviews);

  const filteredReviews = userReviews.filter((review) => review.userData.username === userId);
  console.log("filteredReviews:", filteredReviews);

  return (
    <div>
    <h2 style={{color:'#cc0099',margin:'2rem'}}>Reviews Given By {filteredReviews[0]?.userData?.username}</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', margin:'1rem' }}>
      {filteredReviews.map((review, index) => (
        <Card key={index} style={{ display: 'flex', flexDirection: 'column', border: '2px solid grey',borderRadius:'20px', width: '550px',margin:'2rem',backgroundColor:'#ffeee6'}}>
          <div style={{ display: 'flex', margin: '1rem',}}>
            <div>
              <div style={{display:'flex',alignItems:"center", marginBottom:'1rem',borderBottom:'1px solid black',width:'300px'}}>
                <Card.Img src={`https://ui-avatars.com/api/?size=100&name=${review.userData.username}`} height={50} style={{borderRadius:"50%"}} />
                <h2 style={{marginLeft:'1rem',color:'#000066'}}>{review.userData.username}</h2>
              </div>
              <div style={{margin:'1rem'}}>
                <p style={{width:'300px',height:'auto',overflowWrap: 'break-word',color:"#ff3300",fontWeight:'600'}}>{review.reviewText}</p>
                <RatingStars value={review.rating} edit={false} size={24} activeColor="#ffd700" />
              </div>
            </div>
            <Card.Img src={review.movieData.movieImg} height={250} width={200} />
          </div>
        </Card>
      ))}
    </div>
  </div>
  )
}
export default ProfileImageClick;
