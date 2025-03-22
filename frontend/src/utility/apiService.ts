import axios from "axios";

export const getCurrentUserAPI = async () => {
  const resp = await axios.get("http://localhost:8000/user/get-current-user");

  return resp;
};
