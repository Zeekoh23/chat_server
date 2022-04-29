import "@babel/polyfill";
import { passwordReset } from "./password_reset";
import { showAlert } from "./alert";

const passwordResetForm = document.querySelector(".password-reset");

if (passwordResetForm)
  passwordResetForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    //window.location.href    - to get the full url
    //windiw.location.search  - to get the the last part beginning with ?
    const queryString = window.location.pathname.split("/").pop(); //to get the token
    console.log(queryString);
    passwordReset(password, passwordConfirm, queryString);
  });

const alertMessage = document.querySelector("body").dataset.alert;
if (alertMessage) showAlert("success", alertMessage, 20);
