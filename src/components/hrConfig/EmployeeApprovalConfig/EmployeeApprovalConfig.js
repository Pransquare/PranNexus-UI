import { Button, Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import {
  GetEmployeesByName,
  GetEmployeesByStatus,
} from "../../../service/api/emsService/EmployeeService";
import ApprovalConfig from "./ApprovalConfig";
import { GetAllDesignations } from "../../../service/api/DesinationService";

const defaultFormData = {
  employeeCode: "",
};
function EmployeeApprovalConfig() {
  const [tabsValue, setTabsValue] = useState(0);
  const [searchScreen, setSearchScreen] = useState(true);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState(defaultFormData);
  const [totalCount, setTotalCount] = useState(0);
  const [pagable, setPagable] = useState({ page: 0, size: 5 });
  const [employeeData, setEmployeeData] = useState();
  const [designationsMap, setDesignationsMap] = useState({});
  const [searchResults, setSearchResults] = useState([]);

  const fetchDesignations = useCallback(() => {
    GetAllDesignations()
      .then((result) => {
        if (result) {
          const map = result.reduce((acc, item) => {
            acc[item.designationCode] = item.designationDescription;
            return acc;
          }, {});
          setDesignationsMap(map);
        }
      })
      .catch((error) => console.error("Error fetching designations:", error));
  }, []);

  useEffect(() => {
    fetchDesignations();
  }, [fetchDesignations]);

  const CustomButtons = ({ data }) => (
    <Box variant="contained" aria-label="Basic button group" size="small">
      {!tabsValue ? (
        <Button
          size="small"
          color="warning"
          onClick={() => {
            setSearchScreen(false);
            setEmployeeData({ ...data, type: "create" });
          }}
        >
          Configure
        </Button>
      ) : (
        <Button
          size="small"
          color="warning"
          onClick={() => {
            setSearchScreen(false);
            setEmployeeData({ ...data, type: "edit" });
          }}
        >
          Update
        </Button>
      )}
    </Box>
  );

  const tabsChange = (event, newValue) => {
    setTabsValue(newValue);
    setFormData();
    setSearchResults([]);
  };

  const configureForm = useCallback(
    (input) => [
      {
        name: "approverName",
        label: "Employee name",
        type: "suggestedDropdown",
        value: input?.approverName,
        required: true,
        options: searchResults?.map((data) => {
          return {
            key: data.employeeCode,
            value: data.fullName,
            subValue: data.emailId,
          };
        }),
      },
    ],
    [searchResults]
  );

  const contentConfig = useCallback(
    (data) => ({
      actions: {
        edit: false,
        delete: false,
        view: false,
      },
      content: data?.map((input) => [
        {
          forAction: false,
          isPrint: true,
          value: `${input?.firstName} ${input?.lastName}`,
        },
        {
          forAction: false,
          isPrint: true,
          value: input?.employeeCode,
        },
        {
          forAction: false,
          isPrint: true,
          value: designationsMap[input?.designation] || "N/A",
        },
        {
          forAction: true,
          isPrint: false,
          value: input,
          customActions: <CustomButtons data={input} />,
        },
      ]),
    }),
    [data, designationsMap]
  );

  const fetching = useCallback(
    (employeeCode) => {
      GetEmployeesByStatus({
        employeeCode,
        status: !tabsValue ? "111" : "108",
        ...pagable,
      }).then((result) => {
        setData(result?.content);
        result?.content && setTotalCount(result?.totalElements);
      });
    },
    [formData, tabsValue, pagable]
  );

  const paginationChange = (type, value) => {
    if (type === "pageChange") {
      setPagable((prev) => ({ ...prev, page: value }));
    } else {
      setPagable((prev) => ({ ...prev, size: value }));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    const employeeCode = searchResults?.find(
      (data) => data.fullName === value
    )?.employeeCode;
    if (employeeCode) {
      setSearchResults([]);
      fetching(employeeCode);
      return;
    }
    if (value.length > 2) {
      setOptions(value);
    }
    setSearchResults([]);
    if (!value) {
      setFormData();
      fetching();
    }
  };

  const setOptions = useCallback((value) => {
    GetEmployeesByName(value)
      .then((data) => {
        setSearchResults(data);
      })
      .catch();
  }, []);

  const decisionClick = () => {
    setSearchScreen(true);
  };

  useEffect(() => {
    if (!searchScreen) return;
    fetching();
  }, [tabsValue, pagable, searchScreen]);

  return (
    <Box>
      {searchScreen ? (
        <>
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
            value={tabsValue}
            onChange={tabsChange}
            variant="scrollable"
          >
            <Tab label="Pending" />
            <Tab label="Existing" />
          </Tabs>
          <Box sx={panelStyle}>
            <ConfigureForm
              data={configureForm(formData)}
              handleChange={handleChange}
              actionsHide={false}
            />
            <ConfigTable
              data={contentConfig(data)}
              headers={[
                "Employee Name",
                "Employee Code",
                "Designation",
                "Action",
              ]}
              pagination={true}
              page={pagable?.page}
              rowsPerPage={pagable?.size}
              onPageChange={(event, newPage) => {
                paginationChange("pageChange", newPage);
              }}
              onRowsPerPageChange={(event) => {
                paginationChange("rowsPerPageChange", event.target.value);
              }}
              totalCount={totalCount}
            />
          </Box>
        </>
      ) : (
        <ApprovalConfig
          employeeData={employeeData}
          decisionClick={decisionClick}
        />
      )}
    </Box>
  );
}

export default EmployeeApprovalConfig;
