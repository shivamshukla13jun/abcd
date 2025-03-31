import * as Yup from 'yup';

const Userschema = Yup.object().shape({
  name: Yup.string()
    .label('Full Name')
    .required('Please enter your full name')
    .min(2, 'Name must be at least 2 characters long')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: Yup.string()
    .label('Email Address')
    .email('Please enter a valid email address (e.g. user@example.com)')
    .required('Email address is required for registration'),
  password: Yup.string()
    .label('Password')
    .min(6, 'Password must contain at least 6 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Please create a password'),
  repeatPassword: Yup.string()
    .label('Confirm Password')
    .oneOf([Yup.ref('password'), null], 'Both passwords must match')
    .required('Please confirm your password'),
  role: Yup.array()
    .label('User Role')
    .of(Yup.string())
    .required('Please select at least one role')
    .min(1, 'You must select at least one role'),
});

const defaulUsertValues = {
  name: '', // Default name
  email: '', // Default email
  password: '', // Default password (ensure this is more secure in production)
  repeatPassword: '', // Default repeat password
  role: [], // Default role
};

export { Userschema, defaulUsertValues }
