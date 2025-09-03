// ProgressBar.js
import React from 'react';
import { Step, StepLabel, Stepper, Typography, Box } from '@mui/material';

const ProgressBar = ({ workflowStatusDescription }) => {
  const steps = [
    { label: 'Draft', statuses: ['10'] },
    { label: 'Submitted', statuses: ['100', '101'] },
    { label: 'Budget Approval', statuses: ['200', '202', '201'] },
    { label: 'Offer Upload', statuses: ['101', '303'] },
    { label: 'Management Approval', statuses: ['300', '302', '301'] },
    { label: 'Onboarding Initiated', statuses: ['400'] },
  ];

  const activeStep = steps.findIndex(step =>
    step.statuses.includes(workflowStatusDescription)
  );

  const isStepFailed = (step) => {
    return (
      (step === 1 && workflowStatusDescription === '201') ||
      (step === 3 && workflowStatusDescription === '301')
    );
  };

  return (
    <Box
      sx={{
        width: '100%',
        overflowX: 'auto',
        px: 1,
        py: 2,
      }}
    >
      <Stepper
        activeStep={activeStep >= 0 ? activeStep : 0}
        alternativeLabel
        sx={{
          minWidth: '600px', // ensures scroll on very small screens
        }}
      >
        {steps.map((step, index) => {
          const labelProps = {};
          if (isStepFailed(index)) {
            labelProps.optional = (
              <Typography
                variant="caption"
                color="error"
                sx={{ fontSize: '0.75rem' }}
              >
                Rejected
              </Typography>
            );
            labelProps.error = true;
          }

          return (
            <Step key={index}>
              <StepLabel
                {...labelProps}
                sx={{
                  '& .MuiStepLabel-label': {
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                  },
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default ProgressBar;
