import axios from "axios";
import { User } from "../db/user";
import asyncHandler from "express-async-handler";
import { clearCache, getOrSetCache } from "../utils/cacheUtils";

async function CreateUser(authorizationHeader: string) {
  const accessToken = authorizationHeader.split(" ")[1];
    const response = await axios.get(
      "https://dev-a0oir8yzhmnp7jh3.us.auth0.com/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
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
    return newUser;
}

export const getUserInfo = asyncHandler(async (req, res, next) => {
  console.log("Getting user cached info");
  const cachedUser = await getOrSetCache(`user:${req.auth.sub}`, async () => {
    const user = await User.findOne({
      "userInfo.auth0Id":  req.auth.sub,
    });
    return user;
  });
  console.log("User cached info:", cachedUser);

 if (cachedUser) {
    console.log("User found in cache");
    req.user = cachedUser as typeof User;
  } else {
    console.log("User not found in cache. Creating user....");
    req.user = await CreateUser(req.headers.authorization);
    clearCache(`user:${req.auth.sub}`);
  } 
  next();
});

export const getTestUserInfo = asyncHandler(async (req, res, next) => {
  req.auth = {
    sub: process.env.TEST_USER_TOKEN,
  };

  // Check if user exists, if not create it
  const user = (await User.findOne({
    "userInfo.auth0Id": req.auth.sub,
  })) as typeof User;
  if (!user) {
    const error = new Error("Test user not found");
    next(error);
  } else {
    req.user = user;
  }
  next();
});
