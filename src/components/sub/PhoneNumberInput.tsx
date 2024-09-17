// PhoneNumberInput.tsx
import React from "react";
import "react-phone-number-input/style.css"; // Import default styles
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  onValid: (isValid: boolean) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  onValid,
}) => {
  const handleChange = (newValue: string | undefined) => {
    const newValueStr = newValue ?? ""; // Convert undefined to empty string
    onChange(newValueStr);
    onValid(isValidPhoneNumber(newValueStr));
  };

  return (
      <PhoneInput
        className="input input-bordered w-full"
        international
        value={value}
        onChange={handleChange}
        defaultCountry="US" // You can change the default country if needed
      />
  );
};

export default PhoneNumberInput;
