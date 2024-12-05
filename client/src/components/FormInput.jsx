import { Form, FloatingLabel } from 'react-bootstrap';
import PropTypes from 'prop-types';

const FormInput = (props) => {
  const { label, id, onChange, ...inputProps } = props;
  return (
    <Form.Group className="mb-3" controlId="formEmail">
      <FloatingLabel
        dir="rtl"
        lang="ar"
        // controlId={controlId}
        key={id}
        label={label}
        className="mb-3 form-label"
      >
        <Form.Control
          key={id}
          onChange={onChange}
          {...inputProps}
          placeholder="name@example.com"
          isInvalid
        />
        <Form.Control.Feedback type="invalid">
          Please choose a username.
        </Form.Control.Feedback>
      </FloatingLabel>
    </Form.Group>
  );
};

export default FormInput;

FormInput.propTypes = {
  label: PropTypes.string,
  id: PropTypes.number,
  onChange: PropTypes.func,
};
