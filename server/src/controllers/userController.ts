import axios from "axios";
import { User } from "../db/user";
import asyncHandler from "express-async-handler";
import { response } from "express";
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// Research if this is the best case to get user, or if i can decode the token and get the user from there
export const getUserInfo = asyncHandler(async (req, res, next) => {
  const userId = req.auth.sub;

  // Check if user exists, if not create it
  const user = await User.findOne({ "userInfo.auth0Id": userId }) as typeof User;
  if (!user) {
    const accessToken = req.headers.authorization.split(" ")[1];
    const response = await axios.get(
      "https://dev-a0oir8yzhmnp7jh3.us.auth0.com/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const newUser = response.data;
    await User.create({
      userInfo: {
        auth0Id: newUser.sub,
        nickname: newUser.nickname,
        name: newUser.name,
        picture: newUser.picture,
        email: newUser.email,
        emailVerified: newUser.email_verified,
      },
    });
  } else {
    req.user = user;
  }

  next();
});
