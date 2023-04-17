import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  Skeleton,
  Avatar 
} from "@mui/material";
import { Link } from "react-router-dom";

import logo from '../../images/logo.png';

const WelcomeResponse = ({ userInfo, handleNext, apiUrl  }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const submitHandler = (event) => {
    event.preventDefault();
   
    // Move to the next step
    handleNext(response.userId);
  };

  useEffect(() => {
 
    if (userInfo) {
      const fetchData = async () => {
        setIsLoading(true);

        try {
            // Send a POST request to the backend to save the user's dietary information
            // Get the welcome message from the OpenAI API
            //${process.env.REACT_APP_BASE_API_URL}
            const response = await fetch(`${apiUrl}/users`, {
              method: 'POST',
              body: userInfo,
              headers: { 'Content-Type': 'application/json' },
            });
        
            if (!response.ok) {
                throw new Error(`Something went wrong. Please check if you have entered your information correctly and try again. ${<Link to="/dashboard" style={{ textDecoration: 'none', color: '#FFF' }}>Reload this page.</Link>}`);

              return;
            }
        
            const planData = await response.json();
        
            //setWelcomeMessage(planData);
            setIsLoading(false);
            setResponse(planData);
            setError(null);
        
       
          } catch (error) {
                setError(error.message);
              //  setResponse(null);
                setIsLoading(false);
            }
        
            setIsLoading(false);

      };
      fetchData();
    }
  }, [userInfo]);

  return (
    <Box className="relative max-w-6xl mx-auto h-0" textAlign='center' m="auto">
      <Typography variant="h5" className="text-center">Step 2: Welcome Response</Typography>
      <Box component="form" onSubmit={submitHandler} sx={{ mt: 2 }}>
       
      {isLoading || response != null || error != null? (

<Card sx={{ m: 2 }}>
   <CardHeader
   sx={{
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'space-between',
     p: 2,
     bgcolor: '#0072c6',
     borderBottom: '1px solid #dfe2e1',
   }}
   avatar={
     isLoading ? (
       <Skeleton
         animation="wave"
         variant="circular"
         width={40}
         height={40}
       />
     ) : (
       <Avatar
         alt="C.H.A.N.G.E. 360"
         src={logo}
         sx={{ width: '40px', height: '40px', borderRadius: '0.2rem' }}
       >
         C
       </Avatar>
     )
   }
   title={
     isLoading ? (
       <Skeleton
         animation="wave"
         height={10}
         width="80%"
         style={{ marginBottom: 6 }}
       />
     ) : (
       <Typography variant="h6">C.H.A.N.G.E. 360</Typography>
     )
   }
 />
   <CardContent>
     {isLoading ? (
       <React.Fragment>
         <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
         <Skeleton animation="wave" height={10} width="80%" />
       </React.Fragment>
     ) : (
     <>
       {error && <Typography color="error">{error}</Typography>}
       {response && (
     <Box textAlign='justify' sx={{ mt: 2 }}>
       <Typography variant="body2" color="white" component="p">
       {response.message.split('\n\n').map((text, index) => (
         <p key={index} style={{marginTop: '1em', marginBottom: '1em'}}>{text}</p>
       ))}
       </Typography>
   
         <br/>
         <Box textAlign='center'>
           <Button type="submit" variant="contained" style={{ backgroundColor: "#bf5e38", color: "#ffffff", fontSize: "1em" }}>
             Next - Provide Diet and Nutrition Info
           </Button>
         </Box>

     </Box>    
     )}
   </>
     )}
   </CardContent>
</Card>
) :('') }
      </Box>
    </Box>
  );
};

export default WelcomeResponse;
