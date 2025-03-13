export const navData = [
  {
    title: "Dashboard",
    path: "/",
    icon: "FaTachometerAlt",
  },
  {
    title: "Loads",
    path: "/loads",
    icon: "FaTruck",
  },
  {
    title: "Customers",
    path: "/customers",
    icon: "FaUsers",
  },
  {
    title: "Doc Management",
    path: "/doc-management",
    icon: "FaFileAlt",
  },
  {
    title: "Accounting",
    path: "/accounting",
    icon: "FaMoneyBillWave",
    children: [
      {
        title: "Payments",
        path: "/accounting/payments",
        icon: "FaMoneyBill",
      },
      {
        title: "Invoices",
        path: "/accounting/invoices",
        icon: "FaFileInvoiceDollar",
      },
      // {
      //   title: "Expenses",
      //   path: "/accounting/expenses",
      //   icon: "FaReceipt",
      // },
      // {
      //   title: "Ratings",
      //   path: "/accounting/ratings",
      //   icon: "FaStar",
      // },
      // {
      //   title: "Setup",
      //   path: "/accounting/setup",
      //   icon: "FaCog",
      // },
      // {
      //   title: "Reports",
      //   path: "/accounting/reports",
      //   icon: "FaChartBar",
      // },
    ],
  },
];
