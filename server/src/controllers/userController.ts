import axios from "axios";
import { User } from "../db/user";
import asyncHandler from "express-async-handler";

export const getUserInfo = asyncHandler(async (req, res, next) => {
    const accessToken = req.headers.authorization.split(" ")[1];
  const response = await axios.get("https://dev-a0oir8yzhmnp7jh3.us.auth0.com/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const userInfo = response.data;
    const user = await User.findOne({ "userInfo.auth0Id": userInfo.sub });
    if (!user) {
        await User.create({
            userInfo: {
                auth0Id: userInfo.sub,
                nickname: userInfo.nickname,
                name: userInfo.name,
                picture: userInfo.picture,
                email: userInfo.email,
                emailVerified: userInfo.email_verified,
            },
        });
    }
  console.log(userInfo);
  next();
});