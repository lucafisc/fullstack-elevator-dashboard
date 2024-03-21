import axios from "axios";
import asyncHandler from "express-async-handler";

export const getUserInfo = asyncHandler(async (req, res, next) => {
    const accessToken = req.headers.authorization.split(" ")[1];
  const response = await axios.get("https://dev-a0oir8yzhmnp7jh3.us.auth0.com/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const userInfo = response.data;
  console.log(userInfo);
  next();
});