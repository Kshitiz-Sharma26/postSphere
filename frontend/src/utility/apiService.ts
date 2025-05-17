import axios from "axios";

export const getCurrentUserAPI = async () => {
  const resp = await axios.get("http://localhost:8000/user/get-current-user", {
    withCredentials: true,
  });
  return resp;
};

export const getUserAPI = async (options: { username: string }) => {
  const resp = await axios.get("http://localhost:8000/user/get-user", {
    withCredentials: true,
    params: {
      ...options,
    },
  });
  return resp;
};

export const listUsersAPI = async (options: { searchKey: string }) => {
  const resp = await axios.get("http://localhost:8000/user/list-users", {
    withCredentials: true,
    params: {
      ...options,
    },
  });
  return resp;
};

export const getPostsAPI = async (options: { users: string[] }) => {
  const resp = await axios.post(
    "http://localhost:8000/post/get-posts",
    options,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return resp;
};
export const uploadPostAPI = async (options: {
  image: File;
  caption?: string;
}) => {
  const formData = new FormData();
  formData.append("postImage", options.image);
  if (options.caption) formData.append("caption", options.caption);

  const resp = await axios.post("http://localhost:8000/post/upload", formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return resp;
};

export const signUpUserAPI = async (options: {
  username: string;
  password: string;
}) => {
  const resp = await axios.post("http://localhost:8000/user/signup", options, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return resp;
};
export const loginUserAPI = async (options: {
  username: string;
  password: string;
}) => {
  const resp = await axios.post("http://localhost:8000/user/login", options, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return resp;
};

export const updateUserAPI = async (options: {
  id: string;
  payload: { bio: string };
}) => {
  const resp = await axios.put("http://localhost:8000/user/update", options, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return resp;
};

export const updateFriendshipAPI = async (options: {
  requestedBy: string;
  requestedTo: string;
  add?: string;
}) => {
  const resp = await axios.put(
    "http://localhost:8000/user/update-friendship",
    options,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return resp;
};
