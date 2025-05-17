import { useContext, useRef, useState } from "react";
import DefaultLayout from "../Components/DefaultLayout";
import SearchIcon from "@mui/icons-material/Search";
import { GlobalContext } from "../contexts/GlobalContext";
import clsx from "clsx";
import useApiCall from "../hooks/useApiCall";
import { listUsersAPI } from "../utility/apiService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SearchProfile: React.FC = () => {
  const { state, dispatch } = useContext(GlobalContext);
  const { theme } = state;
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncerTimer = useRef<number>(0);
  const navigate = useNavigate();
  const { fetchData: fetchUsers } = useApiCall<
    {
      username: string;
      id: string;
      profileImage: string;
    }[],
    { searchKey: string }
  >(listUsersAPI);
  const [users, setUsers] = useState<
    {
      username: string;
      id: string;
      profileImage: string;
    }[]
  >([]);

  const makeUsersRequest = async (searchKey: string) => {
    dispatch({
      type: "SET_LOADING",
      payload: true,
    });
    const resp = await fetchUsers({ searchKey });
    dispatch({
      type: "SET_LOADING",
      payload: false,
    });
    if (resp.message) {
      toast.error(resp.message);
    } else if (resp.data) setUsers(resp.data);
  };

  const searchHandler = () => {
    clearTimeout(debouncerTimer.current);
    const timeoutId = setTimeout(() => {
      if (inputRef.current?.value) makeUsersRequest(inputRef.current.value);
      else setUsers([]);
    }, 1000);
    debouncerTimer.current = timeoutId;
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="px-2 relative">
          <SearchIcon
            className={clsx(
              "absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500",
              {
                "text-white": theme === "dark",
              }
            )}
          />
          <input
            type="text"
            ref={inputRef}
            className="p-2 pl-10 border border-gray-400 rounded-[16px] w-full my-4 focus:outline-none focus:border-gray-400"
            placeholder="Search..."
            onChange={searchHandler}
          />
        </div>
        <div className="h-full overflow-y-auto p-2 space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className={clsx(
                "flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer",
                {
                  "hover:bg-gray-100": theme === "light",
                  "hover:bg-zinc-700": theme === "dark",
                }
              )}
              onClick={() => {
                navigate(`/profile/${user.username}`);
              }}
            >
              {/* Profile Image */}
              <img
                src={user.profileImage}
                alt={`${user.username}'s profile`}
                className={clsx(
                  "w-10 h-10 rounded-full object-cover border-2",
                  {
                    "border-[#1976d2]": theme === "light",
                    "border-white": theme === "dark",
                  }
                )}
              />

              {/* Username */}
              <div
                className={clsx("font-medium truncate", {
                  "text-[#1976d2]": theme === "light",
                  "text-white": theme === "dark",
                })}
              >
                {user.username}
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="text-center py-4 text-gray-500">No users found</div>
          )}
        </div>
        <div
          className={`flex-1 overflow-y-auto px-4 py-2 transition-colors ${
            theme === "dark"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-black"
          }`}
        ></div>
        {/* Fixed Input Area */}
      </div>
    </DefaultLayout>
  );
};

export default SearchProfile;
