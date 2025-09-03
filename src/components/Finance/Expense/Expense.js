import { Box, Tab, Tabs } from "@mui/material";
import React from "react";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import ExpenseSubmission from "./ExpenseSubmission/ExpenseSubmission";

function Expense() {
  const tabsContainer = () => <ExpenseSubmission />;
  return (
    <Box sx={{ ...panelStyle, p: 0 }} component="div">
      <Tabs
        sx={{
          marginTop: 0,
          borderBottom: "1px solid #e8e8e8",
          "& .MuiTab-root": {
            fontSize: "12px",
            minWidth: "50px",
            padding: "6px 12px",
          },
          "& .MuiTab-wrapper": {
            marginTop: "0",
          },
        }}
        value={0}
        variant="scrollable"
      >
        <Tab label="Expenses" value={0} />
      </Tabs>
      {tabsContainer()}
    </Box>
  );
}

export default Expense;
