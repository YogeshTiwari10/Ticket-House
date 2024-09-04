const movie = require('./Controller/Movie.js');
const user = require('./Controller/User.js');
const order = require('./Controller/Order.js');
const theatre = require('./Controller/Theatre.js');
var express = require('express');
var app = express();
var cors = require('cors');
var path = require('path');
var bodyParser = require('body-parser');
const { checkLogin } = require('./middleware/authUser');
var Stripe= require('stripe')

var cookieParser = require('cookie-parser');


const stripe = new Stripe('sk_test_51N7hl3SHBE45jscN5AtjXTUNJacUegzFPTJHZeSglVfIhi8Vn6ek02Mf11CQoA3TCv0lnLaf1HdNIuCyYGzAo16Z00SRKVA0bE');


var port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
var config = require('./config/movieDb');

const DbLogic = require('./Controller/DbLogic.js');
const db = new DbLogic();

console.log(config.url);

var statusCode = db.initialize(config.url);
if (statusCode == 2) {
  app.listen(port, () => {
    console.log(`server listening on: ${port}`);
  });
} else {
  console.log('Connection error and Failed to start server.');
}

app.get('/get-movie', movie.getMovie);
app.get('/get-all-movie', movie.getAllMovie);

app.get('/movie/:id', movie.findMovie);
app.post('/add-movie', movie.addMovie);
// app.post('/update-movie', movie.updateMovie);
// app.delete('/delete-movie', movie.deleteMovie);
// app.post('/add-movie', movie.addMovie);

app.get('/get-user-orders/:userId', movie.getOrdersByUserId);
app.get('/get-all-user-orders', movie.getAllOrders);
app.post('/get-recommend-movie', movie.getRecommendMovie);

app.post('/update-movie/:movieId', movie.updateMovie);
app.delete('/delete-movie/:id', movie.deleteMovie);

app.post('/login', user.loginUser);
app.get('/get-user', user.getAllUser);
app.get('/get-user/:id', user.getUserById);
app.post('/register', user.registerUser);

app.post('/update-user', user.updateUser);
app.delete('/delete-user/:id', user.deleteUser);

app.get('/theatreList', theatre.getAllTheatre);
app.get('/theatre/:theatreId', theatre.getTheatreById);
app.get('/movie-theatre-info/:theatreId', theatre.getMovieInTheatreById);

app.post('/bookMovie', order.bookMovie);
app.get(
  '/checkMovieSeats/:movieId/:theatreId/:showtimeId',
  order.checkMovieSeats
);

app.get('/get-orders-by-details', order.getOrdersByDetails);





app.use('/payment',async (req, res) => {

  const Details = req.body.product; // Course details from the request body

  console.log(Details)

  // Format the line items for Stripe session creation
  const lineItems = [{
      price_data: {
          currency: 'inr',
          product_data: {
              name: Details.name,
              // images: [courseDetails.c_image],
              // description: courseDetails.description,
          },
          unit_amount: Details.price,
      },
      // quantity: Details.quantity,
      quantity: 1,
  }];

  const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      billing_address_collection: 'required', 
      mode: 'payment',
      metadata: {
        products_details: JSON.stringify(Details) 
      },
      // success_url: `http://127.0.0.1:3000/paymentDone/${lineItems}`, // Redirect URL after successful payment
      // success_url: `http://127.0.0.1:3000/myorders`, // Redirect URL after successful payment
      success_url: `http://127.0.0.1:3000/orderconfirmation?session_id={CHECKOUT_SESSION_ID}`, // Redirect URL after successful payment
      cancel_url: 'http://127.0.0.1:3000/', // Redirect URL if the payment is canceled
  });

  res.json({ id: session.id });
})

app.use('/get-payment-details',async (req, res) => {
  const sessionId = req.query.session_id;
  if(sessionId){
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
   const a = session.metadata.products_details
  // console.log(a,session.status)

  if ( session.status == "complete") {
    order.bookMovie(a);

    

  }
      res.status(200).json(session);
    } catch (error) {
      console.error('Error retrieving payment details from Stripe:', error.message);
      res.status(500).json({ error: 'Failed to retrieve payment details' });
    }
  }
})