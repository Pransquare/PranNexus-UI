import React, { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  Select,
  Button,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import { GetGroups } from "../../../service/api/pmsService/GetGroups"; // Adjust the import path as needed
import { GetSubGroups } from "../../../service/api/pmsService/GetSubGroups";

function GroupSubGroupSelector({ onSearch }) {
  const [groups, setGroups] = useState([]);
  const [subGroups, setSubGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedSubGroupId, setSelectedSubGroupId] = useState("");
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [selectedSubGroupName, setSelectedSubGroupName] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await GetGroups();
        setGroups(response.res);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroupId) {
      const fetchSubGroups = async () => {
        try {
          const response = await GetSubGroups(selectedGroupId);
          setSubGroups(response.res);
        } catch (error) {
          console.error("Error fetching subgroups:", error);
        }
      };

      fetchSubGroups();
    }
  }, [selectedGroupId]);

  const handleGroupChange = (event) => {
    const groupId = event.target.value;
    const group = groups.find((g) => g.groupId === groupId);
    setSelectedGroupId(groupId);
    setSelectedGroupName(group?.groupName || "");
  };

  const handleSubGroupChange = (event) => {
    const subGroupId = event.target.value;
    const subGroup = subGroups.find((sg) => sg.subGroupId === subGroupId);
    setSelectedSubGroupId(subGroupId);
    setSelectedSubGroupName(subGroup?.subGroupName || "");
  };

  const handleSearch = () => {
    onSearch(selectedGroupName, selectedSubGroupName);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Group</InputLabel>
            <Select
              value={selectedGroupId}
              onChange={handleGroupChange}
              label="Group"
              sx={{ padding: "2px", margin: "2px 0" }}
            >
              {groups.map((group) => (
                <MenuItem key={group.groupId} value={group.groupId}>
                  {group.groupName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Subgroup</InputLabel>
            <Select
              value={selectedSubGroupId}
              onChange={handleSubGroupChange}
              label="Subgroup"
              disabled={!selectedGroupId}
              sx={{ padding: "2px", margin: "2px 0" }}
            >
              {subGroups.map((subGroup) => (
                <MenuItem key={subGroup.subGroupId} value={subGroup.subGroupId}>
                  {subGroup.subGroupName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container justifyContent="flex-end" marginBottom={2} spacing={1}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            disabled={!selectedGroupName || !selectedSubGroupName}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default GroupSubGroupSelector;