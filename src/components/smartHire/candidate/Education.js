// src/components/Education.js

import React, { useCallback } from 'react';
import ConfigureForm from '../../../common/customComponents/ConfigureForm';

const Education = ({ education, handleEducationChange, handleAddEducation, handleRemoveEducation, errors }) => {
  const configureEducationData = useCallback(() => {
    return education.flatMap((edu, index) => [
      { label: "Institute", name: "institute", type: "text", value: edu.institute, error: errors[`education[${index}].institute`] },
      { label: "University", name: "university", type: "text", value: edu.university, error: errors[`education[${index}].university`] },
      { label: "Degree", name: "degree", type: "text", value: edu.degree, error: errors[`education[${index}].degree`] },
      { label: "Mode", name: "mode", type: "text", value: edu.mode, error: errors[`education[${index}].mode`] },
      { label: "Completed On", name: "completedOn", type: "date", value: edu.completedOn, error: errors[`education[${index}].completedOn`] },
      { label: "Grade/Marks", name: "gradeMarks", type: "text", value: edu.gradeMarks, error: errors[`education[${index}].gradeMarks`] },
    ]);
  }, [education, errors]);

  return (
    <div>
      <h2>Education Details</h2>
      {education.map((edu, index) => (
        <div key={index} style={{ marginBottom: '16px', border: '1px solid grey', padding: '8px', borderRadius: '4px' }}>
          <ConfigureForm
            data={configureEducationData()}
            handleChange={(event) => handleEducationChange(index, event)}
            disableFields={false}
          />
          <button type="button" onClick={() => handleRemoveEducation(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={handleAddEducation}>Add Education</button>
    </div>
  );
};

export default Education;
