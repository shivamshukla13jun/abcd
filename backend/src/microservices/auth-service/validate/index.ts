
import * as yup from 'yup';

const AuthRegisterSchema=yup.object().shape({
    email:yup.string().email().required('Email is required'),
    password:yup.string().required('Password is required'),
    name:yup.string().required('Name is required')
})
const AuthLoginSchema=yup.object().shape({
    email:yup.string().email().required('Email is required'),
    password:yup.string().required('Password is required')
})

export {AuthRegisterSchema,AuthLoginSchema}

