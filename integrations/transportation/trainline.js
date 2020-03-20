import { get } from 'lodash';
import request from 'superagent';
import {
  ACTIVITY_TYPE_TRANSPORTATION,
  TRANSPORTATION_MODE_TRAIN,
  TRANSPORTATION_MODE_BUS,
  TRANSPORTATION_MODE_PUBLIC_TRANSPORT,
} from '../../definitions';
import { ValidationError, AuthenticationError } from '../utils/errors';

const LOGIN_PATH = 'https://www.thetrainline.com/login-service/api/login';
const PAST_BOOKINGS_PATH = 'https://www.thetrainline.com/my-account/api/bookings/past';

// Create an agent that can hold cookies
const agent = request.agent();

function matchTransportMode(modeFromTrainline, logger) {
  switch (modeFromTrainline) {
    case 'train':
      return TRANSPORTATION_MODE_TRAIN;
    case 'bus':
      return TRANSPORTATION_MODE_BUS;
    default:
      logger.logWarning(`Couldn't find a matching transportation mode for mode ${modeFromTrainline}`);
      return TRANSPORTATION_MODE_PUBLIC_TRANSPORT;
  }
}

async function login(username, password) {
  const loginResponse = await agent
    .post(LOGIN_PATH)
    .send({
      email: username,
      password,
    });
  // Check if authenticated=true on the response body
  if (!loginResponse.body.authenticated) throw new AuthenticationError('Login failed');
}

function calculateDurationFromLegs(legs) {
  return []
    .concat(legs)
    .filter(leg => leg)
    .reduce((out, leg) => out + leg.duration / 60 || 0, 0);
}

async function connect(requestLogin, requestWebView, logger) {
  const { username, password } = await requestLogin();

  if (!(password || '').length) {
    throw new ValidationError('Password cannot be empty');
  }

  await login(username, password);

  logger.logDebug('Successfully logged into trainline');

  return {
    username,
    password,
  };
}

async function disconnect() {
  return {};
}

async function collect(state, logger) {
  const newState = {
    ...state,
  };

  let pastBookingsRes;

  try {
    pastBookingsRes = await agent
      .get(PAST_BOOKINGS_PATH);
  } catch (err) {
    // Sometimes cookies will have expired, so try again
    const { username, password } = newState;

    await login(username, password);

    pastBookingsRes = await agent
      .get(PAST_BOOKINGS_PATH);
  }

  const tripResults = get(pastBookingsRes, 'body.pastBookings.results', []);

  const activities = [];
  tripResults.forEach((trip) => {
    const tripId = trip.booking.id;
    if (get(trip, 'booking.outward')) {
      const outwardDate = get(trip, 'booking.outward.date');
      activities.push({
        id: `${tripId}-${get(trip, 'booking.outward.origin.id')}`, // a string that uniquely represents this activity
        datetime: outwardDate, // a javascript Date object that represents the start of the activity
        endDatetime: new Date(outwardDate.getTime() + calculateDurationFromLegs(get(trip, 'booking.outward.legs'), []) * 36e5),
        activityType: ACTIVITY_TYPE_TRANSPORTATION,
        transportationMode: matchTransportMode(get(trip, 'booking.outward.legs[0].transportMode'), logger), // a variable (from definitions.js) that represents the transportation mode
        departureStation: get(trip, 'booking.outward.origin.name'), // (for other travel types) a string that represents the original starting point
        destinationStation: get(trip, 'booking.outward.destination.name'), // (for other travel types) a string that represents the final destination
      });
    }
    if (get(trip, 'booking.inward')) {
      // sometimes inward journeys are open so don't have a fixed return date. Use the outward date instead
      const inwardDate = get(trip, 'booking.inward.date') || get(trip, 'booking.outward.date');

      // sometimes inward journeys are open so don't have a fixed return date. Use the outward duration instead
      const isOpenReturn = get(trip, 'booking.inward.openReturn');
      const inwardDuration = calculateDurationFromLegs(isOpenReturn ? get(trip, 'booking.outward.legs') : get(trip, 'booking.inward.legs'));

      // sometimes inward journeys are open so don't have a fixed return date. Use the outward transport type instead
      const inwardTransportationMode = get(trip, 'booking.inward.legs[0].transportMode') || get(trip, 'booking.outward.legs[0].transportMode');

      activities.push({
        id: `${tripId}-${get(trip, 'booking.inward.origin.id')}`, // a string that uniquely represents this activity
        datetime: inwardDate, // a javascript Date object that represents the start of the activity
        endDatetime: new Date(inwardDate.getTime() + inwardDuration * 36e5),
        activityType: ACTIVITY_TYPE_TRANSPORTATION,
        transportationMode: matchTransportMode(inwardTransportationMode, logger), // a variable (from definitions.js) that represents the transportation mode
        departureStation: get(trip, 'booking.inward.origin.name'), // (for other travel types) a string that represents the original starting point
        destinationStation: get(trip, 'booking.inward.destination.name'), // (for other travel types) a string that represents the final destination
      });
    }
  });
  return {
    activities,
    newState,
  };
}

const config = {
  label: 'Trainline',
  type: ACTIVITY_TYPE_TRANSPORTATION,
  description: 'collects trips from your train and bus journeys',
  isPrivate: true,
  signupLink: 'https://www.thetrainline.com/',
  contributors: ['liamgarrison'],
  // minRefreshInterval: 60
};

export default {
  connect,
  collect,
  disconnect,
  config,
};
