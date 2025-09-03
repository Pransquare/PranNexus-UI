import {
  Box,
  Button,
  Checkbox,
  Chip,
  ClickAwayListener,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useState } from "react";
import CustomDateRangeInput from "./DateRangePicker";

function ConfigureForm({
  data,
  title,
  handleChange,
  buttonTitle = "Save",
  submitClicked,
  resetButton,
  formDisabled = false,
  actionsHide = true,
  readOnly = false,
  buttonsHide = {
    reset: true,
    save: true,
  },
  onBlur,
}) {
  const [showDateRange, setShowDateRange] = useState(false);
  const theme = useTheme(); // Access the theme

  return (
    <Box component="div">
      <Box component="div">
        <Typography variant="h6" gutterBottom color="primary">
          {title}
        </Typography>
      </Box>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { margin: 1, width: "25ch" }, // Adjust width for larger screens
          [theme.breakpoints.down("md")]: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            "& > :not(style)": { m: 1, width: "100%" }, // Adjust width to make inputs responsive
            maxWidth: "600px", // Set max-width for the form
            margin: "auto", // Center the form horizontally
          },
        }}
        noValidate
      >
        {data?.map((item) => {
          switch (item.type) {
            case "text":
              return (
                <TextField
                  key={item.name}
                  name={item.name}
                  label={item.label}
                  variant="outlined"
                  value={item.value || ""}
                  onChange={handleChange}
                  size="small"
                  disabled={formDisabled || item.disable}
                  inputProps={{
                    maxLength: item.maxLength || undefined, // Correctly set maxLength here
                  }}
                  InputProps={{
                    readOnly: readOnly || item.readOnly,
                  }}
                  required={item.required || false}
                  error={!!item.error}
                  helperText={item.error}
                  onBlur={onBlur}
                />
              );

            case "textarea":
              return (
                <TextField
                  key={item.name}
                  multiline
                  rows={3}
                  size="small"
                  maxlength={item.maxlength}
                  variant="outlined"
                  label={item.label}
                  name={item.name}
                  error={!!item.error}
                  helperText={item.error}
                  disabled={formDisabled || item.disable}
                  value={item.value || ""}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: readOnly || item.readOnly,
                    maxLength: item.maxLength || undefined
                  }}
                  required={item.required || false}
                  onBlur={onBlur}
                />
              );
            case "time":
              return (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  key={item.name}
                >
                  <TimePicker
                    clearable
                    ampm={false}
                    size="small"
                    variant="outlined"
                    label={item.label}
                    disableOpenPicker
                    name={item.name}
                    error={!!item.error}
                    helperText={item.error}
                    disabled={formDisabled || item.disable}
                    value={item.value || null}
                    required={item.required || false}
                    onChange={(newValue) =>
                      handleChange({
                        target: { name: item.name, value: newValue },
                      })
                    }
                    slotProps={{
                      textField: {
                        helperText: item.error,
                        error: !!item.error,
                        size: "small",
                        required: item.required || false,
                        onBlur: onBlur,
                      },
                    }}
                  />
                </LocalizationProvider>
              );

            case "dropDownList":
              return (
                <FormControl key={item.name} error={!!item.error}>
                  <InputLabel
                    size="small"
                    id={item.name}
                    required={item.required || false}
                  >
                    {item.label}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id={item.name}
                    name={item.name}
                    label={item.label}
                    onChange={handleChange}
                    size="small"
                    disabled={formDisabled || item.disable}
                    readOnly={readOnly || item.readOnly}
                    value={item.value || ""}
                    onBlur={onBlur}
                  >
                    {item?.options?.map((option) => (
                      <MenuItem key={item.name + option.key} value={option.key}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </Select>
                  {item.error && (
                    <Typography variant="caption" color="error">
                      {item.error}
                    </Typography>
                  )}
                </FormControl>
              );
            case "multiSelect":
              return (
                <FormControl key={item.name} error={!!item.error} fullWidth>
                  <InputLabel
                    size="small"
                    id={item.name}
                    required={item.required || false}
                  >
                    {item.label}
                  </InputLabel>
                  <Select
                    labelId={item.name}
                    id={item.name}
                    name={item.name}
                    readOnly={readOnly || item.readOnly}
                    label={item.label}
                    multiple
                    onChange={handleChange}
                    size="small"
                    disabled={formDisabled || item.disable}
                    value={item.value || []}
                    onBlur={onBlur}
                    renderValue={(selected) => (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                        }}
                      >
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            size="small"
                            label={
                              item.options.find(
                                (option) => option.key === value
                              )?.value
                            }
                            style={{ margin: 2 }}
                            color="primary"
                          />
                        ))}
                      </div>
                    )}
                  >
                    {item?.options?.map((option) => (
                      <MenuItem
                        key={item.name + option.key}
                        value={option.key}
                        sx={{
                          fontWeight: item.value.includes(option.key)
                            ? "bold"
                            : "normal",
                          color: item.value.includes(option.key)
                            ? "secondary.main"
                            : "inherit",
                        }}
                      >
                        {option.value}
                      </MenuItem>
                    ))}
                  </Select>
                  {item.error && (
                    <Typography variant="caption" color="error">
                      {item.error}
                    </Typography>
                  )}
                </FormControl>
              );
            case "password":
              return (
                <TextField
                  key={item.name}
                  name={item.name}
                  label={item.label}
                  variant="outlined"
                  type="password"
                  value={item.value || ""}
                  onChange={handleChange}
                  size="small"
                  InputProps={{
                    readOnly: readOnly || item.readOnly,
                  }}
                  required={item.required || false}
                  disabled={formDisabled || item.disable}
                  error={!!item.error}
                  helperText={item.error}
                  onBlur={onBlur}
                />
              );
            case "month":
              return (
                <TextField
                  key={item.name}
                  name={item.name}
                  label={item.label}
                  type="month"
                  value={item.value || ""}
                  onChange={handleChange}
                  size="small"
                  disabled={formDisabled || item.disable}
                  InputLabelProps={{ shrink: true }} // Ensure this is applied here
                  required={item.required || false}
                  error={!!item.error}
                  helperText={item.error}
                  onBlur={onBlur}
                />
              );

            case "date":
              return (
                <TextField
                  key={item.name}
                  name={item.name}
                  label={item.label}
                  type="date"
                  value={item.value || ""}
                  onChange={handleChange}
                  size="small"
                  disabled={formDisabled || item.disable}
                  InputLabelProps={{ shrink: true }} // Ensure this is applied here
                  required={item.required || false}
                  error={!!item.error}
                  helperText={item.error}
                  onBlur={onBlur}
                />
              );

            case "datePicker":
              return (
                <FormControl key={item.name}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      slotProps={{
                        textField: {
                          helperText: item.error,
                          error: !!item.error,
                          size: "small",
                          required: item.required || false,
                          onBlur: onBlur,
                          name: item.name,
                        },
                      }}
                      format="DD-MM-YYYY"
                      key={item.name}
                      readOnly={readOnly || item.readOnly}
                      label={item.label}
                      value={item.value || null}
                      minDate={item.minDate || undefined}
                      maxDate={item.maxDate || undefined}
                      onChange={(newValue) =>
                        handleChange({
                          target: { name: item.name, value: newValue },
                        })
                      }
                      disabled={formDisabled || item.disable}
                    />
                  </LocalizationProvider>
                </FormControl>
              );
            case "monthAndYearSelect":
              return (
                <FormControl key={item.name}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      slotProps={{
                        textField: {
                          helperText: item.error,
                          error: !!item.error,
                          size: "small",
                          required: item.required || false,
                          onBlur: onBlur,
                          name: item.name,
                        },
                      }}
                      views={["month", "year"]}
                      format="MM-YYYY"
                      key={item.name}
                      label={item.label}
                      readOnly={readOnly || item.readOnly}
                      value={item.value || null}
                      onChange={(newValue) =>
                        handleChange({
                          target: { name: item.name, value: newValue },
                        })
                      }
                      disabled={formDisabled || item.disable}
                      minDate={item.minDate || undefined}
                      maxDate={item.maxDate || undefined}
                    />
                    {/* </DemoContainer> */}
                  </LocalizationProvider>
                </FormControl>
              );
            case "checkbox":
              return (
                <FormControlLabel
                  key={item.name}
                  control={
                    <Checkbox
                      name={item.name}
                      checked={item.value || false}
                      onChange={(e) =>
                        handleChange({
                          target: { name: item.name, value: e.target.checked },
                        })
                      }
                      readOnly={readOnly || item.readOnly}
                      value={item.value || false}
                      disabled={formDisabled || item.disable}
                    />
                  }
                  label={item.label}
                  onBlur={onBlur}
                  required={item.required || null}
                />
              );
            case "dateRangePicker":
              return (
                <ClickAwayListener
                  onClickAway={() => setShowDateRange(false)}
                  key={item.name}
                >
                  <FormControl component="span" position="relative">
                    <TextField
                      size="small"
                      value={item.value || ""}
                      label={item.label}
                      name={item.name}
                      InputProps={{
                        readOnly: readOnly || item.readOnly,
                      }}
                      required={item.required || false}
                      variant="outlined"
                      onFocus={() => setShowDateRange(true)}
                      disabled={formDisabled || item.disable}
                      error={!!item.error}
                      helperText={item.error}
                      onBlur={onBlur}
                    />
                    {showDateRange && (
                      <CustomDateRangeInput
                        valueChange={handleChange}
                        value={item.value || ""}
                        name={item.name}
                        minDate={item.minDate || undefined}
                        maxDate={item.maxDate || undefined}
                      />
                    )}
                  </FormControl>
                </ClickAwayListener>
              );
            case "number": // Use a generic type for numeric inputs
              return (
                <TextField
                  key={item.name}
                  name={item.name}
                  label={item.label}
                  variant="outlined"
                  value={item.value || ""}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, item.maxLength || 10); // Allow only numbers
                    handleChange({ target: { name: item.name, value } });
                  }}
                  size="small"
                  disabled={formDisabled || item.disable}
                  InputProps={{
                    readOnly: readOnly || item.readOnly, //Non Mandatorty
                  }}
                  required={item.required || false}
                  error={!!item.error}
                  helperText={item.error}
                  onBlur={onBlur}
                />
              );
            case "suggestedDropdown":
              return (
                <FormControl key={item.name} error={!!item.error} fullWidth>
                  <TextField
                    label={item.label}
                    variant="outlined"
                    name={item.name}
                    size="small"
                    value={item.value || ""}
                    onChange={handleChange}
                    InputProps={{
                      readOnly: readOnly || item.readOnly,
                    }}
                    required={item.required || false}
                    disabled={formDisabled || item.disable}
                    autoComplete="off"
                  />
                  {item.options && item.options.length > 0 && (
                    <Paper style={{ maxWidth: "100%", overflow: "hidden" }}>
                      {item.options.map((option) => (
                        <MenuItem
                          key={item.name + option.key}
                          onClick={() => {
                            handleChange({
                              target: { name: item.name, value: option.value },
                            });
                          }}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          <Box display="flex" flexDirection="column">
                            <Tooltip
                              title={`${option.value} ${
                                option.subValue
                                  ? ` ${option.subValue} (${option.key})`
                                  : ""
                              }`}
                            >
                              <Box display="flex" flexDirection="column">
                                <Typography
                                  variant="body2"
                                  color="black"
                                  noWrap
                                >
                                  {option.value}
                                </Typography>
                                {option.subValue && (
                                  <Typography
                                    variant="caption"
                                    color="textSecondary"
                                    noWrap
                                  >
                                    {option.subValue} ({option.key})
                                  </Typography>
                                )}
                              </Box>
                            </Tooltip>
                          </Box>
                        </MenuItem>
                      ))}
                    </Paper>
                  )}
                  {item.error && (
                    <Typography variant="caption" color="error">
                      {item.error}
                    </Typography>
                  )}
                </FormControl>
              );
            case "custom":
              return item.component;
            default:
              return null;
          }
        })}
      </Box>
      {actionsHide && (
        <Grid container justifyContent="flex-end" spacing={2} paddingRight={2}>
          {buttonsHide.reset && (
            <Grid item>
              <Button
                type="button"
                onClick={resetButton}
                size="small"
                variant="contained"
                color="warning"
              >
                Reset
              </Button>
            </Grid>
          )}
          {buttonsHide.save && (
            <Grid item>
              <Button
                type="button"
                onClick={submitClicked}
                size="small"
                variant="contained"
                color="primary"
                disabled={formDisabled}
              >
                {buttonTitle}
              </Button>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}

export default ConfigureForm;
