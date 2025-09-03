// src/components/CtcDetails.js

import React, { useCallback } from 'react';
import ConfigureForm from '../../../common/customComponents/ConfigureForm';

const CtcDetails = ({ ctcDetails, handleCtcChange, errors }) => {
  const configureCtcData = useCallback(() => {
    return [
      { label: "Expected CTC", name: "expectedCtc", type: "text", value: ctcDetails.expectedCtc, error: errors.expectedCtc },
      { label: "Budget", name: "budget", type: "text", value: ctcDetails.budget, error: errors.budget },
      { label: "Granted CTC", name: "grantedCtc", type: "text", value: ctcDetails.grantedCtc, error: errors.grantedCtc },
    ];
  }, [ctcDetails, errors]);

  return (
    <div>
      <h2>CTC Details</h2>
      <ConfigureForm
        data={configureCtcData()}
        handleChange={handleCtcChange}
        disableFields={false}
      />
    </div>
  );
};

export default CtcDetails;
