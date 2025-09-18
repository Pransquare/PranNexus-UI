import { Delete, Edit, Visibility } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

function ConfigTable({
  data,
  headers,
  actions,
  selectionTable,
  onSelectedRowsChange,
  pagination,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  totalCount,
  resetSelection,
  padding = "1%",
  alignment,
}) {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (onSelectedRowsChange) {
      onSelectedRowsChange(selected);
    }
  }, [selected, onSelectedRowsChange]);

  useEffect(() => {
    if (resetSelection) {
      setSelected([]);
    }
  }, [resetSelection]);

  useEffect(() => {
    setSelected([]);
  }, [page, rowsPerPage]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data?.content?.map((_, index) => index) || [];
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event, index) => {
    const selectedIndex = selected.indexOf(index);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, index);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (index) => selected.indexOf(index) !== -1;

  const numSelected = selected.length;
  const rowCount = data?.content?.length || 0;

  return (
    <Box sx={{ width: "100%", padding: padding }}>
      {
        <Box
          sx={{
            maxHeight: "70vh",
            overflowX: "auto",
          }}
        >
          <Table
            size="small"
            stickyHeader
            sx={{
              minWidth: "1000px",
              borderCollapse: "collapse",
              borderSpacing: "0",
            }}
          >
            <TableHead>
              <TableRow>
                {selectionTable && (
                  <TableCell
                    padding="checkbox"
                    sx={{
                      border: "1px solid #ddd",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <Checkbox
                      color="primary"
                      indeterminate={numSelected > 0 && numSelected < rowCount}
                      checked={rowCount > 0 && numSelected === rowCount}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                )}
                {headers.map((header, index) => (
                  <TableCell
                    key={header}
                    align={alignment ? alignment[index] : "center"}
                    sx={{
                      border: "1px solid #ddd",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <Typography
                      variant="body1"
                      color="primary"
                      aria-label={header}
                      sx={{ fontWeight: "bold" }}
                    >
                      {header}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.content?.map((row, index) => {
                const isItemSelected = isSelected(index);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow key={index} hover>
                    {selectionTable && (
                      <TableCell
                        padding="checkbox"
                        sx={{ border: "1px solid #ddd" }}
                      >
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          onClick={(event) =>
                            selectionTable && handleClick(event, index)
                          }
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                    )}
                    {row.map(
                      (a, i) =>
                        a.isPrint && (
                          <TableCell
                            align={alignment ? alignment[i] : "center"}
                            key={"a" + i}
                            sx={{ border: "1px solid #ddd" }}
                          >
                            <Typography
                              variant="body2"
                              aria-label={a.value}
                              sx={{
                                fontSize: "0.7rem",
                              }}
                            >
                              {a.value}
                            </Typography>
                          </TableCell>
                        )
                    )}
                    {data?.actions && (
                      <TableCell
                        align="center"
                        sx={{ border: "1px solid #ddd" }}
                      >
                        {row?.find((data) => data.forAction)?.customActions}
                        {data?.actions?.view && (
                          <IconButton
                            aria-label="view"
                            color="rgb(15,168,233)"
                            onClick={() =>
                              actions(
                                "view",
                                row.find((data) => data.forAction).value,
                                index
                              )
                            }
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        )}
                        {data?.actions?.edit && (
                          <IconButton
                            aria-label="edit"
                            color="primary"
                            onClick={() =>
                              actions(
                                "edit",
                                row.find((data) => data.forAction).value,
                                index
                              )
                            }
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        )}
                        {data?.actions?.delete && (
                          <IconButton
                            color="warning"
                            aria-label="delete"
                            onClick={() =>
                              actions(
                                "delete",
                                row.find((data) => data.forAction).value,
                                index
                              )
                            }
                          >
                            <Delete fontSize="small" color="warning" />
                          </IconButton>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
              {!data?.content?.length && (
                <TableRow>
                  <TableCell
                    colSpan={headers.length + (selectionTable ? 1 : 0)}
                    align="center"
                    sx={{ border: "1px solid #ddd" }}
                  >
                    <Typography color="error" variant="inherit">
                      No data found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell
                  colSpan={headers.length + (selectionTable ? 1 : 0)}
                  sx={{ padding: 0, border: "1px solid #ddd" }}
                >
                  {pagination && (
                    <TablePagination
                      size="small"
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={totalCount}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={onPageChange}
                      onRowsPerPageChange={onRowsPerPageChange}
                      sx={{
                        width: "100%",
                        color: "black",
                        backgroundColor: "white",
                        "& .MuiTablePagination-toolbar": {
                          display: "flex",
                          justifyContent: "space-between",
                        },
                        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                          {
                            margin: "0 0px",
                            color: "black",
                          },
                        "& .MuiTablePagination-actions": {
                          display: "flex",
                          alignItems: "center",
                        },
                        "& .MuiTablePagination-menuItem": {
                          color: "black",
                        },
                        "& .MuiInputBase-root": {
                          color: "black",
                        },
                      }}
                    />
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Box>
      }
    </Box>
  );
}
ConfigTable.propTypes = {
  data: PropTypes.shape({
    content: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          isPrint: PropTypes.bool,
          value: PropTypes.any,
          forAction: PropTypes.bool.isRequired,
          customActions: PropTypes.node,
        })
      )
    ),
    actions: PropTypes.shape({
      view: PropTypes.bool,
      edit: PropTypes.bool,
      delete: PropTypes.bool,
    }),
  }),
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  actions: PropTypes.func,
  selectionTable: PropTypes.bool,
  onSelectedRowsChange: PropTypes.func,
  pagination: PropTypes.bool,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  totalCount: PropTypes.number,
  resetSelection: PropTypes.bool,
  padding: PropTypes.string,
  alignment: PropTypes.arrayOf(PropTypes.string),
};

export default ConfigTable;
