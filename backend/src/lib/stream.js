import {StreamChat} from "stream-chat";
import dotenv from "dotenv";
dotenv.config();

const api_key = process.env.STREAM_API_KEY ;
const api_secret = process.env.STREAM_SECRET_KEY;
if(!api_key || !api_secret){
console.log("api key or secret key is not defined");
process.exit(1);
}
const streamClient = StreamChat.getInstance(api_key, api_secret);
export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([{ ...userData }]);
    return userData;
  } catch (error) {
    console.log("Error upserting stream user", error);
    throw error;
  }
};

export const generateStreamToken = (userId) => {
  try {
    // ensure userId is a string
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error);
  }
};