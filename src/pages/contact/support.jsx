import React from "react";
import "./support.css";
import Mainheader from "../../components/MainHeader"; // Import the header component

const ContactUs = () => {
  return (
    <div>
      <Mainheader /> {/* Add the header component here */}
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p>If you have any questions, feel free to reach out to us!</p>
        <form className="contact-form">
          <div className="input-group">
            <label>DealDock supports</label>
          </div>
          <div className="input-group">
            <label>dealdock.edu.np</label>
          </div>
          <div className="input-group">
            <label>9843097096</label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
