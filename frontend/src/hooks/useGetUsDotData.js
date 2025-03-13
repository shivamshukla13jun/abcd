import apiService from '@service/apiService';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useDebounce from './useDebounce';

const useGetUsDotDataForCustomer = (value) => {
    const [usDotData, setUsDotData] = useState(null);
    const debouncedValue = useDebounce(value, 500); // Correct usage

    useEffect(() => {
        const fetchUSDOTData = async () => {
            if (debouncedValue) {
                try {
                    const response = await apiService.getDataByUsdotNumber(debouncedValue);
                    if (response?.data) {
                        const apiData = response.data;
                        console.log("apiData",apiData);
                        const formattedData = {
                            company: apiData.legal_name || apiData.dba_name || '',
                            // phone: apiData.phone || '',
                            address: apiData.physical_address || '',
                            mcNumber: apiData.mc_mx_ff_numbers || '',
                            usdot: apiData.usdot || '',
                        };

                        setUsDotData(formattedData);
                    } else {
                        console.error('Invalid API response:', response);
                    }
                } catch (err) {
                    toast.error('Failed to fetch USDOT data. Please try again later.');
                }
            } else {
                setUsDotData(null); // Clear data if input is cleared
            }
        };

        fetchUSDOTData();
    }, [debouncedValue]); // Properly triggers when debouncedValue changes

    return usDotData;
};
const useGetUseDataForCarrier = (value) => {
    const [usDotData, setUsDotData] = useState(null);
    const debouncedValue = useDebounce(value, 500); // Correct usage

    useEffect(() => {
        const fetchUSDOTData = async () => {
            if (debouncedValue) {
                try {
                    const response = await apiService.getDataByUsdotNumber(debouncedValue);
                    if (response?.data) {
                        const apiData = response.data;
                        console.log("apiData",apiData);
                        const formattedData = {
                            company: apiData.legal_name || apiData.dba_name || '',
                            // phone: apiData.phone || '',
                            address: apiData.physical_address || '',
                            mcNumber: apiData.mc_mx_ff_numbers || '',
                            usdot: apiData.usdot || '',
                        };

                        setUsDotData(formattedData);
                    } else {
                        console.error('Invalid API response:', response);
                    }
                } catch (err) {
                    toast.error('Failed to fetch USDOT data. Please try again later.');
                }
            } else {
                setUsDotData(null); // Clear data if input is cleared
            }
        };

        fetchUSDOTData();
    }, [debouncedValue]); // Properly triggers when debouncedValue changes

    return usDotData;
}

export { useGetUsDotDataForCustomer ,useGetUseDataForCarrier};
