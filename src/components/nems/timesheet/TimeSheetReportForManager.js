import { Box, Button, Tab, Tabs } from "@mui/material";
import dayjs from "dayjs";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Toaster } from "../../../common/alertComponets/Toaster";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import { GetEmployeesByName } from "../../../service/api/nemsService/EmployeeService";
import {
  GenerateTimeSheetReportForManager,
  GetManagerTimesheetGrid,
} from "../../../service/api/nemsService/TimeSheetService";
import { GetAllWorkLocation } from "../../../service/api/hrConfig/hrConfig";
import { panelStyle } from "../../../common/customStyles/CustomStyles";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import ConfigTable from "../../../common/customComponents/ConfigTable";

const TimeSheetReportForManager = () => {
  const [formData, setFormData] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [workLocationData, setWorkLocationData] = useState([]);
  const { type } = useParams();
  const { employeeData } = useContext(EmployeeDataContext);

  const [gridData, setGridData] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const configForm = useCallback(
    (input) => {
      return [
        {
          label: "From Date",
          name: "dateFrom",
          type: "datePicker",
          value: input?.dateFrom ? dayjs(input.dateFrom) : null,
          maxDate: dayjs(),
          required: true,
        },
        {
          label: "To Date",
          name: "dateTo",
          type: "datePicker",
          value: input?.dateTo ? dayjs(input.dateTo) : null,
          minDate: dayjs(input?.dateFrom),
          maxDate: dayjs(),
          required: true,
        },
        {
          label: "Work Location",
          name: "workLocation",
          type: "multiSelect",
          value: input?.workLocation || [],
          required: true,
          options: workLocationData,
        },
        {
          name: "employee",
          label: "Employee Name",
          type: "suggestedDropdown",
          value: input?.employee,
          options:
            searchResults?.map((data) => ({
              key: data.employeeCode,
              value: data.fullName,
              subValue: data.emailId,
            })) || [],
        },
      ];
    },
    [searchResults, workLocationData]
  );

  const setOptions = useCallback((value) => {
    GetEmployeesByName(value)
      .then((data) => {
        setSearchResults(data);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "employee") {
      const employeeBasicDetailId = searchResults?.find(
        (data) => data.fullName === value
      )?.employeeBasicDetailId;

      if (employeeBasicDetailId) {
        setFormData((prev) => ({
          ...prev,
          selectedEmployee: employeeBasicDetailId,
        }));
        setSearchResults([]);
        return;
      }

      if (value?.length > 2) setOptions(value);
      setSearchResults([]);
      setFormData((prev) => ({ ...prev, selectedEmployee: null }));
    }
  };

  const submitClicked = () => {
    if (
      !formData?.dateFrom ||
      !formData?.dateTo ||
      !formData?.workLocation?.length
    ) {
      Toaster("error", "Please fill all the mandatory fields");
      return;
    }

    GenerateTimeSheetReportForManager({
      fromDate: dayjs(formData.dateFrom).format("YYYY-MM-DD"),
      toDate: dayjs(formData.dateTo).format("YYYY-MM-DD"),
      employeeId: formData.selectedEmployee || null,
      workLocationCode: formData.workLocation,
      type: type,
      managerId: employeeData.employeeBasicDetailId,
    }).catch((err) => {
      console.error("Report generation error:", err);
    });
  };

  const showReportClicked = async () => {
    if (
      !formData?.dateFrom ||
      !formData?.dateTo ||
      !formData?.workLocation?.length
    ) {
      Toaster("error", "Please fill all the mandatory fields");
      return;
    }

    const payload = {
      fromDate: dayjs(formData.dateFrom).format("YYYY-MM-DD"),
      toDate: dayjs(formData.dateTo).format("YYYY-MM-DD"),
      empBasicDetailId: formData.selectedEmployee || null,
      approverId: employeeData.employeeBasicDetailId,
      page: page,
      size: pageSize,
      worklocation: formData.workLocation,
    };

    try {
      const response = await GetManagerTimesheetGrid(payload);
      if (Array.isArray(response.content)) {
        const formattedData = response.content.map((item) => [
          { value: item.employeeEntity?.fullName || "N/A", isPrint: true },
          { value: item.taskDate || "N/A", isPrint: true },
          { value: item.taskName || "N/A", isPrint: true },
          {
            value: item.timeInvested || `${item.hours}h ${item.minutes}m`,
            isPrint: true,
          },
          { value: item.projectCode || "N/A", isPrint: true },
          {
            value: item.statusMasterEntity?.description || item.status || "N/A",
            isPrint: true,
          },
        ]);

        setGridData(formattedData);
        setTotalPages(response.totalPages);
      } else {
        setGridData([]);
        setTotalPages(0);
        Toaster("error", "No data found");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Toaster("error", "Failed to fetch timesheet grid");
    }
  };

  useEffect(() => {
    GetAllWorkLocation()
      .then((res) => {
        setWorkLocationData(
          res.map((a) => ({
            key: a.workLocationCode,
            value: a.workLocation,
          }))
        );
      })
      .catch((_err) => {
        Toaster("error", "Failed to fetch work locations");
      });
  }, []);

  useEffect(() => {
    setFormData({});
  }, [type]);

  return (
    <Box sx={{ ...panelStyle, paddingBottom: "1rem" }}>
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
        <Tab label={`Timesheet report`} value={0} />
      </Tabs>
      <Box>
        <ConfigureForm
          data={configForm(formData)}
          handleChange={handleChange}
          buttonsHide={{ reset: false, save: false }}
          actionsHide={true}
        />
        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              setFormData({});
              setSearchResults([]);
            }}
          >
            Reset
          </Button>
          <Button variant="contained" color="primary" onClick={submitClicked}>
            Download
          </Button>
          <Button
            variant="contained"
            color="warning"
            sx={{ textTransform: "uppercase" }}
            onClick={showReportClicked}
          >
            Show Report
          </Button>
        </Box>
      </Box>

      <Box mt={2}>
        <ConfigTable
          data={{ content: gridData }}
          headers={[
            "Employee Name",
            "Task Date",
            "Task Name",
            "Time Invested",
            "Project Code",
            "Status",
          ]}
          actions={() => {}}
          pagination={true}
          page={page}
          rowsPerPage={pageSize}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => setPageSize(e.target.value)}
          totalCount={totalPages}
          selectionTable={false}
          onSelectedRowsChange={() => {}}
        />
      </Box>
    </Box>
  );
};

export default TimeSheetReportForManager;
