import { Chip, Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Toaster } from "../../../common/alertComponets/Toaster";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import {
  GetAllGoals,
  GetGroupAndSubgroups,
  SaveGoalsforGroup,
  SearchGoalsByGroupAndSubgroup,
} from "../../../service/api/hrConfig/hrConfig";

const defaultFormData = {
  group: "",
  subGroup: "",
  goals: [],
};
const defaultError = {
  group: "",
  subGroup: "",
  goals: "",
};
function GroupsSubGroups() {
  const { employeeData } = useContext(EmployeeDataContext);
  const [formData, setFormData] = useState(defaultFormData);
  const [error, setError] = useState(defaultError);
  const [data, setData] = useState([]);
  const [tabsValue, setTabsValue] = useState(0);
  const [disable, setDisable] = useState(false);
  const [groups, setgroups] = useState([]);
  const [goals, setgoals] = useState([]);
  const [pagable, setPagable] = useState({
    page: 0,
    size: 5,
  });
  const [totalCount, setTotalCount] = useState(0);
  const validate = useCallback(() => {
    let tempError = { ...defaultError };
    let isValid = true;
    if (!formData.group) {
      tempError.group = "Group is required.";
      isValid = false;
    }
    if (!formData.subGroup) {
      tempError.subGroup = "Subgroup is required.";
      isValid = false;
    }
    if (!formData.goals.length) {
      tempError.goals = "Goals are required.";
      isValid = false;
    }
    setError(tempError);
    return isValid;
  }, [formData.goals.length, formData.group, formData.subGroup]);
  const configureForm = useCallback(
    (input) => {
      return [
        {
          label: "Group",
          name: "group",
          type: "dropDownList",
          value: input?.group,
          options: groups.map((data) => ({
            key: data.groupName,
            value: data.description,
          })),
          error: error.group,
          required: true,
        },
        {
          label: "Subgroup",
          name: "subGroup",
          type: "dropDownList",
          value: input?.subGroup,
          options: groups
            ?.find((data) => data.description === input?.group)
            ?.subGroupDetails?.map((data) => ({
              key: data.subGroupName,
              value: data.description,
            })),
          error: error.subGroup,
          required: true,
        },
        !tabsValue && {
          label: "Goals",
          name: "goals",
          type: "multiSelect",
          value: input?.goals,
          options: goals.map((a) => ({
            key: a.goalCode,
            value: a.goal,
          })),
          error: error.goals,
          required: true,
        },
      ];
    },
    [tabsValue, error, groups, goals]
  );
  const handleFormChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : prevErrors[name],
    }));
  }, []);
  const tabsChange = (_event, newValue) => {
    setTabsValue(newValue);
    reset();
  };
  const configTable = useCallback((input) => {
    return {
      actions: {
        edit: true,
        delete: true,
        view: true,
      },
      content: input?.map((content) => {
        return [
          {
            forAction: false,
            isPrint: true,
            value: content?.group,
          },
          {
            forAction: false,
            isPrint: true,
            value: content?.subGroup,
          },
          {
            forAction: false,
            isPrint: true,
            // value: content?.goals?.join(", "),
            value: content?.goals.map((goal, index) => (
              <Chip
                key={goal + index}
                size="small"
                label={goal}
                style={{ margin: 2 }}
              />
            )),
          },
          {
            forAction: true,
            isPrint: false,
            value: content,
          },
        ];
      }),
    };
  }, []);

  const reset = () => {
    setFormData(defaultFormData);
    setError(defaultError);
    setDisable(false);
  };

  const fetching = useCallback(() => {
    SearchGoalsByGroupAndSubgroup({
      group: tabsValue ? formData.group : null,
      subGroup: tabsValue ? formData.subGroup : null,
      ...pagable,
    })
      .then((result) => {
        if (result && result.response) {
          result.response.content = result.response.content.map((content) => ({
            configId: content.groupSubgroupConfigId,
            group: content.group,
            subGroup: content.subGroup,
            goals: content.groupSubgroupGoalEntity.map(
              (goalEntity) => goalEntity.goal
            ),
          }));
          setData(result.response.content);
          setTotalCount(result.response.totalElements);
        }
      })
      .catch();
  }, [tabsValue, formData, pagable]);

  const handleFormSubmit = useCallback(() => {
    if (tabsValue) {
      fetching();
    } else {
      if (!validate()) return;
      SaveGoalsforGroup({
        createdBy: employeeData?.emailId,
        ...formData,
        status: "108",
      })
        .then((res) => {
          if (res) {
            Toaster("success", "Goals saved successfully.");
            fetching();
          } else {
            Toaster("error", "Error saving goals.");
          }
        })
        .catch();
      reset();
    }
  }, [tabsValue, fetching, validate, employeeData?.emailId, formData]);

  const actionClick = (action, rowData) => {
    if (action === "edit") {
      setFormData(rowData);
      setDisable(false);
      setTabsValue(0);
    } else if (action === "delete") {
      SaveGoalsforGroup({
        createdBy: employeeData?.emailId,
        ...rowData,
        status: "109",
      })
        .then((res) => {
          if (res) {
            Toaster("success", "Entry deleted.");
            setDisable(false);
            reset();
            fetching();
          } else {
            Toaster("error", "something went wrong");
          }
        })
        .catch();
    } else if (action === "view") {
      setDisable(true);
      setFormData(rowData);
      setTabsValue(0);
    }
  };

  useEffect(() => {
    fetching();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagable, tabsValue]);

  useEffect(() => {
    GetGroupAndSubgroups()
      .then((result) => {
        if (result && result.res) {
          setgroups(result.res);
        }
      })
      .catch();
    GetAllGoals()
      .then((res) => {
        setgoals(res);
      })
      .catch();
  }, []);

  return (
    <>
      <Tabs
        sx={{
          marginTop: 0,
          borderBottom: "1px solid #e8e8e8",
          "& .MuiTab-root": {
            fontSize: "12px", // Decrease the font size
            minWidth: "50px", // Decrease the minimum width of each tab
            padding: "6px 12px", // Adjust the padding of each tab
          },
          "& .MuiTab-wrapper": {
            marginTop: "0", // Decrease the margin top of each tab
          },
        }}
        value={tabsValue}
        onChange={tabsChange}
        variant="scrollable"
      >
        <Tab label="Configure" />
        <Tab label="Search" />
      </Tabs>
      <Box sx={panelStyle}>
        <ConfigureForm
          data={configureForm(formData)}
          handleChange={handleFormChange}
          buttonTitle={tabsValue ? "Search" : "Save"}
          submitClicked={handleFormSubmit}
          resetButton={reset}
          formDisabled={disable}
        />
        <ConfigTable
          data={configTable(data)}
          headers={["Group", "Subgroup", "Goals", "Action"]}
          actions={actionClick}
          pagination={true}
          page={pagable.page}
          rowsPerPage={pagable.size}
          onPageChange={(event, page) => setPagable({ ...pagable, page })}
          onRowsPerPageChange={(event) =>
            setPagable({ ...pagable, size: event.target.value })
          }
          totalCount={totalCount}
        />
      </Box>
    </>
  );
}

export default GroupsSubGroups;
