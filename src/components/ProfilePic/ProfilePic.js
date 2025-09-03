import React, { useState, useRef } from "react";
import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import defaultProfilePic from "../../../src/assets/Images/profile.png"; // Update the path as needed
import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";

// Styling for the components
const ProfilePicWrapper = styled("div")({
  position: "relative",
  display: "inline-block",
  cursor: "pointer", // Cursor pointer for hover effect
  alignContent: "center", // Ensure the content is centered within the wrapper
});

const ProfilePicModal = styled(Dialog)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& .MuiDialog-paper": {
    minWidth: "500px", // Adjust width
    minHeight: "600px", // Increased height to accommodate Cropper
    overflow: "hidden", // Prevent scrolling
    display: "flex",
    flexDirection: "column", // Make sure content inside dialog is vertically aligned
  },
});

const ProfileImageWrapper = styled("div")({
  display: "flex",
  justifyContent: "center", // Horizontally center the image
  alignItems: "center", // Vertically center the image
  height: "70%", // Adjust the height so the image doesn't overflow
  padding: "20px", // Add some padding for aesthetics
  overflow: "hidden", // Prevent image overflow
});

const ProfileImage = styled("img")({
  width: "75%", // Make image fill 100% of the wrapper's width
  height: "auto", // Maintain the aspect ratio of the image
  borderRadius: "8px", // Optional: round the corners of the image
});

const FileInputButton = styled(Button)({
  width: "100%", // Make button take full width of the dialog
  marginTop: "20px",
});

function ProfilePic({
  profilePic,
  setProfilePic,
  onImageSelect,
  onRemoveImage,
}) {
  const [dialogOpen, setDialogOpen] = useState(false); // State to manage the dialog box
  const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image file
  const [croppedImage, setCroppedImage] = useState(null); // State to store the cropped image URL
  const cropperRef = useRef(null); // Ref for the Cropper component

  // Handle file input change for uploading a new image
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const fileURL = URL.createObjectURL(file); // Create a URL for the selected file
      setSelectedImage(fileURL); // Set the selected image for cropping
    }
  };

  // Handle cropping the image
  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedDataURL = cropper.getCroppedCanvas().toDataURL(); // Get the cropped image as a data URL
      setCroppedImage(croppedDataURL); // Set the cropped image
      setProfilePic(croppedDataURL); // Update the profilePic state with the cropped image
      setDialogOpen(false); // Close the dialog after cropping
      // Optionally, you can handle uploading the cropped image file to the backend here
      if (onImageSelect) {
        // Convert data URL to a File object
        fetch(croppedDataURL)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], "croppedImage.png", {
              type: "image/png",
            });
            onImageSelect(file);
          })
          .catch();
      }
    }
  };

  const handleRemoveImage = () => {
    setProfilePic(null); // Reset the profilePic state to null
    setCroppedImage(null); // Reset the cropped image
    setSelectedImage(null); // Reset the selected image
    setDialogOpen(false); // Close the dialog
    if (onRemoveImage) {
      onRemoveImage(); // Callback to handle the removal of the profile picture (backend removal)
    }
  };

  // Open the dialog to upload a new image
  const handleClickOpen = () => {
    setDialogOpen(true); // Open the dialog box
  };

  // Close the dialog without uploading
  const handleClose = () => {
    setDialogOpen(false);
    setSelectedImage(null); // Reset the selected image if dialog is closed without cropping
  };

  return (
    <ProfilePicWrapper>
      <Avatar
        src={profilePic || defaultProfilePic} // Use default if no profile pic exists
        sx={{ width: "175px", height: "175px" }}
        onClick={handleClickOpen} // Open dialog when profile pic is clicked
      />

      {/* Dialog Box to upload and crop a new image */}
      <ProfilePicModal open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Upload and Crop Profile Picture</DialogTitle>
        <DialogContent>
          {selectedImage ? (
            // Show Cropper if an image is selected
            <Cropper
              src={selectedImage}
              style={{ height: 400, width: "100%" }}
              // Cropper.js options
              aspectRatio={1} // Square aspect ratio for profile pictures
              guides={false}
              viewMode={1}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false}
              ref={cropperRef}
            />
          ) : (
            // Show the current or default profile image before selecting a new one
            <ProfileImageWrapper>
              <ProfileImage
                src={profilePic || defaultProfilePic}
                alt="Profile"
              />
            </ProfileImageWrapper>
          )}

          {/* Styled file input button */}
          {!selectedImage && (
            <div>
              <input
                type="file"
                accept="image/*"
                id="upload-file"
                onChange={handleFileChange} // Handle file input change
                style={{ display: "none" }} // Hide the default file input
              />
              <label htmlFor="upload-file">
                <FileInputButton variant="contained" component="span">
                  Choose File
                </FileInputButton>
              </label>
            </div>
          )}
        </DialogContent>
        <DialogActions
          style={{
            flexDirection: "column",
            alignItems: "stretch",
            padding: "16px",
          }}
        >
          {selectedImage ? (
            // Show Crop and Cancel buttons when cropping
            <>
              <Button
                onClick={handleCrop}
                variant="contained"
                color="primary"
                style={{ width: "100%", marginBottom: "10px" }}
              >
                Crop
              </Button>
              <Button
                onClick={() => setSelectedImage(null)}
                variant="outlined"
                color="secondary"
                style={{ width: "100%" }}
              >
                Cancel
              </Button>
            </>
          ) : (
            // Show Remove and Cancel buttons when not cropping
            <>
              {profilePic && (
                <Button
                  onClick={handleRemoveImage}
                  variant="outlined"
                  color="secondary"
                  style={{ width: "100%", marginBottom: "10px" }}
                >
                  Remove Profile Picture
                </Button>
              )}
              <Button
                onClick={handleClose}
                color="primary"
                style={{ width: "100%" }}
              >
                Close
              </Button>
            </>
          )}
        </DialogActions>
      </ProfilePicModal>
    </ProfilePicWrapper>
  );
}

export default ProfilePic;
