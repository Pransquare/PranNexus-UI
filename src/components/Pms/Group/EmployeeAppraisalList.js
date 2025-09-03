import React, { useCallback, useContext, useEffect, useState } from "react";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import {
  GetEmployeeByEmployeeCode,
  GetEmployeesByName,
} from "../../../service/api/emsService/EmployeeService";
import { SearchPerformanceReviews } from "../../../service/api/pmsService/GetParameter";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserManagentCheck } from "../../../common/UserManagement";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";

function EmployeeAppraisalList({ tabValue }) {
  const { employeeData } = useContext(EmployeeDataContext);
  const [data, setData] = useState();
  const [formData, setFormData] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [searchedEmployee, setSearchedEmployee] = useState();
  const navigate = useNavigate();
  const [pagableObject, setPagableObject] = useState({
    page: 0,
    size: 5,
    totalCount: 0,
  });
  let managerId;
  if (
    UserManagentCheck("manager_appraisal") &&
    UserManagentCheck("hr_appraisal")
  ) {
    managerId = null;
  } else if (UserManagentCheck("manager_appraisal")) {
    managerId = employeeData?.employeeBasicDetailId;
  } else {
    managerId = null;
  }
  const configureForm = useCallback(
    (input) => {
      return [
        {
          name: "employee",
          label: "Employee Name",
          type: "suggestedDropdown",
          value: input?.employee,
          required: true,
          options:
            searchResults?.map((data) => {
              return {
                key: data.employeeCode,
                value: data.fullName,
                subValue: data.emailId,
              };
            }) || [],
        },
      ];
    },
    [searchResults]
  );
  const setOptions = useCallback(
    (value) => {
      GetEmployeesByName(value)
        .then((data) => {
          setSearchResults(data);
        })
        .catch();
    },
    [formData]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    const employeeBasicDetailId = searchResults?.find(
      (data) => data.fullName === value
    )?.employeeBasicDetailId;
    if (employeeBasicDetailId) {
      setSearchedEmployee(employeeBasicDetailId);
      setSearchResults([]);
      return;
    }
    if (value.length > 2) {
      setOptions(value);
    } else {
      setSearchResults([]);
      setSearchedEmployee(null);
    }
  };

  const configData = useCallback((input) => {
    return {
      actions: {
        edit: false,
        view: true,
        delete: false,
      },
      content: input?.map((data) => [
        {
          forAction: false,
          isPrint: true,
          value: data.employeeCode,
        },
        {
          forAction: false,
          isPrint: true,
          value: data.fullName,
        },
        {
          forAction: false,
          isPrint: true,
          value: data.group,
        },
        {
          forAction: false,
          isPrint: true,
          value: data.subGroup,
        },
        {
          forAction: false,
          isPrint: true,
          value: data.statusDescription,
        },
        {
          forAction: true,
          isPrint: false,
          value: data,
        },
      ]),
    };
  }, []);

  const onRowsPerPageChange = useCallback((event) => {
    setPagableObject((prevData) => ({ ...prevData, size: event.target.value }));
  }, []);

  const onPageChange = useCallback((event, newPage) => {
    setPagableObject((prevData) => ({ ...prevData, page: newPage }));
  }, []);

  const actionClick = (type, data, index) => {
    navigate("/home/ems/appraisal/employeeAppraisal", {
      state: { data },
    });
  };

  useEffect(() => {
    SearchPerformanceReviews({
      employeeId: searchedEmployee,
      managerId: managerId,
      page: pagableObject.page,
      size: pagableObject.size,
      status: tabValue === 2 ? ["102"] : null,
    })
      .then((res) => {
        if (res && res.content) {
          setData(res.content);
          setPagableObject((prevData) => ({
            ...prevData,
            totalCount: res.totalElements,
          }));
        }
      })
      .catch();
  }, [searchedEmployee, pagableObject.page, pagableObject.size]);

  return (
    <>
      <ConfigureForm
        data={configureForm(formData || {})}
        handleChange={handleChange}
        actionsHide={false}
      />
      <ConfigTable
        data={configData(data)}
        headers={[
          "Employee ID",
          "Name",
          "Group",
          "Sub Group",
          "Status",
          "Action",
        ]}
        padding="0"
        pagination={true}
        page={pagableObject.page}
        rowsPerPage={pagableObject.size}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        totalCount={pagableObject.totalCount}
        actions={actionClick}
      />
    </>
  );
}

export default EmployeeAppraisalList;
