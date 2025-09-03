// src/components/Employment.js

import React, { useCallback } from 'react';
import ConfigureForm from '../../../common/customComponents/ConfigureForm';

const Employment = ({ employment, handleEmploymentChange, handleAddEmployment, handleRemoveEmployment, errors }) => {
  const configureEmploymentData = useCallback(() => {
    return employment.flatMap((emp, index) => [
      { label: "Employer", name: "employer", type: "text", value: emp.employer, error: errors[`employment[${index}].employer`] },
      { label: "From", name: "empFrom", type: "date", value: emp.empFrom, error: errors[`employment[${index}].empFrom`] },
      { label: "To", name: "empTo", type: "date", value: emp.empTo, error: errors[`employment[${index}].empTo`] },
      { label: "CTC", name: "ctc", type: "text", value: emp.ctc, error: errors[`employment[${index}].ctc`] },
      { label: "Notice Period", name: "noticePeriod", type: "text", value: emp.noticePeriod, error: errors[`employment[${index}].noticePeriod`] },
      { label: "Address", name: "address", type: "text", value: emp.address, error: errors[`employment[${index}].address`] },
      { label: "Reason for Leaving", name: "reason", type: "text", value: emp.reason, error: errors[`employment[${index}].reason`] },
      { label: "Date of Joining", name: "doj", type: "date", value: emp.doj, error: errors[`employment[${index}].doj`] },
    ]);
  }, [employment, errors]);

  return (
    <div>
      <h2>Employment Details</h2>
      {employment.map((emp, index) => (
        <div key={index} style={{ marginBottom: '16px', border: '1px solid grey', padding: '8px', borderRadius: '4px' }}>
          <ConfigureForm
            data={configureEmploymentData()}
            handleChange={(event) => handleEmploymentChange(index, event)}
            disableFields={false}
          />
          <button type="button" onClick={() => handleRemoveEmployment(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={handleAddEmployment}>Add Employment</button>
    </div>
  );
};

export default Employment;
