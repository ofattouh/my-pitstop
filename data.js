
module.exports = {

  //------------------------------------------------------------------------------------
  // Mock Data

  // 3rd party authorized vendors
  vendors: [
    { accountId: 1, name: "Vendor #1" },
    { accountId: 2, name: "Vendor #2" },
    { accountId: 3, name: "Vendor #3" },
  ],

  // Vehicles inventory
  vehicles: [
    { id: "uuid-Toyota", manufacturer: "Toyota", model: "2015" },
    { id: "uuid-Acura", manufacturer: "Acura", model: "2016" },
    { id: "uuid-AlfaRomeo", manufacturer: "Alfa Romeo", model: "2017" },
    { id: "uuid-AstonMartin", manufacturer: "Aston Martin", model: "2018" },
    { id: "uuid-Audi", manufacturer: "Audi", model: "2019" },
    { id: "uuid-Bentley", manufacturer: "Bentley", model: "2020" },
    { id: "uuid-BMW", manufacturer: "BMW", model: "2021" },
    { id: "uuid-Buick", manufacturer: "Buick", model: "2020" },
    { id: "uuid-Dodge", manufacturer: "Dodge", model: "2019" },
    { id: "uuid-GMC", manufacturer: "GMC", model: "2018" },
    { id: "uuid-Ford", manufacturer: "Ford", model: "2021" },
  ],

  // Sensor data. timestamp same value(optional)
  sensorData: [
    { id: "uuid-Toyota", type: "engine_speed_type_Toyota", value: 10, unit: "rpm", timestamp: "2019-09-07T-15:50+00" },
    { id: "uuid-Acura", type: "engine_speed_type_Acura", value: 20, unit: "rpm", timestamp: "2019-09-07T-15:50+00" },
    { id: "uuid-AlfaRomeo", type: "engine_speed_type_AlfaRomeo", value: 30, unit: "rpm", timestamp: "2019-09-07T-15:50+00" },
    { id: "uuid-AstonMartin", type: "engine_speed_type_AstonMartin", value: 40, unit: "rpm", timestamp: "2019-09-07T-15:50+00" },
    { id: "uuid-Audi", type: "engine_speed_type_Audi", value: 50, unit: "rpm", timestamp: "2019-09-07T-15:50+00" },
    { id: "uuid-Bentley", type: "engine_speed_type_Bentley", value: 60, unit: "rpm", timestamp: "2019-09-07T-15:50+00" },
    { id: "uuid-BMW", type: "engine_speed_type_BMW", value: 70, unit: "rpm", timestamp: "2019-09-07T-15:50+00" },
    { id: "uuid-Buick", type: "engine_speed_type_Buick", value: 80, unit: "rpm", timestamp: "2019-09-07T-15:50+00" },
    { id: "uuid-Dodge", type: "engine_speed_type_Dodge", value: 90, unit: "rpm", timestamp: "2019-09-07T-15:50+00" },
    { id: "uuid-GMC", type: "engine_speed_type_GMC", value: 100, unit: "rpm", timestamp: "2019-09-07T-15:50+00" },
    { id: "uuid-Ford", type: "engine_speed_type_Ford", value: 110, unit: "rpm", timestamp: "2019-09-07T-15:50+00" },
  ],
};
