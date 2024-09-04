import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import '../assets/stylesheets/OrderDetails.css';
import Pagination from '../components/Pagination';
import star from '../assets/images/star.png';
import emptyOrdersImg from '../assets/images/orders.webp';
import decode from 'jwt-decode';
import download from '../assets/images/downloadicon.png'
import { Form, CloseButton, Modal, ModalHeader } from 'react-bootstrap';
import logo from '../assets/images/Booking1.png'
import { Directions } from '@material-ui/icons';

type OrderDetailsProps = {
  orderId: number;
  userId: any;
  theatreId: any;
  movieId: any;
  orderDate: Date;
  showDate: string;
  showTime: string;
  seats: [];
  orderTotal: number;
  paymentMethod: string;
};

type AcknowledgeModalPropTypes = {
  status: any;
  show: boolean;
  onHide: () => void;
};

type MovieBookingStatusProps = {
  msg: string;
  status: boolean;
};

const SearchMovies = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetailsProps[]>([]);
  const [movieData, setMovieData] = useState([]);
  const [acknowledgeModalShow, setAcknowledgeModalShow] = useState(false);
  const [movieBookingStatus, setMovieBookingStatus] = useState<MovieBookingStatusProps>();
  const [hide, setHide] = useState(false);
  var token: any = localStorage.getItem('loginToken');
  var data: any = decode(token);

  // console.log(orderDetails);
  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/get-user-orders/${data.id}`
        );
        // console.log(response.data);
        setOrderDetails(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getOrders();
  }, []);

  // const [ticketMondal, setTicketMondal] = useState(false);
  

  return (
    <div className='main-od-container container-fluid'>
      <div className='row od-row'>
        <div className='col-lg' >
          {orderDetails.length !== 0 ? (
            <div className='od-tableDisplay'>
              <h2 className='order-title'>My Orders</h2>
              <hr />
              <table className='table align-middle'>
                <thead className='thead-dark align-middle'>
                  <tr>
                    {/* <th scope='col'>id</th> */}
                    <th scope='col'>Movie </th>
                    <th scope='col'></th>
                    <th scope='col'>Theatre</th>
                    <th scope='col'>Seats</th>
                    <th scope='col'>Date</th>
                    <th scope='col'>Time</th>
                    <th scope='col'>Price</th>
                    {/* <th scope='col'>Download</th> */}
                  </tr>
                </thead>
                {orderDetails.map((order) => (
                  <tbody>
                    <tr>
                      <td className='od-tableBody .align-middle' colSpan={2}>
                        <img
                          src={order.movieId.image}
                          alt='Movie Not found'
                          className='od-movie-img'
                        />
                        {order.movieId.title}
                      </td>
                      <td className='od-tableBody align-middle'>
                        {order.theatreId.name}
                      </td>
                      <td className='od-tableBody od-movieTitle align-middle'>
                        {' '}
                        <>
                          {order.seats.map((data, index) => (
                            <>
                              {index === order.seats.length - 1
                                ? data
                                : data + ', '}
                            </>
                          ))}{' '}
                        </>
                      </td>
                      <td className='od-tableBody od-movieTitle align-middle'>
                        {order.showDate}
                      </td>

                      <td className='od-tableBody od-movieTitle align-middle'>
                        {order.showTime}
                      </td>

                      <td className='od-tableBody od-movieTitle align-middle'>
                        {order.orderTotal}
                      </td>
                      <td className='od-tableBody od-movieTitle align-middle'>
                        {/* <img src={download} alt="download" style={{ width: "40px", marginLeft: "20px", cursor: "pointer" }} onClick={() => setAcknowledgeModalShow(true)} /> */}
                      </td>
                      <AcknowledgeModal
                        status={movieBookingStatus}
                        show={acknowledgeModalShow}
                        onHide={() => setAcknowledgeModalShow(false)}
                      />
                    </tr>
                  </tbody>
                ))}
              </table>



              {/* <Pagination
          moviesPerPage={moviesPerPage}
          totalMovies={moviesLength}
          paginate={paginate}
        /> */}
            </div>
          ) : (
            <div className='text-center'>
              <img
                src={emptyOrdersImg}
                alt='No Orders'
                className='emptyOrders-img'
              />
              <h2>You haven't purchase any movie tickets with us!</h2>
              <button
                className='btn btn-primary'
                onClick={() => {
                  navigate('/');
                }}
              >
                Continue searching movies
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AcknowledgeModal = (props: AcknowledgeModalPropTypes) => {
  const componentRef = useRef(null);


  var token: any = localStorage.getItem('loginToken');
  var data: any = decode(token);

  const [orderDetails, setOrderDetails] = useState<OrderDetailsProps[]>([]);
  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/get-user-orders/${data.id}`
        );
        // console.log(response.data);
        setOrderDetails(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getOrders();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Movie-Ticket',
    onAfterPrint: () => alert("Ticket Successfully Downloaded")
  }); 

  return (
    <Modal
    {...props}
    size='lg'
    aria-labelledby='contained-modal-title-vcenter'
    centered
    >
      {/*-------------------------------------------------------------------------------------------------- */}
      <Modal.Header>
        <Modal.Title id='contained-modal-title-vcenter' style={{display:"flex", alignItems:"center", justifyContent:"center", margin:"auto"}}>
        {/* <img src={logo} alt="logo"/> */}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>


      <div className='payment-modal-body' ref={componentRef}>
        {/* <h4>
          Ticket Information <br />
        </h4> */}
        <div className='payment-form'>
        <div className="cardWrap">
<div className="card cardLeft">
  <h1>Booking <span>Baba</span></h1>
  <div className="title">
    {/* <>{orderDetails}</> */}
    <h2>
      <>
      {/* {orderDetails[0].movieId.title} */}
      Fantastic Beasts: Secret of Dumbledore
      </>
    </h2>
    <span>Movie</span>
  </div>
  <div className="name">
    <h2>Wave Cinema Rudrapur</h2>
    <span>Theatre</span>
  </div>
  <div style={{display:"flex", flexDirection:"row" }}>
  {/* <div className="seat">
    <h2>36</h2>
    <span>seat</span>
  </div> */}
  <div className="time">
    <h2>16 Jan </h2>
    <span>Date</span>
  </div>
  <div className="time">
    <h2>1 PM</h2>
    <span>Time</span>
  </div>
  </div>
  
</div>
<div className="card cardRight">
  <div className="eye"></div>
  <div className="number">
    <h3>27, 28</h3>
    <span>seat</span>
  </div>
  <div className="barcode"></div>
</div>

</div>
        </div>
      </div>



      </Modal.Body>
      <Modal.Footer>
       <> <Button onClick={handlePrint}>Download</Button> </>
      </Modal.Footer>
    </Modal >
  );
};

export default SearchMovies;
