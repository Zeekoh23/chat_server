import axios from "axios";
import { showAlert } from "./alert";
//const { forgotPassword } = require("../../controllers/authController");

export const passwordReset = async (password, passwordConfirm, token) => {
  try {
    console.log(token);
    const res = await axios({
      // params: token,
      method: "POST",
      url: `/api/v1/users/resetpassword/${token}`,

      data: {
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Password reset successful");
      /*window.setTimeout(() => {
        location.assign("/");
      }, 1500);*/
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
