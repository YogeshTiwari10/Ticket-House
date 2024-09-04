import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const [paymentDetail, setPaymentDetail] = useState<string | null>(null);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Step 3: Get the value of 'session_id'
    const sessionId = urlParams.get('session_id');
    console.log(sessionId)
  useEffect(() => {
   
    const fetchPaymentDetails = async () => {
        try {        
          const response = await fetch(`http://127.0.0.1:4000/get-payment-details?session_id=${sessionId}`);
          const data = await response.json();
          
          // console.log(data)
  
          setPaymentDetail(data); 
          console.log(data)// Set paymentInfo state with fetched data
          navigate('/myorders')
        } catch (error) {
          console.error('Error fetching payment details:', error);
        }
      };
  
      if (sessionId) {
        fetchPaymentDetails();
      }
    }, [sessionId]); 

  return (
    <div>
      {/* <h1>Order Confirmation</h1>
      {paymentDetail ? (
        <p>Your session ID is: {sessionId}</p>
      ) : (
        <p>Loading session information...</p>
      )} */}
    </div>
  );
};

export default OrderConfirmation;