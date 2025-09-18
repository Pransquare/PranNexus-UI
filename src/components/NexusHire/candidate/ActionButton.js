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
      {/* <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ marginRight: 2 }}
      >
        Save
      </Button> */}


<Button
  variant="contained"
  onClick={handleSave}
  sx={{
    marginRight: 2,
    backgroundColor: "rgb(15,168,233)",
    color: "#fff",
    "&:hover": {
      backgroundColor: "rgb(12,150,210)",
    },
  }}
>
  Save
</Button>




      {/* <Button variant="contained" color="secondary" onClick={handleContinue}>
        Continue
      </Button> */}



<Button
  variant="contained"
  onClick={handleContinue}
  sx={{
    backgroundColor: "rgb(77,208,225)",
    color: "#fff",
    "&:hover": {
      backgroundColor: "rgb(60,170,185)",
    },
  }}
>
  Continue
</Button>





    </Box>
  );
};

export default ActionButton;
