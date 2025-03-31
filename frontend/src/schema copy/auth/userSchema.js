import * as Yup from 'yup';
 // Yup schema for validation
  const Userschema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Repeat password is required'),
    role: Yup.array()
      .of(Yup.string())
      .required('Role is required')
      .min(1, 'At least one role is required'),
  });
  const defaulUsertValues={
    name: '', // Default name
    email: '', // Default email
    password: '', // Default password (ensure this is more secure in production)
    repeatPassword: '', // Default repeat password
    role: [], // Default role
  }
  export {Userschema,defaulUsertValues}
