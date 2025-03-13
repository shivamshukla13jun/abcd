import * as Yup from 'yup';
const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Enter a valid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });
const defaultLoginValues={
    email:"",
    password:""
}
  export {loginSchema,defaultLoginValues}