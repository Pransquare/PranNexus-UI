import { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  IconButton
} from "@mui/material";
import dayjs from "dayjs";
import {
  getSowIds,
  searchSowDetails,
  getReportingIds,
  deleteSowDetails,
  updateSowDetails
} from "../../../service/api/emsService/ContractManagerService";
import { Toaster } from "../../../common/alertComponets/Toaster";
import ConfigureForm from "../../../common/customComponents/ConfigureForm";
import ConfigTable from "../../../common/customComponents/ConfigTable";
import { EmployeeDataContext } from "../../../customHooks/dataProviders/EmployeeDataProvider";
import { Delete, Edit } from "@mui/icons-material";
import ContentDialog from "../../../common/customComponents/Dailogs/ContentDailog";

function SearchSOW() {
  const { employeeData } = useContext(EmployeeDataContext);
  const [formData, setFormData] = useState({
    account: "",
    status: "",
    sowID: "",
    milestoneMonth: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sowIds, setSowIds] = useState([]);
  const [allData, setAllData] = useState([]);
  const [totalApproxUSD, setTotalApproxUSD] = useState(0);
  const [reportingIds, setReportingIds] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    if (formData.account && formData.status) {
      fetchSowIds(formData.account, formData.status);
    }
  }, [formData.account, formData.status]);

  useEffect(() => {
    const fetchReportingIds = async () => {
      try {
        const managerId = employeeData?.employeeBasicDetailId;
        if (managerId) {
          const response = await getReportingIds(managerId);
          setReportingIds(response || []);
          return response || [];
        }
        return [];
      } catch (error) {
        Toaster("error", "Failed to fetch reporting IDs");
        return [];
      }
    };    

    fetchReportingIds();
  }, [employeeData]);

  const fetchSowIds = async (account, status) => {
    try {
      const response = await getSowIds(account, status);
      setSowIds(response);
    } catch (error) {
      Toaster("error", "Failed to fetch SOW IDs");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const newErrors = {};
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      const managerId = employeeData?.employeeBasicDetailId;
      const managerIds = managerId
        ? [managerId, ...(await getReportingIds(managerId))]
        : [];
      
      const searchParams = {
        account: formData.account,
        milestoneMonth: formData.milestoneMonth || "",
        status: formData.status,
        sowId: formData.sowID || "",
        page,
        size: rowsPerPage,
        managerId: managerIds,
      };
  
      const response = await searchSowDetails(searchParams);
      const formattedData = response.content.map((item) => [
        { value: item.account, isPrint: true },
        { value: item.sowId, isPrint: true },
        { value: item.sowName, isPrint: true },
        { value: item.po, isPrint: true },
        { value: item.milestoneMonth, isPrint: true },
        { value: item.currency, isPrint: true },
        { value: item.milestoneAmount, isPrint: true },
        { value: item.approxAmount, isPrint: true },
        { value: dayjs(item.sowStartDate).format("YYYY-MM-DD"), isPrint: true },
        { value: dayjs(item.sowEndDate).format("YYYY-MM-DD"), isPrint: true },
        { value: item.deliveryManager.fullName, isPrint: true },
        { value: item.status, isPrint: true },
        {
          value: (
            <>
              <IconButton
                aria-label="edit"
                color="primary"
                onClick={() => handleEditClick(item)}
                disabled={item.status === "Inactive"}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="delete"
                color="secondary"
                onClick={() => handleDelete(item.id)}
                disabled={item.status === "Inactive"}
              >
                <Delete fontSize="small" />
              </IconButton>
            </>
          ),
          isPrint: true,
        },
      ]);
  
      setTotalApproxUSD(
        response.content.reduce((sum, item) => sum + (item.approxAmount || 0), 0)
      );
      setAllData(formattedData);
      setTotalCount(response.totalElements);
      setErrors({});
    } catch (error) {
      Toaster("error", "Failed to fetch SOW details");
    }
  };  

  const handleEditClick = (item) => {
    setEditData({
      id: item.id,
      account: item.account,
      sowId: item.sowId,
      sowName: item.sowName,
      po: item.po,
      milestoneMonth: item.milestoneMonth,
      currency: item.currency,
      milestoneAmount: item.milestoneAmount,
      approxAmount: item.approxAmount,
      sowStartDate: dayjs(item.sowStartDate).format("YYYY-MM-DD"),
      sowEndDate: dayjs(item.sowEndDate).format("YYYY-MM-DD"),
      deliveryManager: item.deliveryManager?.fullName,
      deliveryManagerId: item.deliveryManagerId,
      status: item.status,
    });
    setOpenEditDialog(true);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const { deliveryManager, ...payload } = editData;
    try {
      await updateSowDetails(payload.id, payload);
      Toaster("success", "SOW updated successfully");
      setOpenEditDialog(false);
      handleSubmit();
    } catch (error) {
      Toaster("error", "Failed to update SOW details");
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteSowDetails(deleteId);
      Toaster("success", "SOW deleted successfully");
      setOpenDeleteDialog(false);
      handleSubmit();
    } catch (error) {
      Toaster("error", "Failed to delete SOW");
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    handleSubmit();
  }, [page, rowsPerPage]);

  const formFields = [
    {
      type: "text",
      name: "account",
      label: "Account",
      value: formData.account,
      required: false,
      error: submitted && errors.account,
      onChange: handleChange,
    },
    {
      type: "dropDownList",
      name: "status",
      label: "Status",
      value: formData.status,
      required: false,
      onChange: handleChange,
      error: submitted && errors.status,
      options: [
        { key: "Select Status", value: "", disabled: true },
        { key: "Active", value: "Active" },
        { key: "Inactive", value: "Inactive" },
      ],
    },
    {
      type: "dropDownList",
      name: "sowID",
      label: "SOW ID",
      value: formData.sowID,
      required: false,
      onChange: handleChange,
      error: submitted && errors.sowID,
      options: sowIds.map((id) => ({ key: id, value: id })),
    },
    {
      type: "monthAndYearSelect",
      name: "milestoneMonth",
      label: "Milestone Month",
      onChange: handleChange,
      value: formData.milestoneMonth || null,
      required: false,
      error: submitted && errors.milestoneMonth,
    },
  ];

  const editDialogContent = (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField
          label="Account"
          name="account"
          value={editData?.account || ""}
          onChange={handleEditChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="SOW ID"
          name="sowId"
          value={editData?.sowId || ""}
          onChange={handleEditChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="SOW Name"
          name="sowName"
          value={editData?.sowName || ""}
          onChange={handleEditChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="PO#"
          name="po"
          value={editData?.po || ""}
          onChange={handleEditChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Milestone Month"
          name="milestoneMonth"
          value={editData?.milestoneMonth || ""}
          onChange={handleEditChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Currency"
          name="currency"
          value={editData?.currency || ""}
          onChange={handleEditChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Milestone Amount"
          name="milestoneAmount"
          type="number"
          value={editData?.milestoneAmount || 0}
          onChange={handleEditChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Approx USD"
          name="approxAmount"
          type="number"
          value={editData?.approxAmount || 0}
          onChange={handleEditChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="SOW Start"
          name="sowStartDate"
          type="date"
          value={editData?.sowStartDate || ""}
          onChange={handleEditChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="SOW End"
          name="sowEndDate"
          type="date"
          value={editData?.sowEndDate || ""}
          onChange={handleEditChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Delivery Manager"
          name="deliveryManager"
          value={editData?.deliveryManager || ""}
          onChange={handleEditChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Status"
          name="status"
          value={editData?.status || ""}
          onChange={handleEditChange}
          fullWidth
        />
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 2, overflow: "hidden" }}>
      <ConfigureForm
        data={formFields}
        handleChange={handleChange}
        submitClicked={handleSubmit}
        buttonTitle="Submit"
        resetButton={() =>
          setFormData({
            account: "",
            status: "",
            sowID: "",
            milestoneMonth: "",
          })
        }
      />
      <Box sx={{ mt: 2 }}>
        {allData.length > 0 ? (
          <>
            <ConfigTable
              data={{ content: allData }}
              headers={[
                "Account",
                "SOW ID",
                "SOW Name",
                "PO#",
                "Milestone Month",
                "Currency",
                "Milestone Amount",
                "Approx USD",
                "SOW Start",
                "SOW End",
                "Delivery Manager",
                "Status",
                "Action",
              ]}
              pagination
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25]}
              selectionTable={false}
            />
            <Typography variant="h6" align="right" sx={{ mt: 2 }}>
              Total Approx USD: {totalApproxUSD.toFixed(2)}
            </Typography>
          </>
        ) : (
          <Typography variant="body1">No data found.</Typography>
        )}
      </Box>

      {/* Edit Dialog using ContentDialog */}
      <ContentDialog
        openDialog={openEditDialog}
        handleCloseDialog={(confirmed) => {
          if (confirmed) {
            handleUpdate();
          } else {
            setOpenEditDialog(false);
          }
        }}
        title="Edit SOW Details"
        content={editDialogContent}
        cancelText="Close" // Update label to "Close"
        okText="Update" // Update label to "Update"
      />

      {/* Delete Confirmation Dialog */}
      <ContentDialog
        openDialog={openDeleteDialog}
        handleCloseDialog={(confirmed) => {
          if (confirmed) {
            confirmDelete();
          } else {
            setOpenDeleteDialog(false);
          }
        }}
        title="Delete Confirmation"
        content={<Typography>Are you sure you want to delete this SOW?</Typography>}
        cancelText="Cancel" // Update label to "Cancel"
        okText="Delete" // Update label to "Delete"
      />
    </Box>
  );
}

export default SearchSOW;
