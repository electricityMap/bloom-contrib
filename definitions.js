// Declare all types
// The value should not changed as it is stored in the database
// The variable name can however be changed

/* Units */
export const UNIT_LITER = 'L';
export const UNIT_KILOGRAMS = 'kg';
export const UNIT_MONETARY_EUR = 'EUR';
export const UNIT_ITEM = 'item';
export const UNIT_ENERGY = 'kWh';
export const UNIT_PORTION = 'portion';
export const UNIT_GLASS = 'glass';
export const UNIT_CUP = 'cup';
export const UNITS = [
  UNIT_LITER,
  UNIT_KILOGRAMS,
  UNIT_MONETARY_EUR,
  UNIT_ITEM,
  UNIT_ENERGY,
  UNIT_PORTION,
  UNIT_GLASS,
  UNIT_CUP,
];

/* Activity Types
Each activity type is tied to a specific UI
This is why it's important to group the electricity activities together
as they will use the electricityMap.
*/
export const ACTIVITY_TYPE_ELECTRICITY = 'ACTIVITY_TYPE_ELECTRICITY';
export const ACTIVITY_TYPE_ELECTRIC_VEHICLE_CHARGING = 'ACTIVITY_TYPE_ELECTRIC_VEHICLE_CHARGING';
export const ACTIVITY_TYPE_ELECTRIC_HEATING = 'ACTIVITY_TYPE_ELECTRIC_HEATING';
export const ACTIVITY_TYPE_NON_ELECTRIC_HEATING = 'ACTIVITY_TYPE_NON_ELECTRIC_HEATING';
export const ACTIVITY_TYPE_TRANSPORTATION = 'ACTIVITY_TYPE_TRANSPORTATION';
export const ACTIVITY_TYPE_MEAL = 'ACTIVITY_TYPE_MEAL';
export const ACTIVITY_TYPE_PURCHASE = 'ACTIVITY_TYPE_PURCHASE';

export const ELECTRICITY_ACTIVITIES = [
  ACTIVITY_TYPE_ELECTRICITY,
  ACTIVITY_TYPE_ELECTRIC_VEHICLE_CHARGING,
  ACTIVITY_TYPE_ELECTRIC_HEATING,
];


/* Transportation */
export const TRANSPORTATION_MODE_PLANE = 'plane';
export const TRANSPORTATION_MODE_BIKE = 'bike';
export const TRANSPORTATION_MODE_EBIKE = 'ebike';
export const TRANSPORTATION_MODE_CAR = 'car';
export const TRANSPORTATION_MODE_BUS = 'bus';
export const TRANSPORTATION_MODE_PUBLIC_TRANSPORT = 'public_transport';
export const TRANSPORTATION_MODE_TRAIN = 'train';
export const TRANSPORTATION_MODE_FERRY = 'ferry';
export const TRANSPORTATION_MODE_ESCOOTER = 'escooter';
export const TRANSPORTATION_MODE_MOTORBIKE = 'motorbike';
export const TRANSPORTATION_MODE_FOOT = 'foot';

/* Meals */
export const MEAL_TYPE_VEGAN = 'MEAL_TYPE_VEGAN';
export const MEAL_TYPE_VEGETARIAN = 'MEAL_TYPE_VEGETARIAN';
export const MEAL_TYPE_MEAT_OR_FISH = 'MEAL_TYPE_MEAT_OR_FISH';
export const MEAL_TYPE_PESCETARIAN = 'MEAL_TYPE_PESCETARIAN';
export const MEAL_TYPE_MEAT_LOW = 'MEAL_TYPE_MEAT_LOW';
export const MEAL_TYPE_MEAT_MEDIUM = 'MEAL_TYPE_MEAT_MEDIUM';
export const MEAL_TYPE_MEAT_HIGH = 'MEAL_TYPE_MEAT_HIGH';

/* Purchases */
// Food and beverages
export const PURCHASE_CATEGORY_FOOD = 'Food';
export const PURCHASE_CATEGORY_FOOD_BAKERY = 'Cereals and cereal products (ND)';
export const PURCHASE_CATEGORY_MOBILE_PHONE = 'Mobile phone';

// Stores
export const PURCHASE_CATEGORY_STORE_CLOTHING = 'CLOTHING';
export const PURCHASE_CATEGORY_STORE_FOOD = 'FOOD AND NON-ALCOHOLIC BEVERAGES';
export const PURCHASE_CATEGORY_STORE_HARDWARE = 'TOOLS AND EQUIPMENT FOR HOUSE AND GARDEN';
export const PURCHASE_CATEGORY_STORE_GARDEN_AND_PET = 'GARDEN PRODUCTS AND PETS';
export const PURCHASE_CATEGORY_STORE_ELECTRONIC = 'Information and communication equipment';
export const PURCHASE_CATEGORY_STORE_BOOKS = 'NEWSPAPERS, BOOKS AND STATIONERY';
export const PURCHASE_CATEGORY_STORE_PERSONAL_CARE = 'PERSONAL CARE';
export const PURCHASE_CATEGORY_STORE_FURNISHING = 'Furnishings, loose carpets and rugs (D)';
export const PURCHASE_CATEGORY_STORE_HOUSEHOLD_APPLIANCE = 'HOUSEHOLD APPLIANCES';

// Healthcare
export const PURCHASE_CATEGORY_MEDICINES_AND_HEALTH_PRODUCTS = 'MEDICINES AND HEALTH PRODUCTS'
export const PURCHASE_CATEGORY_HEALTHCARE_DOCTOR = 'OUTPATIENT CARE SERVICES';

// Transportation
export const PURCHASE_CATEGORY_TRANSPORTATION_FUEL = 'Fuels and lubricants for personal transport equipment (ND)';
export const PURCHASE_CATEGORY_TRANSPORTATION_AUTOMOTIVE_MAINTENANCE_AND_REPAIR = 'Maintenance and repair of personal transport equipment (S)';
export const PURCHASE_CATEGORY_TRANSPORTATION_AUTOMOTIVE_PARTS = 'Parts and accessories for personal transport equipment (SD)';

// Car
// Size (values are used in co2eq/car/cars.json)
export const EUROCARSEGMENT_A = 'A'; // corresponds to size "Mini" in https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2019
export const EUROCARSEGMENT_B = 'B'; // corresponds to size "Supermini" in https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2019
export const EUROCARSEGMENT_C = 'C'; // corresponds to size "Lower medium" in https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2019
export const EUROCARSEGMENT_D = 'D'; // corresponds to size "Upper medium" in https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2019
export const EUROCARSEGMENT_E = 'E'; // corresponds to size "Executive" in https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2019
export const EUROCARSEGMENT_F = 'F'; // corresponds to size "Luxury" in https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2019
export const EUROCARSEGMENT_S = 'S'; // corresponds to size "Sports" in https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2019
export const EUROCARSEGMENT_J = 'J'; // corresponds to size "Dual purpose 4X4" in https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2019
export const EUROCARSEGMENT_M = 'M'; // corresponds to size "MPV" in https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2019
// Engine type (values are used in co2eq/car/cars.json)
export const ENGINETYPE_DIESEL = 'diesel';
export const ENGINETYPE_PETROL = 'petrol';
export const ENGINETYPE_PLUGIN_HYBRID_ELECTRIC = 'plugInHybridElectric';
export const ENGINETYPE_BATTERY_ELECTRIC = 'batteryElectric';
export const ENGINETYPE_HYBRID = 'hybrid';
export const ENGINETYPE_LPG = 'lpg';
export const ENGINETYPE_CNG = 'cng';

// Heating source
export const HEATING_SOURCE_COAL_BOILER = 'HEATING_SOURCE_COAL_BOILER';
export const HEATING_SOURCE_OIL_BOILER = 'HEATING_SOURCE_OIL_BOILER';
export const HEATING_SOURCE_GAS_BOILER = 'HEATING_SOURCE_GAS_BOILER';
export const HEATING_SOURCE_GAS_MICRO_COMBINED_HEAT_AND_POWER = 'HEATING_SOURCE_GAS_MICRO_COMBINED_HEAT_AND_POWER';
export const HEATING_SOURCE_GAS_ABSORPTION_HEAT_PUMP = 'HEATING_SOURCE_GAS_ABSORPTION_HEAT_PUMP';
export const HEATING_SOURCE_BIOSOURCED_GASES = 'HEATING_SOURCE_BIOSOURCED_GASES';
export const HEATING_SOURCE_BIOMASS_BOILER = 'HEATING_SOURCE_BIOMASS_BOILER';
export const HEATING_SOURCE_GEOTHERMAL = 'HEATING_SOURCE_GEOTHERMAL';
export const HEATING_SOURCE_SOLAR_THERMAL = 'HEATING_SOURCE_SOLAR_THERMAL';
export const HEATING_SOURCE_DISTRICT_HEATING = 'HEATING_SOURCE_DISTRICT_HEATING';

// Entertainment
export const PURCHASE_CATEGORY_ENTERTAINMENT_CIGAR_STORES = 'Tobacco store';
export const PURCHASE_CATEGORY_ENTERTAINMENT_AMUSEMENT_PARKS = 'Amusement park';
export const PURCHASE_CATEGORY_ENTERTAINMENT_MOVIE_THEATER = 'Cinema';
export const PURCHASE_CATEGORY_ENTERTAINMENT_HOTEL = 'Hotel';
export const PURCHASE_CATEGORY_ENTERTAINMENT_BAR_NIGHTCLUB = 'Bar or nightclub';
export const PURCHASE_CATEGORY_ENTERTAINMENT_GAMBLING = 'Gambling';
export const PURCHASE_CATEGORY_ENTERTAINMENT_CRUISE_LINES = 'Cruise';
export const PURCHASE_CATEGORY_ENTERTAINMENT_LIQUOR_STORE = 'Liquor store';

// Hotel  stay
export const HOTEL_CLASS_ZERO_TO_TWO_STARS = 'HOTEL_CLASS_ZERO_TO_TWO_STARS';
export const HOTEL_CLASS_THREE_STARS = 'HOTEL_CLASS_THREE_STARS';
export const HOTEL_CLASS_FOUR_STARS = 'HOTEL_CLASS_FOUR_STARS';
export const HOTEL_CLASS_FIVE_STARS = 'HOTEL_CLASS_FIVE_STARS';
