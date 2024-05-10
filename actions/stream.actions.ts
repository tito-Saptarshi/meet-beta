"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

// this server-action-function is created for having the authentication token(or token) which has to be passed in the StreamVideoClient (in StreamClientProvider.tsx)
export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error("User is not authenticated");
  if (!apiKey) throw new Error("Stream API key secret is missing");
  if (!apiSecret) throw new Error("Stream API secret is missing");

  // NodeSDK being used because we are on the server-side
  // if we were in a regular react-ecosystem we would have to spin up a Node-Express-server
  // in NextJS, we could do it all in one -> to do the same in-here, we had to install that NodeSDK-package

  const streamClient = new StreamClient(apiKey, apiSecret);  // creating this because we want the client and as we are on the server-side we have to sent apiKey and apiSecret to StreamClient(which is in server )

  const expirationTime = Math.floor(Date.now() / 1000) + 3600;
  const issued = Math.floor(Date.now() / 1000) - 60;

  const token = streamClient.createToken(user.id, expirationTime, issued);

  return token;
};
