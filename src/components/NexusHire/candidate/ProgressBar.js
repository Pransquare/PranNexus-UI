import React from 'react';
import { Step, StepLabel, Stepper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

// Custom connector
const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    '& .MuiStepConnector-line': {
      borderColor: 'rgb(15,168,233)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    '& .MuiStepConnector-line': {
      borderColor: 'rgb(15,168,233)',
    },
  },
  '& .MuiStepConnector-line': {
    borderColor: '#ccc',
    borderTopWidth: 2,
  },
}));

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
    <Box sx={{ width: '100%', overflowX: 'auto', px: 1, py: 2 }}>
      <Stepper
        activeStep={activeStep >= 0 ? activeStep : 0}
        alternativeLabel
        connector={<CustomConnector />}
        sx={{ minWidth: '600px' }}
      >
        {steps.map((step, index) => {
          const labelProps = {};
          if (isStepFailed(index)) {
            labelProps.optional = (
              <Typography variant="caption" color="error" sx={{ fontSize: '0.75rem' }}>
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
                    color:
                      activeStep === index
                        ? 'rgb(15,168,233)'   // Active step color
                        : undefined,
                  },
                  '& .MuiStepLabel-iconContainer .MuiStepIcon-root.Mui-active': {
                    color: 'rgb(15,168,233)', // Active icon color
                  },
                  '& .MuiStepLabel-iconContainer .MuiStepIcon-root.Mui-completed': {
                    color: 'rgb(15,168,233)', // Completed icon color
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
