import { useState, ChangeEvent, FormEvent, useContext } from "react";
import DefaultLayout from "../Components/DefaultLayout";
import { Button } from "@mui/material";
import { GlobalContext } from "../contexts/GlobalContext";
import clsx from "clsx";
import useApiCall from "../hooks/useApiCall";
import { uploadPostAPI } from "../utility/apiService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddPostPage() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>("");
  const { state, dispatch } = useContext(GlobalContext);
  const navigate = useNavigate();
  const { theme } = state;

  const { fetchData: uploadPost } = useApiCall<
    unknown,
    { image: File; caption?: string }
  >(uploadPostAPI);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({
      type: "SET_LOADING",
      payload: true,
    });
    if (selectedFile instanceof File) {
      const resp = await uploadPost({
        image: selectedFile,
        caption,
      });
      if (!resp.status) {
        toast.error(resp.message);
      } else {
        toast.success("Post uploaded successfully.");
        navigate("/");
      }
    }
    dispatch({
      type: "SET_LOADING",
      payload: false,
    });
  };

  return (
    <DefaultLayout>
      <div className="max-w-lg w-full mx-auto mt-12 px-4 sm:px-6">
        <div
          className={clsx("rounded-2xl p-5 sm:p-6", {
            "shadow-xl": theme === "light",
            "bg-white/10 border border-white/10 backdrop-blur-lg drop-shadow-[0_4px_20px_rgba(255,255,255,0.1)]":
              theme === "dark",
          })}
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-8 text-center">
            POST SOMETHING
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="file"
              accept="image/*"
              required
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-2
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            />
            {image && (
              <img
                src={image}
                alt="Preview"
                className="max-w-full mx-auto w-auto max-h-64 object-cover rounded-lg border"
              />
            )}
            <span>Caption: </span>
            <textarea
              value={caption}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setCaption(e.target.value)
              }
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                width: "100%",
                backgroundColor: theme === "light" ? "#1976d2" : "white", // Blue button
                "&:hover": {
                  backgroundColor: theme === "light" ? "#1565c0" : "gray", // Darker blue on hover
                },
              }}
            >
              Post
            </Button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
}
