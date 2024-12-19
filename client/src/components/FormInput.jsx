import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const FormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const { label, id, onChange, errorMessage, ...inputProps } = props;
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  let type;
  if (inputProps.name === 'password' || inputProps.name === 'confirmPassword')
    type = showPassword ? 'text' : 'password';
  else type = inputProps.type;

  return (
    <div key={id} className="relative">
      <label
        htmlFor={inputProps.name}
        className="block mb-2 text-sm"
        style={{ color: 'var(--text-primary)' }}
      >
        {label}
      </label>
      <input
        onChange={onChange}
        {...inputProps}
        className="w-full px-3 py-2 border rounded-md"
        style={{
          backgroundColor: 'var(--input-bg)',
          borderColor: 'var(--border-secondary)',
          color: 'var(--text-primary)',
        }}
        onBlur={handleFocus}
        onFocus={() =>
          inputProps.name === ('confirmPassword' || 'password') &&
          setFocused(true)
        }
        type={type}
        data-focused={focused.toString()}
      />
      {errorMessage && (
        <span style={{ color: 'var(--secondary-color)' }}>{errorMessage}</span>
      )}
      {(inputProps.name === 'password' ||
        inputProps.name === 'confirmPassword') && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? 'Hide Password' : 'Show Password'}
          className="absolute top-9 left-3 flex items-center pt-2"
          onMouseEnter={(e) =>
            (e.target.style.color = 'var(--secondary-hover)')
          }
          onMouseLeave={(e) =>
            (e.target.style.color = 'var(--secondary-color)')
          }
        >
          {showPassword ? (
            <FaRegEyeSlash></FaRegEyeSlash>
          ) : (
            <FaRegEye></FaRegEye>
          )}
        </button>
      )}
    </div>
  );
};

export default FormInput;

FormInput.propTypes = {
  label: PropTypes.string,
  id: PropTypes.number,
  onChange: PropTypes.func,
  errorMessage: PropTypes.string,
  value: PropTypes.string,
};
