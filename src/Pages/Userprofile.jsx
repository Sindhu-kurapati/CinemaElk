import React, { useEffect, useState } from 'react';
import { Card, Button,Modal } from 'react-bootstrap';
import DeleteImg from '../assets/Delete.png';
import EditImg from '../assets/Edit.png';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'; 
import { auth } from '../Pages/Firebase';
import RatingStar from 'react-rating-stars-component';

const UserProfile = () => {
  
    const [userProfile,setUserProfile] = useState(null);
    const[userReviews,setUserReviews] = useState([]);
    const [loading,setLoading] = useState(true);
    const[editMode,setEditMode] = useState(null);
    const [editedReviewText,setEditedReviewText] = useState(null);
    const [editedRating, setEditedRating] = useState(0);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);

useEffect(()=>{
  const fetchUserProfile = async () =>{
    const user = auth.currentUser;
    if(user){
      setUserProfile({
        username : user.displayName,
        userLogo : user.photoURL,
      });
    }
  }
  fetchUserProfile();
},[]);

useEffect(()=>{
  const fetchUserReviews = async()=>{
    try{
      const db = getFirestore();
      const reviewsCollection = collection(db,'reviews');
      const reviewsSnapshot = await getDocs(reviewsCollection);

      const reviewsData = reviewsSnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .filter((review) => {
          const reviewUsername = review.userData?.username;
        return reviewUsername && reviewUsername === auth.currentUser.displayName;
        });
      setUserReviews(reviewsData);
      setLoading(false);
    }catch(error){
      console.log('error fetching reviews:',error);
      setLoading(false);
    }
  };
  fetchUserReviews();
},[])

const handleDeleteReview = async(reviewId)=>{
  try{
    const db = getFirestore();
    const reviewDocRef = doc(db,'reviews',reviewId);
    await deleteDoc(reviewDocRef);

    setUserReviews((prevReviews)=>prevReviews.filter((review)=>review.id !== reviewId));
    setShowDeleteConfirmation(false);
    setReviewToDelete(null);
  }catch(error){
    console.log('Error deleting review:',error);
  }
};

const handleEditReview = (review)=>{
  setEditMode(review.id);
  setEditedReviewText(review.reviewText);
  setEditedRating(review.rating);
}

const handleSaveReview = async(reviewId)=>{
  try{
    const db = getFirestore();
    const reviewDocRef = doc(db,'reviews',reviewId);

    await updateDoc(reviewDocRef,{
      reviewText: editedReviewText,
      rating: editedRating,
    });
    setUserReviews((prevReviews)=>prevReviews.map((review)=>review.id === reviewId ? {...review,reviewText:editedReviewText,rating:editedRating}
    : review
      )
    );
    setEditMode(null);
    setEditedReviewText('');
    setEditedRating(0);
  }catch(error){
    console.error('Error saving edited review:',error);
  }
};

const handleCancelEdit = () => {
  setEditMode(null);
  setEditedReviewText('');
  setEditedRating(review.rating);
};

const handleDeleteConfirmation = (reviewId)=>{
  setShowDeleteConfirmation(true);
  setReviewToDelete(reviewId);
};


  return (
  <div>
      <h2 style={{ color: '#ff3300', fontWeight: '600', marginLeft: '1rem' }}>
        User Details:
      </h2>
      {loading ? (
        <h4>Loading....</h4>
      ) : userProfile ? (
        <div>
          <h3 style={{ color: 'purple', marginLeft: '1rem' }}>
            {' '}
            Username : {userProfile.username}
          </h3>
          {userProfile.userLogo && (
            <img src={userProfile.userLogo}  alt={userProfile.username} style={{ width: '100px', height: '100px', borderRadius: '50%', }} />
          )}
          <h2 style={{ marginLeft: '1rem', color: '#000066' }}>My Reviews</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', }}>
            {userReviews.map((review) => (
              <Card key={review.id} style={{ border: '2px solid grey', borderRadius: '20px', margin: ' 2rem 4rem', backgroundColor: '#ffeee6', padding: '1rem', }}>
                <Card.Body>
                  <div style={{ display: 'flex', width: '500px', }}>
                    <div style={{ display: 'flex', flexDirection: 'column', }}>
                    {userProfile && (
                      <div style={{ display: 'flex', borderBottom: '1px solid black', width: '300px', }}>
                          <img src={'https://ui-avatars.com/api/?size=100&name=' + userProfile.username} height={50} style={{borderRadius:'50%',backgroundColor:'crimson'}}/>
                          <h2 style={{margin:'1rem',color:'#000066'}}>{userProfile.username}</h2>
                      </div>
                    )}
                      <Card.Text style={{ width: '310px', height: 'auto', padding: '1rem', overflowWrap: 'break-word', }}>
                        {editMode === review.id ? (
                          <div>
                            <RatingStar
                              value={editedRating}
                              onStarClick={(newRating) => setEditedRating(newRating)}
                              size={24}
                              isHalf={true}
                            />
                            <textarea value={editedReviewText} onChange={(e) => setEditedReviewText(e.target.value)} style={{ width: '100%', height: '80px' }} />
                            <Button onClick={() => handleSaveReview(review.id)} style={{background:'black',color:'white',border:'none',margin:'10px',cursor:'pointer'}}>Save</Button>
                            <Button onClick={handleCancelEdit} style={{background:'white',color:'black',border:'2px solid black',margin:'10px',cursor:'pointer'}}>Cancel</Button>
                          </div>
                        ) : (
                          <div>
                            <RatingStar value={editMode === null ? review.rating : editedRating} onChange={(newRating) => {
                              if (editMode === null) {
                                    handleEditReview(review);
                                  }
                                }}
                                size={24} isHalf={true} editMode={true} readOnly/>
                            <h5>{review.reviewText}</h5>
                          </div>
                        )}
                      </Card.Text>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>
                          <img onClick={() => handleDeleteConfirmation(review.id)} src={DeleteImg} height={50} width={50} alt="Delete"  style={{cursor:'pointer'}}/>
                          <img onClick={() => handleEditReview(review)} src={EditImg} height={50} width={50} alt="Edit" style={{cursor:'pointer'}}/>
                      </div>
                    </div>
                    <div>
                      <img onClick={()=>navigate(`/review/${movieId}`)} src={review.movieData?.movieImg} alt={review.movieData?.movieTitle} height={150} width={150} />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <h5>User not found</h5>
      )}
      <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
        <Modal.Body style={{ fontSize: '15px', margin: 'auto 8rem', fontWeight: '600' }}>
          Are you sure you want to delete this review?
        </Modal.Body>
        <Modal.Footer style={{ margin: '0 7rem' }}>
          <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)} style={{ margin: '1rem', background: 'linear-gradient(to bottom,teal,white)', width: '100px', height: '4vh', border: 'none', fontWeight: '600', borderRadius: '5px' }}>
             Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDeleteReview(reviewToDelete)} style={{ margin: '1rem', background: 'linear-gradient(to bottom,red,white)', width: '100px', height: '4vh', border: 'none', fontWeight: '600', borderRadius: '5px' }} >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  
  )
};

export default UserProfile;
