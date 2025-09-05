import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Images/Pransquarelogo.jpg";
import { validatePassword } from "../../common/commonValidation/CommonValidation";
import { UserManagentContext } from "../../customHooks/dataProviders/UserManagementProvider";
import { Environment } from "../../environments/Environment";
import {
  GetRoleNamesByUsername,
  ResetPwdWithOtp,
  SendOtp,
} from "../../service/api/login/loginService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [panel, setPanel] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formdata, setFormdata] = useState({
    userName: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { setuserManagementData } = useContext(UserManagentContext);

  const handlechange = (e) => {
    const { name, value } = e.target;
    if (name === "otp" && (isNaN(value) || value.length > 6)) return;
    setFormdata({ ...formdata, [name]: value });
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleForgotClick = () => {
    if (panel === "Login") setPanel("Send OTP");
    else setPanel("Login");
  };

  const handleLogin = async () => {
    if (!formdata.userName || !formdata.password) {
      setErrorMessage("Please fill all the fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${Environment.loginUrl}/apiiLogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formdata.userName,
          password: formdata.password,
        }),
      });

      // ✅ Handle HTTP errors (like 401, 500)
      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== "OK") {
        setErrorMessage("Invalid Username or Password");
      } else {
        const { userId, jwtToken, roles } = data;
        localStorage.setItem("jwtToken", jwtToken);
        localStorage.setItem(
          "expiryTime",
          dayjs().add(30000000, "milliseconds")
        );
        const user = { email: formdata.userName, roles: roles || [] };
        localStorage.setItem("userId", userId);
        localStorage.setItem("userMailId", formdata.userName);

        GetRoleNamesByUsername(formdata.userName)
          .then((roleNames) => {
            setuserManagementData({ roleTypes: roles, roleNames });
            localStorage.setItem("roleNames", JSON.stringify(roleNames));
            navigate("/home", { state: { user } });
          })
          .catch((error) => {
            console.error("Error fetching role names:", error);
            setErrorMessage("Error fetching role names");
          });
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      setErrorMessage(
        error.message.includes("Failed to fetch")
          ? "Invalid Username or Password"
          : "Invalid Username or Password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = () => {
    setIsLoading(true);
    SendOtp(formdata.userName)
      .then((data) => {
        if (data) {
          setPanel("Reset Password");
          setIsLoading(false);
        } else {
          setErrorMessage("Error sending OTP");
          setIsLoading(false);
        }
      })
      .catch((error) => {
        setErrorMessage("Something went wrong");
        console.error("Error:", error);
        setIsLoading(false);
      });
  };
  const handleVerifyOtp = () => {
    if (!formdata.otp || !formdata.password || !formdata.confirmPassword) {
      setErrorMessage("Please fill all the fields");
      return;
    }
    if (formdata.password !== formdata.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    if (!validatePassword(formdata.password)) {
      setErrorMessage(
        "Password must be at least 8 characters, include a lowercase, uppercase, number, and special character."
      );
      return;
    }
    setIsLoading(true);
    ResetPwdWithOtp({
      otp: formdata.otp,
      email: formdata.userName,
      password: formdata.password,
    })
      .then((data) => {
        console.log(typeof data);

        if (data.trim() === "Invalid or expired OTP.") {
          setErrorMessage("Invalid OTP or error resetting password");
          setIsLoading(false);
        } else {
          setErrorMessage("Password reset successful");
          setIsLoading(false);
          setPanel("Login");
        }
      })
      .catch();
  };

  const handleButtonClick = () => {
    switch (panel) {
      case "Login":
        handleLogin();
        break;
      case "Send OTP":
        handleSendOtp();
        break;
      case "Reset Password":
        handleVerifyOtp();
        break;
      default:
        break;
    }
  };

  const forgotPasswordInputs = (i) => (
    <TextField
      label="Username"
      variant="outlined"
      size="small"
      fullWidth
      type="email"
      value={i?.userName}
      name="userName"
      onChange={handlechange}
      InputLabelProps={{ shrink: true }}
    />
  );

  const sendOtpInputs = (i) => (
    <>
      <TextField
        label="Username"
        variant="outlined"
        size="small"
        fullWidth
        type="email"
        value={i?.userName}
        name="userName"
        onChange={handlechange}
        inputProps={{
          readOnly: true,
        }}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Enter OTP"
        placeholder="_ _ _ _ _ _"
        variant="outlined"
        fullWidth
        required
        size="small"
        value={i?.otp}
        name="otp"
        onChange={handlechange}
      />
      <TextField
        label="Password"
        variant="outlined"
        size="small"
        fullWidth
        type="password"
        value={i?.password}
        onChange={handlechange}
        name="password"
      />
      <TextField
        label="Confirm Password"
        variant="outlined"
        size="small"
        fullWidth
        type={showPassword ? "text" : "password"}
        value={i?.confirmPassword}
        onChange={handlechange}
        name="confirmPassword"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </>
  );

  const loginInputs = (i) => (
    <>
      <TextField
        label="Username"
        variant="outlined"
        size="small"
        fullWidth
        type="email"
        value={i?.userName}
        onChange={handlechange}
        name="userName"
        autoComplete="off"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Password"
        variant="outlined"
        size="small"
        fullWidth
        type={showPassword ? "text" : "password"}
        value={i?.password}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        InputLabelProps={{ shrink: true }}
        onChange={handlechange}
        name="password"
        autoComplete="off"
      />
    </>
  );
  useEffect(() => {
    console.log(panel);

    if (panel === "Reset Password") {
      setFormdata((prev) => ({ ...prev, password: "" }));
    } else if (panel === "Login") {
      setFormdata({
        userName: "",
        password: "",
        otp: "",
        confirmPassword: "",
      });
    }
  }, [panel]);
  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  }, [errorMessage]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        height: "100vh",
        width: "100%",
        "@media (max-width: 850px)": {
          padding: "0.5rem",
          flexDirection: "column",
        },
        padding: "1rem",
      }}
    >
      <Box
        sx={{
          width: "100%",
          // borderRight: "2px solid #ccc",
          paddingRight: "1rem",
          "@media (max-width: 850px)": {
            borderRight: "none",
          },
        }}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
            alignItems: "center",
          }}
        >
          <img
            src={logo}
            alt="Company Logo"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <Box
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "end",
              alignItems: "end", // Changed from "end" to "center" for better alignment
              gap: "0.5rem",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                marginBottom: "0.2rem",
                fontWeight: "bold",
              }}
            >
              Welcome to
            </Typography>
            <Typography
              variant="h4"
              style={{ fontWeight: "bold" }}
              color="primary.main"
            >
              Pran<span style={{ color: "#FE9900" }}>Nexus</span>
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "center",
            width: "60%",
            margin: "auto",
            border: "1px solid #ccc",
            padding: "2rem",
            backgroundColor: "#f9f9f9",
            borderRadius: "5px",
            "@media (max-width: 820px)": {
              width: "50%",
              padding: "1rem",
              gap: "0.5rem",
            },
            "@media (max-width: 600px)": {
              padding: "1rem",
              gap: "0.5rem",
              width: "100%",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "100%",
              maxWidth: "400px",
              "@media (max-width: 600px)": {
                maxWidth: "100%",
              },
            }}
          >
            {panel === "Login" && loginInputs(formdata)}
            {panel === "Send OTP" && forgotPasswordInputs(formdata)}
            {panel === "Reset Password" && sendOtpInputs(formdata)}
          </Box>
          <Box>
            <Typography
              sx={{ textAlign: "center" }}
              color={
                errorMessage === "Password reset successful"
                  ? "success.main"
                  : "error.main"
              }
            >
              {errorMessage}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              maxWidth: "400px",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              "@media (max-width: 600px)": { maxWidth: "100%" },
            }}
          >
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleButtonClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={20} color="primary" />
              ) : (
                panel
              )}
            </Button>
            <Link
              variant="text"
              sx={{ textAlign: "center", cursor: "pointer" }}
              onClick={handleForgotClick}
              color="error.main"
            >
              {panel === "Login" ? "Forgot Password?" : "Back to Login"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;

















