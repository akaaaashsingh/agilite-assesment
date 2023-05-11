import axios from "./api";

export const fetchVehicleTypes = async () => {
  try {
    const response = await axios({
      method: "get",
      url: "https://vpic.nhtsa.dot.gov/api/vehicles/getvehiclevariablevalueslist/vehicle%20type?format=json",
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const fetchVehicleMakes = async (vehicleType) => {
  try {
    const response = await axios({
      method: "get",
      url: `https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/${vehicleType}?format=json`,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const fetchVehicleData = async (vehicleType, vehicleMake, year) => {
  try {
    const urlArr = [];
    let responseArr = [];
    vehicleMake?.forEach((make) =>
      urlArr.push(
        `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/${make?.MakeName?.toLowerCase()}${
          year ? "/modelyear/" + year : ""
        }/vehicleType/${vehicleType}?format=json`
      )
    );
    await Promise.all(
      urlArr.map(async (url) => {
        const response = await axios({
          method: "get",
          url,
        });
        if (response?.status === 200 && response?.data?.Results) {
          responseArr = [...responseArr, ...response?.data?.Results];
        }
      })
    );
    return responseArr;
  } catch (error) {
    return error;
  }
};
