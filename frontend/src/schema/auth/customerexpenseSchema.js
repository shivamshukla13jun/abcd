import * as yup from 'yup';

const customerExpenseSchema =  yup.array().of(
    yup.object().shape({
      service: yup.string().label('Service').required('Expense type is required'),
      value: yup.mixed().label('Value').required('value is required'),
      desc: yup.string().label('Description'),
      positive: yup.boolean().label('Is Positive')
    })
  ).label('Customer Expenses').default([]).notRequired()

export default customerExpenseSchema;
