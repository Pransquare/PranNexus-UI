import dayjs from "dayjs";

export const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};
export const validatePhoneNumber = (number) => {
  const re = /^\+?[0-9]{1,4}?[-. ]?[0-9]{1,12}$/;
  return re.test(number);
};

export const stringNotNullValidation = (input) => {
  return input && input.trim() !== "";
};

export const validateDayjsDate = (input) => {
  return input && dayjs(input).isValid();
};

export const validateJsDate = (input) => {
  return input && new Date(input).toString() !== "Invalid Date";
};

export const integerNotNullValidation = (input) => {
  return input && !isNaN(input) && input >= 0;
};
export const isValidGradeMarks = (value) => {
  const regex =
    /^([a-zA-Z0-9\s]*\d*\.?\d*[%]?)(\/[a-zA-Z0-9\s]*\d*\.?\d*[%]?)?$/; // Allows letters, numbers, optional decimal, and % or /
  return regex.test(value);
};

export const validateAadhaar = (input) => {
  const re = /^[0-9]{12}$/;
  return re.test(input);
};
export const validatePan = (input) => {
  const re = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return re.test(input);
};
export const validatePostalCode = (input) => {
  const re = /^[1-9][0-9]{4,5}$/; // Accepts 5 or 6 digit postal codes
  return re.test(input);
};

export const validateUAN = (input) => {
  const re = /^[0-9]{12}$/;
  return re.test(input);
};

export const validateAlphabets = (input) => {
  const re = /^[a-zA-Z\s]+$/;
  return input && input.trim() !== "" && re.test(input);
};

export const validateOtp = (input, length = 6) => {
  const regex = new RegExp(`^\\d{${length}}$`);
  return regex.test(input);
};

export const validatePassword = (input) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(input);
}

export const validateAlphaNumericWithDotDash  = (input) => {
  const re = /^[a-zA-Z0-9\s.-]+$/;
  return re.test(input);
}