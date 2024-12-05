import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function CustomButtonGroup({ groups }) {
  return (
    <ButtonGroup>
      {groups.map((group, index) => {
        if (group.length === 1) {
          return (
            <Button key={index}>
              {group[0]}
            </Button>
          );
        } else {
          return (
            <DropdownButton
              as={ButtonGroup}
              title={`Dropdown ${index + 1}`}
              id={`dropdown-${index}`}
              key={index}
            >
              {group.map((item, itemIndex) => (
                <Dropdown.Item eventKey={itemIndex} key={itemIndex}>
                  {item}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          );
        }
      })}
    </ButtonGroup>
  );
}

CustomButtonGroup.propTypes = {
  groups: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.string)
  ).isRequired, // Array of arrays of strings, required
};

export default CustomButtonGroup;

