import { initalLoadData } from "@redux/InitialData/Load";

const transformLoadData = (apiData) => {
    return {
      loadDetails: {
        loadNumber: apiData.loadNumber,
        loadAmount: apiData.loadAmount,
        status: apiData.status,
        commodity: apiData.commodity,
        loadSize: apiData.loadSize,
        declaredValue: apiData.declaredValue,
        weight: apiData.weight,
        temperature: apiData.temperature,
        equipmentType: apiData.equipmentType,
        equipmentLength: apiData.equipmentLength,
        notes: apiData.notes,
      },
      customerInformation: apiData.customerId || initalLoadData.customerInformation,
      customerExpense: apiData.customerExpense || [],
      carrierIds: apiData.carrierIds || initalLoadData.carrierIds,
      pickupLocations: apiData.pickupLocationId || initalLoadData.pickupLocations,
      deliveryLocations: apiData.deliveryLocationId || initalLoadData.deliveryLocations,
      files: apiData.files || initalLoadData.files,
      items: apiData.items || initalLoadData.items,
      freightCharge: apiData.freightCharge || initalLoadData.freightCharge, 
      customerRate:apiData.customerRate || initalLoadData.customerRate,
      id: apiData._id || null,
      activeTab: "load",
      showCustomer: !!apiData.customerId,
      showAsset: !!apiData.carrierIds?.length,
      showPickup: !!apiData?.pickupLocationId?.length,
      showDelivery: !!apiData?.deliveryLocationId?.length,
    };
  };
  const taransformCarrierData=(apiData)=>{
    return {
      _id: apiData._id || null,
      mcNumber: apiData.mc_mx_ff_numbers || apiData.mcNumber,
      usdot: apiData.usdot || apiData.usdot,
      legal_name: apiData.legal_name || apiData.legal_name,
      drivers: apiData.drivers || apiData.drivers,
      safety_rating: apiData.safety_rating ? Number(apiData.safety_rating) : 0,
      safety_rating_date: apiData.safety_rating_date ? Number(apiData.safety_rating_date) : null,
      safety_review_date: apiData.safety_review_date ? Number(apiData.safety_review_date) : null,
      safety_type: apiData.safety_type ? Number(apiData.safety_type) : null,
      latest_update: apiData.latest_update ? new Date(apiData.latest_update) : null,
      address: apiData.physical_address || apiData.address,
      primaryContact: apiData.phone || apiData.primaryContact,
      contactEmail: apiData.contactEmail || apiData.contactEmail,
      driverInfo: {
        driver1Name: apiData.driver1Name || apiData.driver1Name,
        driver2Name: apiData.driver2Name || apiData.driver2Name,
        driver1Phone: apiData.driver1Phone || apiData.driver1Phone,
        driver2Phone: apiData.driver2Phone || apiData.driver2Phone,
        driver1CDL: apiData.driver1CDL || apiData.driver1CDL,
        driver2CDL: apiData.driver2CDL || apiData.driver2CDL,
        driver1CDLExpiration: apiData.driver1CDLExpiration || apiData.driver1CDLExpiration,
        driver2CDLExpiration: apiData.driver2CDLExpiration || apiData.driver2CDLExpiration,
        powerunit: apiData.power_units || apiData.powerunit,
        duns_number: apiData.duns_number || apiData.duns_number,
        trailer: apiData.trailer || apiData.trailer,
      },
    };
  }

 
  export {transformLoadData,taransformCarrierData}