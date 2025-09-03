import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";

function ContentDialog({
  openDialog,
  handleCloseDialog,
  title,
  content,
  actions = true, // Set default to true
  cancelText = "Close", // Default label for cancel button
  okText = "Update", // Default label for ok button
}) {
  return (
    <Dialog
      open={openDialog}
      onClose={() => {
        handleCloseDialog(false);
      }}
      PaperProps={{
        sx: {
          width: "70%", // Set the width to 70%
          maxWidth: "md", // Optional: limits the max width for large screens
        },
      }}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{content}</DialogContent>
      {actions && (
        <DialogActions>
          {cancelText && (
            <Button
              onClick={() => {
                handleCloseDialog(false);
              }}
              color="secondary"
            >
              {cancelText}
            </Button>
          )}
          {okText && (
            <Button
              onClick={() => {
                handleCloseDialog(true);
              }}
              color="primary"
            >
              {okText}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}

export default ContentDialog;
