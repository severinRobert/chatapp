import React from 'react';
import { Link } from "react-router-dom";

function Home() {

  return (
    <div className="container">
      <Link className="button" to="/chat">
        Chat
      </Link>
    </div>
  );

}

export default Home;