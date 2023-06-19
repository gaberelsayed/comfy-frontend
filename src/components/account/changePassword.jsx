import { useState } from "react";
import { useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

import styles from "../../pages/account/account.module.css";
import axiosInstance from "../../apis/config";


const ChangePasswords = ({ user, token}) => {
    const { id } = useParams();
    const [updateUser, setUpdateUser] = useState({
      id:id,
      password: "",
      currentPassword: "",
      confirmPassword: "",
    });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const togglePasswordVisibility = (passwordField) => {
    if (passwordField === "currentPassword") {
      setShowCurrentPassword((prevState) => !prevState);
    } else {
      setShowNewPassword((prevState) => !prevState);
    }
  };

  const updateUserSubmit = (updateUser, { resetForm }) => {
    axiosInstance
      .patch(`/users`, updateUser,
       {
        headers: {
            Authorization:`Bearer ${token}`,
            "Content-Type":"application/json",
            "x-access-token":token
        },
      })
      .then((res) => {
        setIsSubmitted(true);
            resetForm()
      })
      .catch((err) => {
        // handle error, e.g. show error message
        setErrorMessage("Unable to update / check your current Password again and make sure that new password is different from the current.");
      });
  };
  return (
    <div>
      <h2 className={`${styles["text-2xl"]} ${styles.subTitle}`}>
        Update your password
      </h2>

      {errorMessage && !isSubmitted ? (
  <div className="alert alert-danger alert-dismissible fade show" role="alert">
    <FontAwesomeIcon icon={faTimes}/>
     {" "}{errorMessage}
     <button
      type="button"
      className="btn-close mt-3"
      data-bs-dismiss="alert"
      aria-label="Close"
      onClick={() => setErrorMessage(null)}
    ></button>
  </div>
) : isSubmitted ? (
    <div className="alert alert-success alert-dismissible fade show" role="alert">
    Change Password successfully!
       <FontAwesomeIcon icon={faCheckCircle} className="ms-2" />
       <button
      type="button"
      className="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
      onClick={() => setIsSubmitted(false)}
    ></button>
  </div>
) : null}

      <Formik
        initialValues={{
          ...updateUser,
        }}
        validationSchema={Yup.object({
            currentPassword: Yup.string().required(
              "Current Password is required"
            ).label("Current Password"),
          password: Yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters long")
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              "Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol."
            ),


          confirmPassword: Yup.string()
            .required("Confirm Password is required")
            .oneOf([Yup.ref("password")], "Password doesn't match")
            .label("Confirm Password"),
        })}
        onSubmit={updateUserSubmit}
      >
        {({ errors, touched }) => (
          <Form className={styles.label}>
            <div className={`mb-4 ${styles["max-w-xl"]}`}>
              <label className="mb-1" htmlFor="currentPassword">
                Current Password
              </label>
              <div className={styles.passwordInputWrapper}>
                <Field
                  className={`form-control ${styles.input}`}
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  placeholder="Please enter your current password"
                />
                <span
                  className={styles.togglePasswordVisibilityButton}
                  onClick={() => togglePasswordVisibility("currentPassword")}
                >
                  {showCurrentPassword ? (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  ) : (
                    <FontAwesomeIcon icon={faEye} />
                  )}
                </span>
              </div>
              {errors.currentPassword && touched.currentPassword ? (
                <span className="text-danger ms-2">{errors.currentPassword}</span>
              ) : null}
            </div>
            <div className={`mb-4 ${styles["max-w-xl"]}`}>
              <label className="mb-1" htmlFor="password">
                New password
              </label>
              <div className={styles.passwordInputWrapper}>
                <Field
                  className={`form-control ${styles.input}`}
                  name="password"
                  type={showNewPassword ? "text" : "password"}
                  id="password"
                  placeholder="Please enter new password"
                />
                <span
                  className={styles.togglePasswordVisibilityButton}
                  onClick={() => togglePasswordVisibility("password")}
                >
                  {showNewPassword ? (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  ) : (
                    <FontAwesomeIcon icon={faEye} />
                  )}
                </span>
              </div>
              {errors.password && touched.password ? (
                <span className="text-danger ms-2">{errors.password}</span>
              ) : null}
            </div>

            <div className={`mb-4 ${styles["max-w-xl"]}`}>
              <label className="mb-1" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <Field
                className={`form-control ${styles.input}`}
                name="confirmPassword"
                type="password"
                id="confirmPassword"
                placeholder="Please confirm your password"
              />
              {errors.confirmPassword && touched.confirmPassword ? (
                <span className="text-danger ms-2">
                  {errors.confirmPassword}
                </span>
              ) : null}
            </div>

            <div className={`pt-3`}>
              <input
                type="submit"
                className={`btn-bg-dark text-center ${styles.button}`}
                value="Update password"
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ChangePasswords;
