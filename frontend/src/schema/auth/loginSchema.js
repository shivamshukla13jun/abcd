import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .label('Email Address')
    .email('Please enter a valid email address')
    .required('Please enter your email address to login'),
  password: Yup.string()
    .label('Password')
    .min(6, 'Password must be at least 6 characters long')
    .required('Please enter your password'),
});

const defaultLoginValues={
    email:"",
    password:""
}

export {loginSchema,defaultLoginValues}