import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";
import { useSelector } from "react-redux";
//
import axiosInstance from "../../apis/config";
import { emptyCart } from "../../functions/cart";
//style
import style from "./checkout.module.css";
import "../../App.css";

export default function PaymentMethod() {
  const [isAddingOrder, setIsAddingOrder] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const shippingValue = 20.0;
  // ===========
  const cart = useSelector(state => state.cart.cart);
  const formData = useSelector(state => state.CheckoutForm.form);

  const confirmOrder = event => {
    let msg = window.confirm("Are you sure you want to make this order?");
    return msg;
  };
  // ===========
  const additionalInfo = {
    totalPrice: cart.totalPrice,
    items: cart.items,
    userId: cart.user_id,
  };
  const newObjectData = { ...formData, ...additionalInfo };
  const onConfirmClick = event => {
    axiosInstance
      .post(`/orders`, newObjectData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      })
      .then(res => {
        const the_msg = confirmOrder();
        if (the_msg === false) return;
        emptyCart(cart._id);
        event.target.textContent = "order Done ";
        setIsAddingOrder(true);
        setTimeout(() => {
          navigate("/shop");
        }, 3000);
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  return formData ? (
    <div>
      <div className={`${style.PaymentMethod} ml-5 ml-md-3 container `}>
        <div className="container">
          <div className="form-control mr-5 ps-4">
            <div className={`${style.first} row mr-5 `}>
              <div className={`${style.gray} col-3 mt-3`}> Contact</div>
              <div className="col-6 mt-3"> {formData?.phone}</div>
              <div className="col-3">
                <Link
                  to="/checkout/information "
                  className={`${style.linkclass}`}
                >
                  {" "}
                  change{" "}
                </Link>
              </div>
            </div>
            <hr className="border" />
            <div className={`${style.last} row `}>
              <div className={`${style.gray} col-3`}> Ship to</div>
              <div className="col-6">
                {" "}
                {formData?.address?.apartment} ,{formData?.address?.street},
                {formData?.address?.city},{formData?.address?.governorate},
                {formData?.address?.country}
              </div>
              <div className="col-3">
                <Link
                  to="/checkout/information"
                  className={`${style.linkclass}`}
                >
                  {" "}
                  change{" "}
                </Link>
              </div>{" "}
            </div>
          </div>
          <p className="mt-5 ms-1"> Shipping method</p>
          <div
            className={`${style.shippingMethod}   form-control active-input mb-5`}
          >
            <div className="row">
              <div className="col-4 "> standard</div>
              <div className="col-5"> </div>
              <div className="col-2"> ${shippingValue}</div>
            </div>
          </div>
          <div className="row mb-4  w-100 m-auto">
            <Link
              to="/checkout/information"
              className={` col-lg-6  col-md-6 col-sm-12  col-12  mt-2 mb-3 ${style.returnLink} text-decoration-none `}
            >
              {" "}
              {`<  `} return to information{" "}
            </Link>
            <button
              className={`${style.orderbtn} col-lg-6  col-md-6 col-sm-12  col-12  btn  h-100  ws-100 me-0 `}
              onClick={onConfirmClick}
              disabled={isAddingOrder}
            >
              Confirm order
            </button>
          </div>
          <hr className="border" />
          <small className={`${style.gray} `}>
            {" "}
            All Rights Reserved to comfy team
          </small>
        </div>
      </div>
    </div>
  ) : (
    "loading---"
  );
}
