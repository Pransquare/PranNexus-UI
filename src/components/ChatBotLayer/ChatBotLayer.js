import { Avatar, Box, Fab, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import botIcon from "../../assets/Images/chat bot icon.png";

const ChatBotLayer = ({ layerClicked }) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Show message after 1 second
    const showTimer = setTimeout(() => {
      setShowMessage(true);

      // Hide message after 3 seconds
      const hideTimer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(hideTimer);
    }, 1000);

    return () => clearTimeout(showTimer);
  }, []);

  return (
    <Box className="fixed bottom-5 -right-10 flex flex-col items-end">
      {showMessage && (
        <Box className="bg-white shadow-lg p-2 rounded-lg mb-2 animate-fade-in mr-10">
          <Typography variant="body2" className="text-gray-700">
            👋 Hi, I'm here to help!
          </Typography>
        </Box>
      )}
      <Fab
  aria-label="chat"
  onClick={layerClicked}
  onMouseEnter={() => setShowMessage(true)}
  onMouseLeave={() => setShowMessage(false)}
  sx={{
    backgroundColor: "rgb(15,168,233)",   // ✅ your custom color
    color: "#fff",                        // ✅ icon color
    "&:hover": { backgroundColor: "rgb(50,180,220)" }, // hover shade
  }}
>
  <Avatar
    src={botIcon}
    sx={{ width: 40, height: 40, backgroundColor: "white" }}
  />
</Fab>

    </Box>
  );
};

ChatBotLayer.propTypes = {
  layerClicked: PropTypes.func.isRequired,
};

export default ChatBotLayer;
