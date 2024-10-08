const nodemailer = require('nodemailer');
const mailUser = process.env.MAILUSER;
const mailPwd = process.env.MAILPWD;
const DbLogic = require('./DbLogic.js');
const db = new DbLogic();
const mongoose = require('mongoose');



const getOrdersByDetails = async (req, res) => {
  const { movieName, showDate, showTime } = req.query;

  try {
    // Find movie by name to get movie ID
    console.log(movieName, showDate, showTime);

    const movie = await db.getMovieByName(movieName)
    console.log(movie._id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Find orders by movie ID, show date, and time
    const orders = await db.getOrdersByMovieId(
      movie._id, 
      showTime.toString(), 
      showDate.toString()
    );
    console.log(orders);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders by details:', error.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};



const bookMovie = (req) => {
  req=JSON.parse(req)
  let location = req["stripData"]["location"];
  let selectedDate = req["stripData"]["selectedDate"];
  let selectedTime = req["stripData"]["selectedTime"];
  let showtimeId = req["stripData"]["showtimeId"];
  let orderDate = new Date();
  let orderTotal = req["stripData"]["orderTotal"];

  var movieOrderData = {
    userId: req["stripData"]["userId"],
    theatreId: location,
    movieId: req["stripData"]["movieOId"],
    orderDate: orderDate,
    showDate: selectedDate,
    showTime: selectedTime,
    seats: req["stripData"]["seats"],
    orderTotal: orderTotal,
    paymentMethod: 'Visa',
  };

  let theatreId = movieOrderData.theatreId;
  let movieId = movieOrderData.movieId;
  let seats = movieOrderData.seats;

  console.log(
    'Root of bookMovie method:' + theatreId,
    movieId,
    showtimeId,
    seats
  );
  //Movie booking - Check Movie seats if occupied or not
  db.checkMovieSeats(theatreId, movieId, showtimeId, seats).then(function (
    result
  ) {
    // console.log(result);
    if (result.length != 0) {
      // console.log('Movie seats already occupied');
      // res.send({
      //   msg: 'Movie seats already occupied, please try again!',
      //   status: false,
      // });
    } else {
      // console.log('Thank you for booking the movie tickets with us!');

      //Calling function to save movie booking info to orders collection
      db.bookMovie(movieOrderData).then(function (result) {
        // console.log(result);
        if (result) {
          db.getUserById(movieOrderData.userId).then(function (userData) {
            //console.log(userData);

            db.checkMovieSeatsDetails(theatreId, movieId, showtimeId).then(
              function (checkSeatsOccupiedArray) {
                console.log(checkSeatsOccupiedArray);
                if (checkSeatsOccupiedArray.length == 0) {
                  console.log(seats);
                  //Calling func to update occupied seats in movieSeats collection
                  db.addMovieSeatsDetails(
                    theatreId,
                    movieId,
                    showtimeId,
                    seats
                  );
                } else {
                  //Calling func to update occupied seats in movieSeats collection
                  db.updateOccupiedSeats(theatreId, movieId, showtimeId, seats);
                }
              }
            );

            db.getMovieByObjId(movieOrderData.movieId).then((movieResult) => {
              db.getTheatreById(movieOrderData.theatreId).then(
                (theatreResult) => {
                  orderData = {
                    movieName: movieResult.title,
                    theatreName: theatreResult.name,
                    seats: movieOrderData.seats,
                  };
                  sendMail(userData, orderData);
                  // res.send({
                  //   msg: 'Thank you for booking the movie tickets with us!',
                  //   status: true,
                  // });
                }
              );
            });
          });
        }
      });
    }
  });
  //End of movie booking
};

//send mail
const sendMail = async (userData, orderDetails) => {
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();
  console.log(userData);
  let userName = userData.name;
  let userEmail = userData.email;

  let movieName = orderDetails.movieName;
  let theatre = orderDetails.theatreName;

  let selectedSeats = '';
  orderDetails.seats.map((data, index) =>
    index == orderDetails.seats.length - 1
      ? (selectedSeats += data)
      : (selectedSeats += data + ',')
  );

  // console.log(selectedSeats);

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    // host: 'smtp.ethereal.email',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    service: 'Gmail',
    auth: {
      user: "", 
      pass: "", 
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Ticket House" <yogeshtiwari733@gmail.com>"', // sender address
    to: userEmail, // list of receivers
    subject: 'Your Movie Ticket Purchase Confirmation', // Subject line
    text: 'Ticket House Order', // plain text body
    html:
      'Hello ' +
      userName +
      ',' +
      '<p>Thanks for your purchase at <b>Ticket House</b>.<br><br>Your tickets for selected seats: <b>' +
      selectedSeats +
      '</b> for <b>' +
      movieName +
      '</b> movie at <b>' +
      theatre +
      '</b> are confirmed.<br><br><b>Enjoy your movie and stay safe!</b></p>' +
      '<p>If you have any trouble, please contact us!</p>' +
      '<p>Best wishes,<br>Ticket House</p>',
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

const checkMovieSeats = (req, res, next) => {
  let movieId = req.params.movieId;
  let theatreId = req.params.theatreId;
  let showtimeId = req.params.showtimeId;
  db.checkMovieSeatsDetails(theatreId, movieId, showtimeId).then(function (
    result
  ) {
    res.send(result);
  });
};

module.exports = { getOrdersByDetails, bookMovie, checkMovieSeats }; 
