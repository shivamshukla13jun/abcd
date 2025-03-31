const getServiceType = (serviceId,itemServices=[]) => {
    const service = itemServices.find((s) => s._id === serviceId);
    return service ? service.value : "number"; // Default to "text" if not found
  };
export   {getServiceType}