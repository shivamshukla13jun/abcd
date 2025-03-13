import { format } from 'date-fns'; // Add this import

const formatDate = (date) => {
    try {
      return format(new Date(date), 'MM/dd/yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };

export  {formatDate};