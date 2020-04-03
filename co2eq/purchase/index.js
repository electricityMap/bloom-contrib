import md5 from 'tiny-hashes/md5';
import {
  ACTIVITY_TYPE_MEAL,
  ACTIVITY_TYPE_TRANSPORTATION,
  ACTIVITY_TYPE_PURCHASE,
  TRANSPORTATION_MODE_CAR,
  TRANSPORTATION_MODE_TRAIN,
  TRANSPORTATION_MODE_PLANE,
  TRANSPORTATION_MODE_PUBLIC_TRANSPORT,
  UNIT_MONETARY_EUR,
  UNIT_ITEM,
  UNIT_LITER,
} from '../../definitions';
import { convertToEuro, getAvailableCurrencies } from '../../integrations/utils/currency/currency';
import footprints from './footprints.yml';

export const explanation = {
  text: null,
  links: [
    { label: 'Tomorrow footprint database', href: 'https://github.com/tmrowco/northapp-contrib/blob/master/co2eq/purchase/footprints.yml' },
  ],
};

const ENTRY_BY_KEY = {};
export const purchaseIcon = {};

// Traverse and index tree
function indexNodeChildren(branch, i = 1) {
  Object.entries(branch._children || []).forEach(([k, v]) => {
    if (ENTRY_BY_KEY[k]) {
      throw new Error(`Error while indexing footprint tree: There's already an entry for ${k}`);
    }
    ENTRY_BY_KEY[k] = v;
    purchaseIcon[k] = v.icon;
    // Also make sure we add additional props
    v.key = k;
    v.level = i;
    v.parentKey = branch.key;
    // Traverse further
    indexNodeChildren(v, i + 1);
  });
}
indexNodeChildren(footprints);

export function getRootEntry() {
  return footprints;
}
export function getEntryByKey(key) {
  return ENTRY_BY_KEY[key];
}
export function getEntryByPath(path) {
  let entry = footprints; // root node
  for (let i = 0; i < path.length; i += 1) {
    entry = (entry._children || {})[path[i]];
  }
  return entry;
}

export function getChecksumOfFootprints() {
  return md5(JSON.stringify(footprints));
}

export function getDescendants(entry, filter = (_ => true), includeRoot = false) {
  // Note: `getDescendants` is very close to `indexNodeChildren`
  // Note2: if a node gets filtered out, its children won't be visited
  if (!entry) { throw new Error('Invalid `entry`'); }
  let descendants = includeRoot
    ? { [entry.key]: entry }
    : {};
  Object.values(entry._children || []).filter(filter).forEach((child) => {
    descendants = {
      ...descendants,
      ...getDescendants(child, filter, true),
    };
  });
  return descendants;
}


// ** modelName must not be changed. If changed then old activities will not be re-calculated **
export const modelName = 'purchase';
export const modelVersion = `3_${getChecksumOfFootprints()}`; // This model relies on footprints.yaml
export const modelCanRunVersion = 1;
export function modelCanRun(activity) {
  const {
    costAmount, costCurrency, activityType, transportationMode, lineItems,
  } = activity;
  if (costAmount && costCurrency) {
    if (activityType === ACTIVITY_TYPE_MEAL) return true;
    if (activityType === ACTIVITY_TYPE_TRANSPORTATION) {
      switch (transportationMode) {
        case TRANSPORTATION_MODE_CAR:
        case TRANSPORTATION_MODE_TRAIN:
        case TRANSPORTATION_MODE_PLANE:
        case TRANSPORTATION_MODE_PUBLIC_TRANSPORT:
          return true;
        default:
          return false;
      }
    }
  }
  if (activityType === ACTIVITY_TYPE_PURCHASE && lineItems && lineItems.length) {
    return true;
  }

  return false;
}
function correctWithParticipants(footprint, participants) {
  return footprint / (participants || 1);
}
function extractEur({ costAmount, costCurrency }) {
  return (costAmount && costCurrency)
    ? convertToEuro(costAmount, costCurrency)
    : null;
}

/**
 * Returns the compatible unit and amounts of a line item
 * @param {*} lineItem - Object of the the type { name: <string>, unit: <string>, value: <string>, costAmount: <float>, costCurrency: <string> }
 * @param {*} entry - A purchase entry
 */
function extractComptabileUnitAndAmount(lineItem, entry) {
  const isMonetaryItem = getAvailableCurrencies().includes(lineItem.unit);
  // Extract eurAmount if applicable
  const eurAmount = extractEur({ costCurrency: isMonetaryItem ? lineItem.unit : null, costAmount: isMonetaryItem ? lineItem.value : null });
  // TODO(olc): Also look at potential available conversions
  const availableEntryUnit = entry.unit;
  if (availableEntryUnit === UNIT_LITER && lineItem.unit === UNIT_LITER) {
    return { unit: UNIT_LITER, amount: lineItem.value };
  }
  if (availableEntryUnit === UNIT_MONETARY_EUR && eurAmount != null) {
    return { unit: UNIT_MONETARY_EUR, amount: eurAmount };
  }
  if (availableEntryUnit === UNIT_ITEM) {
    return { unit: UNIT_ITEM, amount: 1 };
  }
  throw new Error(`Line item of activity has no compatible purchase unit.`);
}

/**
 * Calculates the carbon emissions of a line item entry
 * @param {*} lineItem - Object of the the type { identifier: <string>, unit: <string>, value: <string>, costAmount: <float>, costCurrency: <string> }
 */
export function carbonEmissionOfLineItem(lineItem, countryCodeISO2) {
  // The generic identifier property holds the purchaseType value, so rename to make clear..
  const { identifier } = lineItem;
  const entry = getEntryByKey(identifier);
  if (!entry) {
    throw new Error(`Unknown purchaseType identifier: ${identifier}`);
  }
  if (!entry.intensityKilograms) {
    throw new Error(`Missing carbon intensity for purchaseType: ${identifier}`);
  }

  const { unit, amount } = extractComptabileUnitAndAmount(lineItem, entry);
  if (unit == null || amount == null || !Number.isFinite(amount)) {
    throw new Error(`Invalid unit ${unit} or amount ${amount} for purchaseType ${identifier}. Expected ${entry.unit}`);
  }

  if (entry.unit !== unit) {
    throw new Error(`Invalid unit ${unit} given for purchaseType ${identifier}. Expected ${entry.unit}`);
  }

  if (typeof entry.intensityKilograms === 'number') {
    return entry.intensityKilograms * amount;
  }
  if (entry.unit !== UNIT_MONETARY_EUR) {
    throw new Error(`Invalid unit ${entry.unit} given. Expected ${UNIT_MONETARY_EUR}`);
  }
  if (countryCodeISO2 == null) {
    // Use average of all countries
    // TODO: weight by the GDP of countries or by population
    const values = Object.values(entry.intensityKilograms);
    return (values.reduce((a, b) => a + b, 0) / values.length) * amount;
  }
  if (!entry.intensityKilograms[countryCodeISO2]) {
    throw new Error(`Missing carbon intensity for country ${countryCodeISO2} and identifier ${identifier}`);
  }
  return entry.intensityKilograms[countryCodeISO2] * amount;
}

/*
  Carbon emissions of an activity (in kgCO2eq)
*/
export function carbonEmissions(activity) {
  let footprint;
  const eurAmount = extractEur(activity);

  switch (activity.activityType) {
    case ACTIVITY_TYPE_MEAL:
      // Source: http://www.balticproject.org/en/calculator-page
      footprint = eurAmount * 79.64 / 1000; // Restaurant bill
      break;

    case ACTIVITY_TYPE_TRANSPORTATION:
      // Source: http://www.balticproject.org/en/calculator-page
      switch (activity.transportationMode) {
        case TRANSPORTATION_MODE_CAR:
          footprint = eurAmount * 1186 / 1000; // Taxi bill
          break;
        case TRANSPORTATION_MODE_TRAIN:
        case TRANSPORTATION_MODE_PUBLIC_TRANSPORT:
          footprint = eurAmount * 335.63 / 1000;
          break;
        case TRANSPORTATION_MODE_PLANE:
          footprint = eurAmount * 1121.52 / 1000;
          break;
        default:
          throw new Error(
            `Couldn't calculate purchase carbonIntensity for transporation activity with mode ${activity.transportationMode}`
          );
      }
      break;

    case ACTIVITY_TYPE_PURCHASE: {
      const { lineItems, countryCodeISO2 } = activity;

      // First check if lineItems contains and calculate total of all line items
      if (lineItems && lineItems.length) {
        // TODO(df): What to do on a single line error? Abort all? Skip item?
        footprint = lineItems
          .map(l => carbonEmissionOfLineItem(l, countryCodeISO2))
          .reduce((a, b) => a + b, 0);
      }
      break;
    }

    default:
      throw new Error(
        `Couldn't calculate purchase carbonIntensity for activityType: ${activity.activityType}`
      );
  }

  return correctWithParticipants(footprint, activity.participants);
}
