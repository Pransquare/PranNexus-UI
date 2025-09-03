import { Box } from "@mui/system";
import React, { useContext, useState } from "react";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import dayjs from "dayjs";
import { DownloadOrViewPayslip } from "../../../service/api/nemsService/Payroll";
import { Toaster } from "../../../common/alertComponets/Toaster";

const defaultFormData = {
  monthAndYear: "",
};
function PayrollDetails() {
  const { employeeData } = useContext(EmployeeDataContext);
  const [formData, setFormData] = useState(defaultFormData);
  const fetchData = () => {
    DownloadOrViewPayslip({
      empBasicDetailId: employeeData?.employeeBasicDetailId,
      month: formData?.monthAndYear.month(),
      year: formData?.monthAndYear.year(),
    })
      .then((response) => {
        console.log(response);

        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${employeeData?.fullName} Payslip.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        Toaster("success", "Payslip Downloaded");
      })
      .catch((err) => {
        console.log(err);

        Toaster(
          "error",
          "Payslip is not available for the selected month, Please contact HR team"
        );
      });
  };
  const ConfigureFormData = (input) => {
    return [
      {
        label: "Month and Year",
        name: "monthAndYear",
        type: "monthAndYearSelect",
        value: input.monthAndYear,
        minDate: employeeData?.dateOfJoining
          ? dayjs(employeeData?.dateOfJoining)
          : null,
        maxDate: dayjs(),
        required: true,
      },
    ];
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <Box>
      <ConfigureForm
        data={ConfigureFormData(formData)}
        handleChange={handleChange}
        buttonTitle="Download"
        submitClicked={fetchData}
        buttonsHide={{
          reset: false,
          save: true,
        }}
      />
    </Box>
  );
}

export default PayrollDetails;
