package com.example.flight_search.services;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.flight_search.models.Amenity;
import com.example.flight_search.models.FlightDetails;
import com.example.flight_search.models.FlightSearchModel;
import com.example.flight_search.models.FlightSegmentDetails;
import com.example.flight_search.repositories.AmadeusRepository;

@Service
public class FlightSearchService {

    @Autowired
    private AmadeusRepository amadeusRepository;

    public Object searchAirports(String keyword) {
        return amadeusRepository.fetchAirports(keyword);
    }

    public List<FlightDetails> searchFlights(FlightSearchModel request) throws JSONException {
        // Validate dates
        if (request.getDepartureDate().isBefore(request.getCurrentDate())) {
            throw new IllegalArgumentException("Departure date cannot be in the past.");
        }
        if (request.getReturnDate() != null && request.getReturnDate().isBefore(request.getDepartureDate())) {
            throw new IllegalArgumentException("Return date cannot be earlier than departure date.");
        }

        Object apiResponse = amadeusRepository.fetchFlights(request);
        // System.out.println("API Response: " + new
        // JSONObject(apiResponse.toString()).toString(4));
        return parseFlightResponse(apiResponse, request.getCurrency());
    }

    private List<FlightDetails> parseFlightResponse(Object apiResponse, String currency) throws JSONException {
        JSONObject responseJson;
        try {
            responseJson = new JSONObject(apiResponse.toString());
        } catch (JSONException e) {
            throw new RuntimeException("Failed to parse API response to JSON", e);
        }
        JSONArray flights = responseJson.getJSONArray("data");
        JSONObject dictionaries = responseJson.getJSONObject("dictionaries");

        List<FlightDetails> flightDetailsList = new ArrayList<>();

        for (int i = 0; i < flights.length(); i++) {
            JSONObject flight = flights.getJSONObject(i);
            JSONArray itineraries = flight.getJSONArray("itineraries");
            JSONObject price = flight.getJSONObject("price");
            JSONArray travelerPricings = flight.getJSONArray("travelerPricings");

            for (int j = 0; j < itineraries.length(); j++) {
                JSONObject itinerary = itineraries.getJSONObject(j);
                JSONArray segments = itinerary.getJSONArray("segments");

                FlightDetails details = new FlightDetails();
                details.setTotalPrice(price.getString("total"));
                details.setCurrency(currency);
                details.setPricePerTraveler(
                        travelerPricings.getJSONObject(0).getJSONObject("price").getString("total"));

                List<FlightSegmentDetails> segmentDetailsList = new ArrayList<>();
                Duration totalDuration = Duration.ZERO;

                for (int k = 0; k < segments.length(); k++) {
                    JSONObject segment = segments.getJSONObject(k);
                    FlightSegmentDetails segmentDetails = new FlightSegmentDetails();

                    segmentDetails.setFlightNumber(segment.getString("number"));
                    segmentDetails.setDepartureAirport(segment.getJSONObject("departure").getString("iataCode"));
                    segmentDetails.setArrivalAirport(segment.getJSONObject("arrival").getString("iataCode"));
                    segmentDetails.setDepartureTime(segment.getJSONObject("departure").getString("at"));
                    segmentDetails.setArrivalTime(segment.getJSONObject("arrival").getString("at"));
                    segmentDetails.setCarrierCode(segment.getString("carrierCode"));
                    segmentDetails.setOperatingCarrierCode(segment.optJSONObject("operating") != null
                            ? segment.getJSONObject("operating").getString("carrierCode")
                            : null);
                    JSONObject aircraft = segment.getJSONObject("aircraft");
                    segmentDetails.setAircraftCode(aircraft.getString("code"));
                    segmentDetails.setAircraftName(
                            dictionaries.getJSONObject("aircraft").getString(aircraft.getString("code")));

                    JSONObject fareDetails = travelerPricings.getJSONObject(0)
                            .getJSONArray("fareDetailsBySegment").getJSONObject(k);

                    segmentDetails.setCabin(fareDetails.getString("cabin"));
                    segmentDetails.setFareClass(fareDetails.getString("class"));
                    segmentDetails.setBrandedFare(fareDetails.optString("brandedFare", ""));
                    segmentDetails.setBrandedFareLabel(fareDetails.optString("brandedFareLabel", ""));

                    JSONObject cabinBags = fareDetails.optJSONObject("includedCabinBags");
                    JSONObject checkedBags = fareDetails.optJSONObject("includedCheckedBags");

                    segmentDetails.setIncludedCabinBags(
                            cabinBags != null ? cabinBags.optInt("quantity", 0) : 0);
                    segmentDetails.setIncludedCheckedBags(
                            checkedBags != null ? checkedBags.optInt("quantity", 0) : 0);

                    // Parse amenities
                    JSONArray amenitiesArray = fareDetails.optJSONArray("amenities");
                    if (amenitiesArray != null) {
                        for (int m = 0; m < amenitiesArray.length(); m++) {
                            JSONObject amenityJson = amenitiesArray.getJSONObject(m);
                            Amenity amenity = new Amenity();
                            amenity.setDescription(amenityJson.getString("description"));
                            amenity.setChargeable(amenityJson.getBoolean("isChargeable"));
                            segmentDetails.getAmenities().add(amenity);
                        }
                    }

                    Duration segmentDuration = Duration.parse(segment.getString("duration"));
                    totalDuration = totalDuration.plus(segmentDuration);

                    segmentDetailsList.add(segmentDetails);

                    if (k > 0) {
                        // Calculate layover time
                        LocalDateTime previousArrival = LocalDateTime.parse(
                                segments.getJSONObject(k - 1).getJSONObject("arrival").getString("at"),
                                DateTimeFormatter.ISO_DATE_TIME);
                        LocalDateTime currentDeparture = LocalDateTime.parse(
                                segment.getJSONObject("departure").getString("at"),
                                DateTimeFormatter.ISO_DATE_TIME);
                        Duration layoverDuration = Duration.between(previousArrival, currentDeparture);
                        details.addLayover(segment.getJSONObject("departure").getString("iataCode"), layoverDuration);
                    }
                }

                details.setSegments(segmentDetailsList);
                details.setBasePrice(price.getString("base"));
                JSONArray fees = price.getJSONArray("fees");
                for (int l = 0; l < fees.length(); l++) {
                    JSONObject fee = fees.getJSONObject(l);
                    details.addFee(fee.getString("type"), fee.getString("amount"));
                }
                details.setTotalDuration(totalDuration);
                flightDetailsList.add(details);
            }
        }

        if (!flightDetailsList.isEmpty()) {
            FlightDetails firstFlight = flightDetailsList.get(0);
            System.out.println("First Flight Details:");
            System.out.println("Total Price: " + firstFlight.getTotalPrice() + " " + firstFlight.getCurrency());
            System.out.println("Base Price: " + firstFlight.getBasePrice());
            System.out.println("Price Per Traveler: " + firstFlight.getPricePerTraveler());
            System.out.println("Total Duration: " + firstFlight.getTotalDuration());
            System.out.println("Fees:");
            firstFlight.getFees().forEach(fee -> 
                System.out.println("  " + fee.getType() + ": " + fee.getAmount())
            );
            System.out.println("Segments:");
            for (FlightSegmentDetails segment : firstFlight.getSegments()) {
                System.out.println("  Flight Number: " + segment.getFlightNumber());
                System.out.println("  Departure Airport: " + segment.getDepartureAirport());
                System.out.println("  Arrival Airport: " + segment.getArrivalAirport());
                System.out.println("  Departure Time: " + segment.getDepartureTime());
                System.out.println("  Arrival Time: " + segment.getArrivalTime());
                System.out.println("  Carrier Code: " + segment.getCarrierCode());
                System.out.println("  Operating Carrier Code: " + segment.getOperatingCarrierCode());
                System.out.println("  Aircraft: " + segment.getAircraftName() + " (" + segment.getAircraftCode() + ")");
                System.out.println("  Cabin: " + segment.getCabin());
                System.out.println("  Fare Class: " + segment.getFareClass());
                System.out.println("  Branded Fare: " + segment.getBrandedFare());
                System.out.println("  Included Cabin Bags: " + segment.getIncludedCabinBags());
                System.out.println("  Included Checked Bags: " + segment.getIncludedCheckedBags());
                System.out.println("  Amenities:");
                for (Amenity amenity : segment.getAmenities()) {
                    System.out.println("    - " + amenity.getDescription() + " (Chargeable: " + amenity.isChargeable() + ")");
                }
            }
            System.out.println("Layovers:");
            firstFlight.getLayovers().forEach(layover -> 
                System.out.println("  " + layover.getAirportCode() + ": " + layover.getDuration())
            );
        }

        return flightDetailsList;
    }
}
