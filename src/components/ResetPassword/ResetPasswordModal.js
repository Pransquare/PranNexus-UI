import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Import visibility icons
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ResetPassword } from "../../service/api/login/loginService"; // Ensure this path is correct
import { EmployeeDataContext } from "../../customHooks/dataProviders/EmployeeDataProvider";
import { validatePassword } from "../../common/commonValidation/CommonValidation";

const ResetPasswordModal = ({ open, onClose, onSubmit }) => {
  const { employeeData } = useContext(EmployeeDataContext);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // To handle error messages
  const [loading, setLoading] = useState(false); // To handle loading state
  const [showOldPassword, setShowOldPassword] = useState(false); // State to toggle old password visibility
  const [showNewPassword, setShowNewPassword] = useState(false); // State to toggle new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility

  const handleToggleOldPassword = () => setShowOldPassword(!showOldPassword);
  const handleToggleNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleToggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async () => {
    if (!validatePassword(newPassword)) {
      setError(
        "Password must be at least 8 characters, include a lowercase, uppercase, number, and special character."
      );
      return;
    }

    if (newPassword === confirmPassword) {
      setLoading(true);
      setError(""); // Clear any previous error
      const credentials = {
        username: employeeData?.emailId,
        oldPassword,
        newPassword,
      };

      try {
        const response = await ResetPassword(credentials);
        toast.success("Password reset successful!");
        onSubmit(employeeData?.emailId, newPassword);
        onClose();
      } catch (error) {
        console.error("Password reset failed", error);
        setError("Failed to reset password. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("New passwords do not match!");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="userName"
            label="Username"
            type="text"
            disabled
            fullWidth
            variant="outlined"
            value={employeeData?.emailId}
          />
          <TextField
            margin="dense"
            id="old-password"
            label="Old Password"
            type={showOldPassword ? "text" : "password"} // Toggle between text and password
            fullWidth
            variant="outlined"
            value={oldPassword}
            onChange={handleOldPasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle old password visibility"
                    onClick={handleToggleOldPassword}
                    edge="end"
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="dense"
            id="new-password"
            label="New Password"
            type={showNewPassword ? "text" : "password"} // Toggle between text and password
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={handleNewPasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle new password visibility"
                    onClick={handleToggleNewPassword}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="dense"
            id="confirm-password"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
            fullWidth
            variant="outlined"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleToggleConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResetPasswordModal;
