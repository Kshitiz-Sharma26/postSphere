import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box, TextField, Typography, Button, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useApiCall from "../hooks/useApiCall";
import { loginUserAPI } from "../utility/apiService";
import { toast } from "react-toastify";
import { useContext } from "react";
import { GlobalContext } from "../contexts/GlobalContext";

// Define the schema
const schema = z.object({
  username: z
    .string()
    .min(1, "This field is required")
    .regex(/^[A-Za-z]/, "Username must start with a letter")
    .regex(/^[A-Za-z0-9]*$/, "Username must not contain special characters")
    .toLowerCase(),
  password: z.string().min(1, "This field is required"),
});

// Infer the type from the schema
type FormData = z.infer<typeof schema>;

const Login: React.FC = () => {
  const { dispatch } = useContext(GlobalContext);
  const navigate = useNavigate();
  const { fetchData: loginUser } = useApiCall<
    undefined,
    {
      username: string;
      password: string;
    }
  >(loginUserAPI);
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    dispatch({
      type: "SET_LOADING",
      payload: true,
    });
    const resp = await loginUser({
      username: data.username,
      password: data.password,
    });
    if (resp?.message) {
      toast.error(resp.message);
    } else if (resp?.data) {
      navigate("/");
      document.location.reload();
    }
    dispatch({
      type: "SET_LOADING",
      payload: false,
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1976d2",
        color: "white",
        p: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Column on small screens, row on large screens
          maxWidth: "1200px",
          width: "100%",
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          p: 4,
        }}
      >
        {/* Left Side: App Name and Intro Message */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            color: "#1976d2", // Blue text
            mb: { xs: 4, md: 0 }, // Margin bottom on small screens
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
            POSTSPHERE
          </Typography>
          <Typography variant="h6">
            Welcome to My App! Signup to share posts and chat with your known
            ones.
          </Typography>
        </Box>

        {/* Right Side: Form */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                mx: "auto",
                gap: 3, // Spacing between fields
                width: "100%",
                maxWidth: "400px", // Limit form width
              }}
            >
              <TextField
                error={touchedFields.username && !!errors.username?.message}
                helperText={touchedFields.username && errors.username?.message}
                {...register("username")}
                label="Username"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#1976d2", // Blue border
                    },
                    "&:hover fieldset": {
                      borderColor: "#1976d2", // Blue border on hover
                    },
                  },
                }}
              />
              <TextField
                error={touchedFields.password && !!errors.password?.message}
                helperText={touchedFields.password && errors.password?.message}
                {...register("password")}
                label="Password"
                type="password"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#1976d2", // Blue border
                    },
                    "&:hover fieldset": {
                      borderColor: "#1976d2", // Blue border on hover
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#1976d2", // Blue button
                  "&:hover": {
                    backgroundColor: "#1565c0", // Darker blue on hover
                  },
                }}
              >
                Log In
              </Button>
            </Box>
          </form>
          <div className="text-black text-center mt-2 text-sm">
            Don't have an account?{" "}
            <Link
              component="button"
              variant="body2"
              underline="none"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Sign up
            </Link>
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
