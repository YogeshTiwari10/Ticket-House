import React, { useState } from 'react';
import axios from 'axios';
import './OrderPage.css'

interface Order {
  userId: string;
  theatreId: string;
  movieId: string;
  orderDate: string;
  showDate: string;
  showTime: string;
  seats: string[];
  orderTotal: number;
  paymentMethod: string;
}

const OrdersPage: React.FC = () => {
  const [movieName, setMovieName] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>(''); // Initial state for time
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string>('');

  const fetchOrders = async () => {
    try {

        console.log(movieName);
        console.log(date);
      const response = await axios.get('http://localhost:4000/get-orders-by-details', {
        params: {
          movieName,
          showDate: date,
          showTime: time,
        },
      });
      setOrders(response.data);
      console.log(orders);
      setError('');
    } catch (err) {
      setError('Failed to fetch orders. Please try again later.');
    }
  };

  return (
    <div className="orders-page">
      <h2>Find Orders</h2>
      <div className="input-container">
        <input
          type="text"
          placeholder="Movie Name"
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {/* Dropdown menu for selecting show time */}
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
        >
          <option value="">Select Show Time</option>
          <option value="11 AM">11 AM</option>
          <option value="1 PM">1 PM</option>
          <option value="3 PM">3 PM</option>
          <option value="5 PM">5 PM</option>
        </select>
        <button onClick={fetchOrders}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}

      {orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={index} className="order-card">
              <p>User ID: {order.userId}</p>
              <p>Show Date: {order.showDate}</p>
              <p>Show Time: {order.showTime}</p>
              <p>Seats: {order.seats.join(', ')}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found for the given details.</p>
      )}
    </div>
  );
};

export default OrdersPage;
