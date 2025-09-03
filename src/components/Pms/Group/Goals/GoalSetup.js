import { Box } from "@mui/material";
import React, { useState } from "react";
import { panelStyle } from "../../../../common/customStyles/CustomStyles";
import ConfigureForm from "../../../../common/customComponents/ConfigureForm";

const GoalSetup = () => {
  const [formData, setFormData] = useState();

  const configureForm = (input) => [];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <Box
      sx={{
        ...panelStyle,
      }}
    >
      <ConfigureForm
        data={configureForm(formData)}
        handleChange={handleChange}
      />
    </Box>
  );
};

export default GoalSetup;
