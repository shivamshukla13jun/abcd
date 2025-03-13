 const allLoadData = [
    {
      id: "#1",
      status: "In Progress",
      customer: "Customer 1",
      pickupLocation: "Line 1 2333",
      carrier: "Carrier Co. 1",
      driver: "Driver 1",
      driverNo: "555999888",
      date: "23-06-24",
      pickupDate: "2024-06-22",
      recieverAddress: "Line 1 233",
      DropLocation: "Line 1 233",
      DropDate: "2024-06-28",
      missingData: []
    },
    {
      id: "#2",
      status: "Dispatched",
      customer: "Customer 1",
      pickupLocation: "Sample Location 4",
      pickupDate: "1/21/2025 20:00",
      recieverAddress: "Sample Location 2",
      DropDate: "1/30/2025 16:00",
      carrier: "Carrier 1",
      driver: "Driver 1",
      equipment: "Tanker",
      powerUnit: "Not Set",
    //   distance: "1257 mi",
    //   weight: "45000 lbs",
    //   cost: {
    //     total: "$2,826.00",
    //     transportation: "$2,512.00",
    //     additional: "$314.00",
    //     rate: "11.11"
    //   },
    //   poNumber: "PO 1239",
    //   loadType: "Shared",
    //   hazmat: "Non Hazardous Liquid",
    //   lastUpdated: "01/21/2025 23:23:24",
    //   missingData: []
    }
  ];
  const locationClasses = ["warehouse", "port"];
  const locationRequirement = [
    { id: 1, name: "Liftgate Service Needed" },
    { id: 2, name: "Inside Pickup" },
    { id: 3, name: "Appointment Required" },
    { id: 4, name: "Driver Assist Required" },
  ];
  // Enums for LoadStatus, LoadSize, and EquipmentType
const LoadStatus = [
  {id:1, name: 'Pending'},
  {id:2, name: 'In Progress'},
  {id:3, name: 'Dispatched'},
  {id:4, name: 'Delivered'},
  {id:5, name: 'Cancelled'},
]

const  LoadSize =[
  {id:"partial", name: 'Partial'},
  {id:"full", name: 'Full'},
]
const tabs = ["load", "customer", "asset", "pickup", "delivery", "document"];


const EquipmentType=[
    {
      "category": "1. Dry Van",
      "options": [
        { "value": "Van", "label": "Van" },
        { "value": "Van - Air-Ride", "label": "Van - Air-Ride" },
        { "value": "Van - Hazardous", "label": "Van - Hazardous" },
        { "value": "Van - Vented", "label": "Van - Vented" },
        { "value": "Van w/ Curtains", "label": "Van w/ Curtains" },
        { "value": "Van w/ Pallet Exchange", "label": "Van w/ Pallet Exchange" }
      ]
    },
    {
      "category": "2. Temp. Control",
      "options": [
        { "value": "Reefer", "label": "Reefer" },
        { "value": "Reefer - Hazardous", "label": "Reefer - Hazardous" },
        { "value": "Reefer w/ Pallet Exchange", "label": "Reefer w/ Pallet Exchange" }
      ]
    },
    {
      "category": "3. Flatbed",
      "options": [
        { "value": "Double Drop", "label": "Double Drop" },
        { "value": "Flatbed", "label": "Flatbed" },
        { "value": "Flatbed - Hazardous", "label": "Flatbed - Hazardous" },
        { "value": "Flatbed w/ Pallet Exchange", "label": "Flatbed w/ Pallet Exchange" },
        { "value": "Flatbed w/ Sides", "label": "Flatbed w/ Sides" },
        { "value": "Lowboy", "label": "Lowboy" },
        { "value": "Maxi", "label": "Maxi" },
        { "value": "Removable Gooseneck", "label": "Removable Gooseneck" },
        { "value": "Step Deck", "label": "Step Deck" }
      ]
    },
    {
      "category": "4. Specialized",
      "options": [
        { "value": "Auto Carrier", "label": "Auto Carrier" },
        { "value": "Dump Trailer", "label": "Dump Trailer" },
        { "value": "Hopper Bottom", "label": "Hopper Bottom" },
        { "value": "Hotshot", "label": "Hotshot" },
        { "value": "Tanker", "label": "Tanker" }
      ]
    },
    {
      "category": "5. Flexible Type",
      "options": [
        { "value": "Flatbed/Step Deck", "label": "Flatbed/Step Deck" },
        { "value": "Flatbed/Van", "label": "Flatbed/Van" },
        { "value": "Flatbed/Reefer", "label": "Flatbed/Reefer" },
        { "value": "Reefer/Van", "label": "Reefer/Van" },
        { "value": "Flatbed/Reefer/Van", "label": "Flatbed/Reefer/Van" }
      ]
    },
    {
      "category": "Misc.",
      "options": [
        { "value": "Power Only", "label": "Power Only" }
      ]
    }
  ]


export  {allLoadData,locationClasses,locationRequirement,LoadStatus,LoadSize,EquipmentType,tabs};