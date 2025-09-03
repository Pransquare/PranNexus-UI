import {
  Box,
  Button,
  DialogContentText,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Toaster } from "../../../common/alertComponets/Toaster";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import ContentDialog from "../../../common/customComponents/Dailogs/ContentDailog";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import {
  GetEmployeesByApproverId,
  GetWeekendApprovals,
  SaveAndApproveWeekend,
  SendForApprovalAndApprove,
  SerchAttendanceDetails,
} from "../../../service/api/emsService/TimeSheetService";
import { GetAllProjects } from "../../../service/api/ProjectService";

const defaultFormData = {
  employeeId: "",
};

function TimeSheetApproval({ taskData }) {
  const [projectData, setProjectData] = useState([]);
  const [formData, setFormData] = useState(defaultFormData);
  const [data, setData] = useState([]);
  const [employeesData, setEmployeesData] = useState([]);
  const { employeeData } = useContext(EmployeeDataContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedTimeSheets, setSelectedTimeSheets] = useState([]);
  const [remarks, setRemarks] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const [alignment, setAlignment] = useState("task approvals");

  // Function to approve/reject timesheets
  const changeEmployeeTimeSheetStatus = (type, a) => {
    let req = {
      attendanceEmpIdModels: [],
      basicEmpDetailId: employeeData?.employeeBasicDetailId,
      comments: remarks,
    };
    if (a) {
      req.attendanceEmpIdModels = [
        {
          attendanceId: a.attendanceId,
          status: type === "approve" ? "102" : "103",
        },
      ];
    } else {
      req.attendanceEmpIdModels = data
        .filter((_d, i) => selectedTimeSheets.includes(i))
        .map((d) => ({
          attendanceId: d.attendanceId,
          status: type === "approve" ? "102" : "103",
        }));
    }
    SendForApprovalAndApprove(req)
      .then((response) => {
        if (response) {
          getTimeSheetDetailsForApprover(); // Refresh data
          if (type === "approve") {
            Toaster("success", "Approved");
          } else {
            Toaster("warning", "Rejected");
          }
        }
      })
      .catch((error) => {
        console.error("Error sending approval:", error);
      });
  };

  const customButtons = (data) => {
    return (
      <Box variant="contained" aria-label="Basic button group" size="small">
        <Button
          size="small"
          color="warning"
          onClick={() => {
            if (alignment === "entry date approval") {
              const payload = { ...data, status: "103" };
              SaveAndApproveWeekend(payload)
                .then(() => {
                  Toaster("error", "Rejected");
                  getTimeSheetDetailsForApprover();
                })
                .catch(() => {
                  Toaster("error", "Error rejecting");
                });
              return;
            }
            setOpenDialog(true);
            setSelectedData(data);
          }}
        >
          Reject
        </Button>
        <Button
          size="small"
          color="success"
          onClick={() => {
            if (alignment === "entry date approval") {
              const payload = { ...data, status: "102" };
              SaveAndApproveWeekend(payload)
                .then(() => {
                  Toaster("success", "Approved");
                  getTimeSheetDetailsForApprover();
                })
                .catch(() => {
                  Toaster("error", "Error approving");
                });
              return;
            }
            changeEmployeeTimeSheetStatus("approve", data);
          }}
        >
          Approve
        </Button>
      </Box>
    );
  };

  const getEmployeesByApproverId = useCallback(() => {
    GetEmployeesByApproverId(employeeData?.employeeBasicDetailId, "timesheet")
      .then((employees) => {
        setEmployeesData(employees);
      })
      .catch((_error) => {
        setEmployeesData([]);
      });
  }, [employeeData]);

  const getTimeSheetDetailsForApprover = useCallback(() => {
    const payload = {
      empBasicDetailId: formData.employeeId || null,
      approverId: employeeData?.employeeBasicDetailId,
      status: ["101"],
      size: rowsPerPage,
      page: page,
    };
    if (alignment === "entry date approval") {
      GetWeekendApprovals(payload)
        .then((res) => {
          if (res?.data?.content?.length) {
            setData(res.data.content);
            setTotalCount(res.data.totalElements);
          } else {
            setData([]);
          }
        })
        .catch((_error) => {
          setData([]);
        });
    } else {
      SerchAttendanceDetails(payload)
        .then((res) => {
          if (res?.data?.content?.length) {
            setData(res.data.content);
            setTotalCount(res.data.totalElements);
          } else {
            setData([]);
          }
        })
        .catch((_error) => {
          setData([]);
        });
    }
  }, [
    formData.employeeId,
    employeeData?.employeeBasicDetailId,
    rowsPerPage,
    page,
    alignment,
  ]);

  const configureFormData = useCallback(
    (input) => {
      return [
        {
          label: "Employee",
          name: "employeeId",
          type: "dropDownList",
          options: employeesData.map((employee) => ({
            key: employee.empBasicDetailId,
            value: `${employee.employeeName} (${employee?.employeeBasicDetail?.employeeCode})`,
          })),
          value: input.employeeId,
        },
      ];
    },
    [employeesData]
  );

  const contentConfig = useCallback(
    (input) => {
      return {
        content: input.map((content) => {
          if (alignment === "entry date approval") {
            return [
              {
                forAction: false,
                isPrint: true,
                value: content?.employeeName,
              },
              {
                forAction: false,
                isPrint: true,
                value: content?.taskDate,
              },
              {
                forAction: true,
                isPrint: false,
                value: content,
                customActions: customButtons(content),
              },
            ];
          }
          return [
            {
              forAction: false,
              isPrint: true,
              value: `${content?.employeeEntity?.firstName} ${content?.employeeEntity?.lastName}`,
            },
            {
              forAction: false,
              isPrint: true,
              value: content?.taskDate,
            },
            {
              forAction: false,
              isPrint: true,
              value: projectData?.find(
                (data) => data.projectCode === content.projectCode
              )?.projectName,
            },
            {
              forAction: false,
              isPrint: true,
              value: taskData?.find(
                (data) => data.taskCode === content.taskName
              )?.taskDescription,
            },
            {
              forAction: false,
              isPrint: true,
              value: content?.timeInvested,
            },
            {
              forAction: false,
              isPrint: true,
              value: content?.location,
            },
            { forAction: false, isPrint: true, value: content?.comments },
            {
              forAction: true,
              isPrint: false,
              value: content,
              customActions: customButtons(content),
            },
          ];
        }),
        actions: {
          view: false,
          edit: false,
          view: false,
        },
      };
    },
    [alignment, customButtons, projectData, taskData]
  );

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const onPageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const onRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const dailogContent = () => {
    return (
      <>
        <DialogContentText>Please enter remarks :</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="remarks"
          label="Remarks"
          type="text"
          fullWidth
          size="small"
          value={remarks}
          onChange={(event) => {
            const { value } = event.target;
            setRemarks(value);
          }}
        />
      </>
    );
  };

  useEffect(() => {
    getEmployeesByApproverId();
    GetAllProjects()
      .then((d) => {
        if (d) {
          setProjectData(d);
        }
      })
      .catch((error) => console.log(error));
  }, [getEmployeesByApproverId]);

  useEffect(() => {
    getTimeSheetDetailsForApprover();
  }, [formData, getTimeSheetDetailsForApprover, page, rowsPerPage, alignment]);

  return (
    <>
      <Box>
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={(_event, newAlignment) => setAlignment(newAlignment)}
          aria-label="Platform"
          size="small"
          sx={{ margin: 1 }}
        >
          <ToggleButton value="task approvals">task approvals</ToggleButton>
          <ToggleButton value="entry date approval">
            entry date approval
          </ToggleButton>
        </ToggleButtonGroup>
        <ConfigureForm
          data={configureFormData(formData)}
          handleChange={handleChange}
          actionsHide={false}
        />
        <ConfigTable
          data={contentConfig(data)}
          headers={
            alignment === "entry date approval"
              ? ["Employee Name", "Task Date", "Action"]
              : [
                  "Employee Name",
                  "Task Date",
                  "Project",
                  "Task",
                  "Time Invested",
                  "Location",
                  "Description",
                  "Action",
                ]
          }
          selectionTable={alignment !== "entry date approval"}
          onSelectedRowsChange={(data) => {
            setSelectedTimeSheets(data);
          }}
          pagination={true}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          totalCount={totalCount}
        />
        {alignment !== "entry date approval" && (
          <Grid container justifyContent="flex-end" padding={1} spacing={1}>
            <Grid item>
              <Button
                type="button"
                size="small"
                variant="contained"
                color="primary"
                onClick={() => changeEmployeeTimeSheetStatus("approve")}
                disabled={selectedTimeSheets.length === 0}
              >
                Approve
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
      <ContentDialog
        openDialog={openDialog}
        handleCloseDialog={(data) => {
          if (data) {
            if (!remarks) {
              Toaster("error", "Please enter Remarks");
              return;
            }
            changeEmployeeTimeSheetStatus("reject", selectedData);
            setOpenDialog(false);
          } else {
            setSelectedData();
            setRemarks();
            setOpenDialog(false);
          }
        }}
        content={dailogContent()}
        actions={true}
        okText="Submit"
        cancelText="Cancel"
      />
    </>
  );
}

export default TimeSheetApproval;
