import { IExpenseItem } from "../../load-services/models/Load.model";
import { IInvoice } from "../Invoice.model";

interface SubtotalParams {
  customerRate?: number;
  customerExpense: IExpenseItem[];
}

interface CarrierSubtotalParams {
  dispatchRate: number;
  carrierExpense: IExpenseItem[];
  loadAmount: number;
}

interface TotalAmountParams {
  subTotal: number;
  discountPercent: number;
  taxRate: number;
  deposit: number;
}

/** Calculate Customer subtotal */
const getCustomerSubtotal = ({ customerRate = 0, customerExpense }: SubtotalParams): number => {
  const baseAmount = parseFloat(customerRate.toString()) || 0;
  const totalExpenses = customerExpense.reduce((sum, expense) => {
    const amount = parseFloat(expense.value.toString()) || 0;
    return expense.positive ? sum + amount : sum - amount;
  }, 0);
  return baseAmount + totalExpenses;
};

/** Calculate Carrier subtotal */
const getCarrierSubtotal = ({ dispatchRate = 0, carrierExpense, loadAmount = 0 }: CarrierSubtotalParams): number => {
  const commissionAmount = (dispatchRate / 100) * loadAmount;
  const baseAmount = loadAmount - commissionAmount;
  const totalExpenses = carrierExpense.reduce((sum, expense) => {
    const amount = parseFloat(expense.value.toString()) || 0;
    return expense.positive ? sum + amount : sum - amount;
  }, 0);
  return baseAmount + totalExpenses;
};

/** Calculate total amount with tax and discounts */
const calculateTotalAmount = ({ subTotal, discountPercent, taxRate, deposit }: TotalAmountParams) => {
  const totalDiscount = (subTotal * discountPercent) / 100;
  const taxAmount = (subTotal * taxRate) / 100;
  const total = subTotal - totalDiscount + taxAmount;
  const balanceDue = total - deposit;

  return {
    subTotal,
    totalDiscount,
    taxAmount,
    total,
    balanceDue
  };
};

export { 
  getCustomerSubtotal, 
  getCarrierSubtotal,
  calculateTotalAmount,
  type SubtotalParams,
  type CarrierSubtotalParams,
  type TotalAmountParams
};