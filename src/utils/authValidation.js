const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSignupForm = ({
  name = "",
  email = "",
  password = "",
  confirmPassword = "",
  acceptedTerms = false,
}) => {
  const errors = {};

  if (!name.trim()) {
    errors.name = "Full name is required";
  } else if (name.trim().length < 2) {
    errors.name = "Full name must be at least 2 characters";
  }

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!emailPattern.test(email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!acceptedTerms) {
    errors.acceptedTerms = "Please accept the terms to continue";
  }

  return errors;
};
