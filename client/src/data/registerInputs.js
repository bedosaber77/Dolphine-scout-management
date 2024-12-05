const registerInputs = [
  {
    id: 0,
    name: 'Fname',
    type: 'text',
    label: 'First Name',
    errorMessage: "Your Name shouldn't have neither numbers nor symbols!",
    // controlId: 'formFname',
  },
  {
    id: 1,
    name: 'Lname',
    type: 'text',
    label: 'Last Name',
    errorMessage: "Your Name shouldn't have neither numbers nor symbols!",
    // controlId: 'formLname',
  },
  {
    id: 2,
    name: 'email',
    type: 'email',
    label: 'Email',
    errorMessage: 'Enter a valid email address!',
    // controlId: 'formEmail',
  },
  {
    id: 3,
    name: 'Phonenum',
    type: 'Phonenum',
    label: 'Phone Number',
    pattern: /^(010|011|012|015)\d{8}$/,
    errorMessage: 'Enter a valid Phone Number!',
    // controlId: 'formPhoneNum',
  },
  {
    id: 4,
    name: 'password',
    type: 'password',
    label: 'Password',
    errorMessage: '',
    // controlId: 'formPassword',
  },
  {
    id: 5,
    name: 'confirmPassword',
    type: 'password',
    label: 'Confirm Password',
    errorMessage: '',
    // controlId: 'formConfirmPassword',
  },
];

export default registerInputs;
