// src/components/PersonalInfo.js

import React, { useCallback } from 'react';
import ConfigureForm from '../../../common/customComponents/ConfigureForm';

const PersonalInfo = ({ personalInfo, handlePersonalInfoChange, errors }) => {
  const configurePersonalInfoData = useCallback(() => {
    return [
      { label: "First Name", name: "firstName", type: "text", value: personalInfo.firstName, error: errors.firstName },
      { label: "Last Name", name: "lastName", type: "text", value: personalInfo.lastName, error: errors.lastName },
      { label: "Email Address", name: "emailAddres", type: "text", value: personalInfo.emailAddres, error: errors.emailAddres },
      { label: "Primary Mobile No", name: "primaryMobileNo", type: "text", value: personalInfo.primaryMobileNo, error: errors.primaryMobileNo },
      { label: "Alternate Mobile No", name: "alternateMobileNo", type: "text", value: personalInfo.alternateMobileNo, error: errors.alternateMobileNo },
      { label: "Aadhaar No", name: "aadhaarNo", type: "text", value: personalInfo.aadhaarNo, error: errors.aadhaarNo },
      { label: "Primary Skill", name: "primarySkill", type: "text", value: personalInfo.primarySkill, error: errors.primarySkill },
      { label: "Address Line 1", name: "line1", type: "text", value: personalInfo.line1, error: errors.line1 },
      { label: "Postal Code", name: "postalCode", type: "text", value: personalInfo.postalCode, error: errors.postalCode },
      { label: "State", name: "state", type: "text", value: personalInfo.state, error: errors.state },
      { label: "Country", name: "country", type: "text", value: personalInfo.country, error: errors.country },
      { label: "Same as Permanent Address", name: "sameAsPermanent", type: "checkbox", value: personalInfo.sameAsPermanent, error: errors.sameAsPermanent },
    ];
  }, [personalInfo, errors]);

  return (
    <div>
      <h2>Personal Information</h2>
      <ConfigureForm
        data={configurePersonalInfoData()}
        handleChange={handlePersonalInfoChange}
        disableFields={false}
      />
    </div>
  );
};

export default PersonalInfo;
