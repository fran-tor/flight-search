import airlines from '../assets/data/airlines.json';
import airports from '../assets/data/airports.json';

const getAirlineName = (carrierCode: string) => {
  const airline = airlines.find((airline) => airline.iata === carrierCode);
  return airline ? `${airline.name} (${carrierCode})` : carrierCode;
}

const getAirportName = (airportCode: string) => {
  const airport = airports[airportCode as keyof typeof airports];
  return airport ? `${airport.name} (${airportCode})` : airportCode;
};

const formatTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const formartDateTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// Converts PT10H23M or PT48M to 10h 23m or 48m for example
const formatTravelTime = (travelTime: string): string => {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
  const match = travelTime.match(regex);
  if (match) {
    const hours = match[1] || '0';
    const minutes = match[2] || '0';
    return `${hours !== '0' ? `${hours}h ` : ''}${minutes !== '0' ? `${minutes}m` : ''}`.trim();
  }
  return travelTime;
}

export { getAirlineName, getAirportName, formatTime, formartDateTime, formatTravelTime };
