import { Form, FloatingLabel } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useState } from 'react';

const FormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const { label, id, onChange, errorMessage, ...inputProps } = props;

  console.log(inputProps.pattern);
  const pattern = /^(010|011|012|015)\d{8}$/;
  const isValid = pattern.test(inputProps.value);
  console.log(isValid);
  const handleFocus = () => {
    setFocused(true);
  };
  return (
    <Form.Group className="mb-3">
      <FloatingLabel
        dir="rtl"
        lang="ar"
        key={id}
        label={label}
        className="mb-3 form-label"
      >
        <Form.Control
          key={id}
          onChange={onChange}
          {...inputProps}
          onBlur={handleFocus}
          onFocus={() =>
            inputProps.name === 'confirmPassword' && setFocused(true)
          }
          focused={focused.toString()}
        />
        <span> {errorMessage}</span>
      </FloatingLabel>
    </Form.Group>
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
