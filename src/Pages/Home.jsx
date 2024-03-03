import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {Row,Card,} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';



const Home = () => {
  const navigate = useNavigate();
  
  const [playing,setplaying] = useState();
  const [Popular,setPopular] = useState();
  const [TopRated,setTopRated] = useState();
  const [upcoming,setUpComing] = useState();

  let NowPlaying = 'https://api.themoviedb.org/3/movie/now_playing?api_key=fcdffb648581b9e03083fd089658d098&language=en-US&page=1';
  let PopularMovies ='https://api.themoviedb.org/3/movie/popular?api_key=fcdffb648581b9e03083fd089658d098&language=en-US&page=1';
  let TopRatedMovies = 'https://api.themoviedb.org/3/movie/top_rated?api_key=fcdffb648581b9e03083fd089658d098&language=en-US&page=1';
  let UpcomingMovies = 'https://api.themoviedb.org/3/movie/upcoming?api_key=fcdffb648581b9e03083fd089658d098&language=en-US&page=1';

  useEffect(()=>{
    axios.get(NowPlaying).then(res=>{
      setplaying(res.data.results)
      // console.log(res.data.results)
    })
  })

  useEffect(()=>{
    axios.get(PopularMovies).then(res=>{
      setPopular(res.data.results)
      // console.log(res.data.results)
    })
  })

  useEffect(()=>{
    axios.get(TopRatedMovies).then(res=>{
      setTopRated(res.data.results)
    })
  })

  useEffect(()=>{
    axios.get(UpcomingMovies).then(res=>{
      setUpComing(res.data.results)
    })
  })


  return (
    <div>
    <Row style={{height:'570vh'}}>
        <h1 style={{color:"purple",margin:'2rem'}}>Now playing</h1>
        <div style={{margin:'2rem'}}> 
          {playing ? (
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',justifyContent:'space-evenly',height:'67vh' }}>
              {playing.map((movie,index)=>{
                return(
                  <Card onClick={()=>navigate(`/review/${movie.id}`,{state:movie} )}
                   key={index} style={{width:'350px',padding:'1rem',borderBottom:'2px solid #d6d6c2'}}>
                    <img src={ `https://image.tmdb.org/t/p/w500${movie.poster_path}`} height={450} width={350}/>
                    <h2 style={{color:"#ff3300",fontWeight:'600', fontSize:'1.5rem',textAlign:'center'}}>{movie.title}</h2>
                  </Card>
                )
              })}
            </div>
          ):(
            <div>
            nothing to dissplay
            </div>
          )}
      </div>
    </Row>

    <Row style={{height:'570vh'}}>
      <h1 style={{color:'purple',margin:'2rem'}}>Popular Movies</h1>
      <div style={{margin:'2rem'}}>
        {Popular ?(
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',justifyContent:'space-evenly',height:'67vh'}}>
            {Popular.map((movie,index)=>{
              return(
                <Card onClick={()=>navigate(`/review/${movie.id}`,{state:movie})}
                key={index} style={{width:'350px',padding:'1rem',borderBottom:'2px solid #d6d6c2'}}>
                  <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} height={450} width={350}/>
                  <h2 style={{color:"#ff3300",fontWeight:'600',fontSize:'1.5rem',textAlign:'center'}}>{movie.title}</h2>
                </Card>
              )
            })}
          </div>
        ):(
          <div>
            nothing to dissplay
            </div>
        )}
        </div>
    </Row>
    <Row style={{height:'570vh',}}>
      <h1 style={{color:'purple',margin:'2rem'}}>TopRated Movies</h1>
      <div style={{margin:'2rem'}}>
        {TopRated ?(
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',justifyContent:'space-evenly',height:'67vh',}}>
            {TopRated.map((movie,index)=>{
              return(
                <Card onClick={()=>navigate(`/review/${movie.id}`,{state:movie})}
                key={index} style={{width:'350px',padding:'1rem',borderBottom:'2px solid #d6d6c2'}}>
                  <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} height={450} width={350}/>
                  <h2 style={{color:"#ff3300",fontWeight:'600',fontSize:'1.5rem',textAlign:'center'}}>{movie.title}</h2>
                </Card>
              )
            })}
          </div>
        ):(
          <div>
            nothing to dissplay
            </div>
        )}
        </div>
    </Row>

    <Row style={{height:'570vh'}}>
      <h1 style={{color:'purple',margin:'2rem'}}>UpComing Movies</h1>
      <div style={{margin:'1.5rem'}}>
        {upcoming ?(
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',justifyContent:'space-evenly',height:'67vh',}}>
            {upcoming.map((movie,index)=>{
              return(
                <Card onClick={()=>navigate(`/review/${movie.id}`,{state:movie})}
                key={index} style={{width:'375px',padding:'1rem',borderBottom:'2px solid #d6d6c2'}}>
                  <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} height={450} width={350}/>
                  <h2 style={{color:"#ff3300",fontWeight:'600',fontSize:'1.5rem',textAlign:'center'}}>{movie.title}</h2>
              </Card>
              )
            })}
          </div>
        ):(
          <div>
          Nothing to display
          </div>
        )}
      </div>
    </Row>
    </div>
  )
}

export default Home
