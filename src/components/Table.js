import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  hideUpdate,
  incerementOrder,
  incrementCancelClicked,
  incrementEditClicked,
  showError,
  showUpdate,
} from "../store/orderSlice";

function Table() {
  const [order, setOrder] = useState([]);
  const [orderName, setOrderName] = useState("");
  const [price, setPrice] = useState("");
  const [discounted, setDiscounted] = useState("");
  const [regularBill, setRegularBill] = useState("");
  const [discountedBill, setDiscountedBill] = useState("");

  // ref for auto scrolling to the bottom of the order table if "edit" button clicked
  const bottomRef = useRef(null);
  const totalEditClicked = useSelector((state) => state.order.editClicked);

  const topRef = useRef(null);
  const totalCancelClicked = useSelector((state) => state.order.cancelClicked);

  const dispatch = useDispatch();
  const totalOrder = useSelector((state) => state.order.addedOrder);
  const updateStatus = useSelector((state) => state.order.status);
  const selectedOrder = useSelector((state) => state.order.selectedOrder);
  const selectedId = selectedOrder.id;

  const resetHandler = () => {
    setOrderName("");
    setPrice("");
    setDiscounted("");
  };

  const getOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/kopeetearia/orders`);
      const data = res.data.data;

      setOrder(data);
      getRegularBill();
      getDiscountedBill();
    } catch (err) {
      dispatch(showError(true));

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Cannot load details. Something went wrong.",
      });

      return err;
    }
  };

  const showUpdateHandler = async (data) => {
    try {
      dispatch(showUpdate(data));
      dispatch(incrementEditClicked());

      setOrderName(data.orderName);
      setPrice(data.price);
      setDiscounted(data.discounted);
    } catch (err) {
      return err;
    }
  };

  const hideUpdateHandler = async () => {
    try {
      dispatch(hideUpdate());
      dispatch(incrementCancelClicked());
      resetHandler();
    } catch (err) {
      return err;
    }
  };

  const updateOrder = async () => {
    try {
      if (orderName.trim().length < 1) {
        throw new Error("Order name is required.");
      }

      if (price < 1) {
        throw new Error("Price is required.");
      }

      const res = await axios.put(
        `http://localhost:8080/kopeetearia/orders/${selectedId}`,
        {
          orderName,
          price,
          discounted,
        }
      );
      dispatch(incerementOrder());
      dispatch(hideUpdate());
      resetHandler();
      getOrder();

      Swal.fire({
        icon: "success",
        title: "Yay!",
        text: "Order is successfully updated",
        timer: 1500
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

  const deleteOrder = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:8080/kopeetearia/orders/${id}`);

      getOrder();

      Swal.fire({
        icon: "success",
        title: "Yay!",
        text: "Order is successfully deleted",
        timer: 1500,
      });

      return res;
    } catch (err) {
      return err;
    }
  };

  const getRegularBill = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/kopeetearia/orders/regular`);
      const data = res.data.data;

      setRegularBill(data);
    } catch (err) {
      return err;
    }
  };

  const getDiscountedBill = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/kopeetearia/orders/discount`);
      const data = res.data.data;

      setDiscountedBill(data);
    } catch (err) {
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

  useEffect(() => {
    // 👇️ scroll to bottom every time totalEditClicked is changed
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [totalEditClicked]);

  useEffect(() => {
    // 👇️ scroll to top every time totalCancelClicked is changed
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [totalCancelClicked]);

  useEffect(() => {
    getOrder();
  }, [totalOrder]);

  return (
    <>
      <div className="container max-h-64 overflow-auto scrollbar-hide mt-5 text-center">
        <div ref={topRef} />
        <p className="text-black font-bold">Attending Clerk: Jane Doe</p>
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
            {order.map((perOrder, index) => {
              return (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  key={perOrder.id}
                >
                  <td className="py-4 px-6">{perOrder.orderName}</td>
                  <td className="py-4 px-6">$ {perOrder.price}</td>
                  <td className="py-4 px-6">
                    {perOrder.discounted ? "Yes" : "No"}
                  </td>
                  <td className="py-4 px-6">
                    <div className="btn-group">
                      <button
                        id="editOrd"
                        onClick={() => showUpdateHandler(perOrder)}
                        className="btn btn-outline btn-warning pl-6 pr-6"
                      >
                        Edit
                      </button>
                      <button
                        id="deleteOrd"
                        onClick={() => deleteOrder(perOrder.id)}
                        className="btn btn-outline btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {order.length < 1 ? (
          <div className="flex items-center justify-center mt-5">
            <div className="text-3xl text-black">
              <h1>No Data Found</h1>
            </div>
          </div>
        ) : (
          ""
        )}

        {/* Update Table */}

        {updateStatus === true ? (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <tbody className="text-center justify-center">
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="py-4 px-6">
                  <input
                    id="updName"
                    value={orderName}
                    onChange={orderNameHandler}
                    type="text"
                    placeholder="order"
                    className="input input-bordered input-primary w-52"
                  />
                </td>
                <td>
                  <input
                    id="updPrice"
                    value={price}
                    onChange={priceHandler}
                    type="text"
                    placeholder="price"
                    className="input input-bordered input-primary w-52"
                  />
                </td>
                <td>
                  <div className="flex">
                    <input
                      id="updDiscount"
                      value={discounted}
                      onChange={discountedHandler}
                      type="checkbox"
                      className="checkbox"
                      checked={discounted}
                    />
                  </div>
                </td>
                <td>
                  <div className="btn-group">
                    <button
                      id="updOrd"
                      onClick={updateOrder}
                      className="btn btn-outline btn-warning px-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={hideUpdateHandler}
                      className="btn btn-outline btn-error px-2"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          ""
        )}
        <div ref={bottomRef} />
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-5">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr className="text-center">
            <th className="py-3 px-6">Total Bill</th>
          </tr>
        </thead>
        <tbody className="text-center justify-center">
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="py-4 px-6">
              Total Regular Bill: $ {Math.round(regularBill * 100) / 100}
            </td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="py-4 px-6">
              Total Discounted Bill: $ {Math.round(discountedBill * 100) / 100}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default Table;
