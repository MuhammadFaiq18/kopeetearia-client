import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { incerementOrder, showError } from "../store/orderSlice";
import Table from "./Table";
import Swal from "sweetalert2";
import Header from "./Header";
import Footer from "./Footer";

function Content() {
  const [orderName, setOrderName] = useState("");
  const [price, setPrice] = useState("");
  const [discounted, setDiscounted] = useState("");

  const dispatch = useDispatch();

  const errorStatus = useSelector((state) => state.order.errorStatus);

  const resetHandler = () => {
    setOrderName("");
    setPrice("");
    setDiscounted("");
  };

  const addOrder = async () => {
    try {
      if (errorStatus) {
        throw new Error("Unable to add order. Something went wrong.");
      }

      if (orderName.trim().length < 1) {
        throw new Error("Order name is required.");
      }

      if (price < 1) {
        throw new Error("Price is required.");
      }

      const res = await axios.post(`http://localhost:8080/kopeetearia/orders`, {
        orderName,
        price,
        discounted,
      });
      dispatch(incerementOrder());
      resetHandler();

      Swal.fire({
        icon: "success",
        title: "Yay!",
        text: "Order is successfully added",
        timer: 1500,
      });

      return res;
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message,
        timer: 1500
      });
      return err;
    }
  };

  const orderNameHandler = (e) => {
    setOrderName(e.target.value);
  };

  const priceHandler = (e) => {
    setPrice(e.target.value);
  };

  const discountedHandler = (e) => {
    if (e.target.checked === true) {
      setDiscounted(true);
    } else {
      setDiscounted(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container flex p-4 justify-center">
        <div className="h-max mx-5">
          <img style={{ height: 563.6 }} src="menu.png" alt="menu list" />
        </div>
        <div className="h-max mx-5">
          {/* Input Form */}

          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr className="text-center">
                <th className="py-3 px-6">Order Item</th>
                <th className="py-3 px-6">Price</th>
                <th className="py-3 px-6">On 5% Promo</th>
                <th className="py-3 px-6">Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="py-4 px-6">
                  <input
                    id="ordName"
                    onChange={orderNameHandler}
                    value={orderName}
                    type="text"
                    placeholder="order"
                    className="input input-bordered input-primary w-full"
                  />
                </td>
                <td>
                  <input
                    id="ordPrice"
                    onChange={priceHandler}
                    value={price}
                    type="text"
                    placeholder="price"
                    className="input input-bordered input-primary w-full"
                  />
                </td>
                <td>
                  <div className="flex justify-center">
                    <input
                      id="ordDiscounted"
                      onChange={discountedHandler}
                      value={discounted}
                      type="checkbox"
                      className="checkbox"
                      checked={discounted}
                    />
                  </div>
                </td>
                <td>
                  <button
                    id="addOrderBtn"
                    onClick={addOrder}
                    className="btn btn-outline btn-accent pl-6 pr-6"
                  >
                    Add
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Order Table & Bill */}

          <Table />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Content;
