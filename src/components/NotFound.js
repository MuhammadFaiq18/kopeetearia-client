import React from "react";
import Header from "./Header";
import { Link } from "react-router-dom";
import Footer from "./Footer";

function NotFound() {
  return (
    <>
      <div className="navbar bg-black">
        <div className="navbar-start">
          <img src="header-img.png" className="h-16" alt="" />
        </div>
      </div>
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-600">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-2xl font-semibold md:text-3xl">
            Sorry, we couldn't find this page.
          </p>
          <p className="mt-4 mb-8 dark:text-gray-400">
            But dont worry, you can find plenty of other things on our homepage.
          </p>
          <Link to={"/"}>
            <button className="btn btn-primary mr-2">Back To Homepage</button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default NotFound;
