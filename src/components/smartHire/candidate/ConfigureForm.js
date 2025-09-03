import React from 'react';
import { Box, Typography, TextField, Select, MenuItem, Checkbox, FormControlLabel, Grid } from '@mui/material';

function ConfigureForm({ data, handleChange, disableFields }) {
  return (
    <Grid container spacing={2}>
      {data.map((field, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Box mb={2} display="flex" flexDirection="column">
            <Typography variant="body1" gutterBottom>
              {field.label}
            </Typography>
            {field.type === 'text' && (
              <TextField
                name={field.name}
                label={field.label}
                value={field.value}
                onChange={handleChange}
                fullWidth
                error={!!field.error}
                helperText={field.error}
                disabled={disableFields}
              />
            )}
            {field.type === 'date' && (
              <TextField
                name={field.name}
                label={field.label}
                type="date"
                value={field.value}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!field.error}
                helperText={field.error}
                disabled={disableFields}
              />
            )}
            {field.type === 'checkbox' && (
              <FormControlLabel
                control={
                  <Checkbox
                    name={field.name}
                    checked={field.value}
                    onChange={handleChange}
                    disabled={disableFields}
                  />
                }
                label={field.label}
              />
            )}
            {field.type === 'select' && (
              <Select
                name={field.name}
                value={field.value}
                onChange={handleChange}
                fullWidth
                disabled={disableFields}
              >
                {field.options.map((option, i) => (
                  <MenuItem key={i} value={option.key}>
                    {option.value}
                  </MenuItem>
                ))}
              </Select>
            )}
            {field.type === 'textarea' && (
              <TextField
                name={field.name}
                label={field.label}
                value={field.value}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                error={!!field.error}
                helperText={field.error}
                disabled={disableFields}
              />
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

export default ConfigureForm;
