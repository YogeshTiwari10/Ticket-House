import "./about.css";
import img from '../assets/images/movie-watching.gif'

export default function About() {
  return (
    <div className="about">
      <h1 className="about-heading">About Us</h1>
      <div className="about-content">
        <div className="about-image">
          <img
            src={img}
            alt="Movie Cinema"
          />
        </div>
        <div className="about-text">
          <h2>Welcome to Ticket House</h2>
          <p>
            At Ticket House, we aim to provide the best online movie
            ticket booking experience. With a wide range of movies from different
            genres, easy-to-use booking system, and exclusive offers, we bring
            cinema entertainment right to your fingertips.
          </p>
          <p>
            Our platform allows users to seamlessly browse through the latest
            movies, read about movies, and book tickets all in one
            place. We are dedicated to making your movie-watching experience
            hassle-free and enjoyable.
          </p>
          <p>
            Join us and experience the future of movie ticket booking today!
          </p>
        </div>
      </div>
    </div>
  );
}
