import React from "react";
import { Button, Box } from "@mui/material";

const ActionButton = ({ handleSave, handleContinue }) => {
  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      mt={2}
      sx={{
        position: "sticky",
        bottom: 0,
        backgroundColor: "white", // Ensure it contrasts with the content
        zIndex: 99, // Keep it above other elements
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ marginRight: 2 }}
      >
        Save
      </Button>
      <Button variant="contained" color="secondary" onClick={handleContinue}>
        Continue
      </Button>
    </Box>
  );
};

export default ActionButton;
