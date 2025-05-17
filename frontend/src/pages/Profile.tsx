import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext";
import useApiCall from "../hooks/useApiCall";
import {
  getPostsAPI,
  getUserAPI,
  updateFriendshipAPI,
  updateUserAPI,
} from "../utility/apiService";
import DefaultLayout from "../Components/DefaultLayout";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import clsx from "clsx";

type ProfileInfo = {
  username: string;
  id: string;
  profileImage: string;
  bio: string;
};

type Post = { id: string; caption: string; image: string; likes: number };

const Profile: React.FC = () => {
  const { state, dispatch } = useContext(GlobalContext);
  const { userInfo, theme } = state;
  const { username } = useParams();
  const { fetchData: fetchUser } = useApiCall<
    {
      username: string;
      id: string;
      profileImage: string;
      bio: string;
      friends: string[];
    },
    { username: string }
  >(getUserAPI);
  const { fetchData: fetchPosts } = useApiCall<unknown, { users: string[] }>(
    getPostsAPI
  );

  const { fetchData: updateUser } = useApiCall<
    undefined,
    {
      id: string;
      payload: {
        bio: string;
      };
    }
  >(updateUserAPI);

  const { fetchData: toggleFriendship } = useApiCall<
    boolean,
    { requestedBy: string; requestedTo: string; add?: string }
  >(updateFriendshipAPI);

  const isProfileEditable = userInfo?.username === username;
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [bio, setBio] = useState("");
  const [friendshipStatus, setFriendshipStatus] = useState(false);
  const [friendCount, setFriendCount] = useState(0);

  useEffect(() => {
    (async function () {
      if (username) {
        dispatch({
          type: "SET_LOADING",
          payload: true,
        });
        const userResp = await fetchUser({
          username,
        });
        if (userResp.data?.id) {
          setBio(userResp.data.bio);
          setProfileInfo(userResp.data as ProfileInfo);
          if (userInfo) {
            setFriendshipStatus(userResp.data.friends.includes(userInfo.id));
            setFriendCount(userResp.data.friends.length);
            const postResponse = await fetchPosts({
              users: [userResp.data.id],
            });
            if (postResponse.data) setPosts(postResponse.data as Post[]);
          }
        }
        dispatch({
          type: "SET_LOADING",
          payload: false,
        });
      }
    })();
  }, [username]);

  const handleSaveBio = async () => {
    // Add your bio update logic here
    if (profileInfo) {
      dispatch({
        type: "SET_LOADING",
        payload: true,
      });
      const resp = await updateUser({
        id: profileInfo.id,
        payload: { bio },
      });
      if (resp?.message) {
        toast.error(resp.message);
      }
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });
    }
    setIsEditingBio(false);
  };

  const handleFriendshipStatus = async () => {
    if (!userInfo || !profileInfo) return;
    dispatch({
      type: "SET_LOADING",
      payload: true,
    });
    const payload: { requestedBy: string; requestedTo: string; add?: string } =
      {
        requestedBy: userInfo.id,
        requestedTo: profileInfo.id,
      };
    if (!friendshipStatus) {
      payload.add = "yes";
    }
    const resp = await toggleFriendship(payload);
    if (resp.status) {
      setFriendCount(friendCount + (!friendshipStatus ? 1 : -1));
      setFriendshipStatus(!friendshipStatus);
    } else toast.error(resp.message);
    dispatch({
      type: "SET_LOADING",
      payload: false,
    });
  };

  return (
    <DefaultLayout>
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          {/* Profile Image */}
          <div className="!w-32 !h-32 !md:w-40 !md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src={profileInfo?.profileImage}
              alt={`${profileInfo?.username}'s profile`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            {/* Top section: Username and friend controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              {/* Username */}
              <h1 className="text-2xl font-bold break-words">
                @{profileInfo?.username}
              </h1>

              {/* Friends count and button */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div>Friends: {friendCount}</div>
                {!isProfileEditable && (
                  <button
                    className={clsx(
                      "rounded-md h-[30px] px-4 border text-sm transition",
                      {
                        "bg-white text-blue-700 border-blue-300 hover:bg-blue-100":
                          theme === "light",
                        "bg-[#1f1f1f] text-white border-gray-600 hover:bg-gray-500":
                          theme === "dark",
                      }
                    )}
                    type="button"
                    onClick={handleFriendshipStatus}
                  >
                    {friendshipStatus ? "Remove Friend" : "Add Friend"}
                  </button>
                )}
              </div>
            </div>

            {/* Bio Section */}
            {isProfileEditable ? (
              <div className="mb-4">
                {isEditingBio ? (
                  <div className="flex flex-col gap-3">
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="border rounded p-2 w-full text-sm"
                      rows={3}
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setBio(profileInfo?.bio || "");
                          setIsEditingBio(false);
                        }}
                        className="px-3 py-1 text-sm bg-gray-200 rounded text-black"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveBio}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                    <p className="text-sm">{bio || "No bio yet!"}</p>
                    <button
                      onClick={() => setIsEditingBio(true)}
                      className="text-blue-500 hover:text-blue-700"
                      aria-label="Edit bio"
                    >
                      <EditIcon sx={{ width: "24px", height: "24px" }} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm">{bio}</p>
            )}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts?.map((post: Post) => (
            <div key={post.id} className="relative group aspect-square">
              <img
                src={post.image}
                alt={post.caption || "Post image"}
                className="w-full h-full object-cover rounded"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                <div className="text-white text-center p-4">
                  <p className="font-bold">{post.likes} likes</p>
                  {post.caption && (
                    <p className="text-sm mt-1">{post.caption}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts yet</p>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default Profile;
