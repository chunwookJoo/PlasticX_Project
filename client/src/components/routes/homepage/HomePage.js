import axios from "axios";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import Button from "../../views/navbar/Button";
import "./HomePage.css";

class HomePage extends React.Component {
  render() {
    return (
      <section className="home">
        <div className="home-article">
          <h1>여기에 메인 내용이 들어갑니다.</h1>
          <h5>여기에 서브 내용이 들어갑니다.</h5>
          <h5 className="manual">
            <Link to="/manual">
              <button>사용법</button>
            </Link>
          </h5>
        </div>
        <div>
          <img className="tumbler-img" alt="tumbler" src="img/tumbler.jpg" />
        </div>
      </section>
    );
  }
}

// function HomePage() {
//    useEffect(() => {
//      axios.get("/api/hello").then((response) => console.log(response.data));
//   }, []);
// }

export default HomePage;