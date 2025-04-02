package com.example.flight_search.models;

import java.util.ArrayList;
import java.util.List;

public class FlightSegmentDetails {

    private String departureAirport;
    private String arrivalAirport;
    private String departureTime;
    private String arrivalTime;
    private String carrierCode;
    private String operatingCarrierCode;
    private String flightNumber;
    private String aircraftCode;
    private String aircraftName;
    private String cabin;
    private String fareClass;
    private List<Amenity> amenities = new ArrayList<>();
    private String brandedFare;
    private String brandedFareLabel;
    private int includedCabinBags;
    private int includedCheckedBags;

    public String getDepartureAirport() {
        return departureAirport;
    }

    public void setDepartureAirport(String departureAirport) {
        this.departureAirport = departureAirport;
    }

    public String getArrivalAirport() {
        return arrivalAirport;
    }

    public void setArrivalAirport(String arrivalAirport) {
        this.arrivalAirport = arrivalAirport;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public String getCarrierCode() {
        return carrierCode;
    }

    public void setCarrierCode(String carrierCode) {
        this.carrierCode = carrierCode;
    }

    public String getOperatingCarrierCode() {
        return operatingCarrierCode;
    }

    public void setOperatingCarrierCode(String operatingCarrierCode) {
        this.operatingCarrierCode = operatingCarrierCode;
    }

    @Override
    public String toString() {
        return "FlightSegmentDetails{" +
                "departureAirport='" + departureAirport + '\'' +
                ", arrivalAirport='" + arrivalAirport + '\'' +
                ", departureTime='" + departureTime + '\'' +
                ", arrivalTime='" + arrivalTime + '\'' +
                ", carrierCode='" + carrierCode + '\'' +
                ", operatingCarrierCode='" + operatingCarrierCode + '\'' +
                '}';
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public String getAircraftCode() {
        return aircraftCode;
    }

    public void setAircraftCode(String aircraftCode) {
        this.aircraftCode = aircraftCode;
    }

    public String getAircraftName() {
        return aircraftName;
    }

    public void setAircraftName(String aircraftName) {
        this.aircraftName = aircraftName;
    }

    public String getCabin() {
        return cabin;
    }

    public void setCabin(String cabin) {
        this.cabin = cabin;
    }

    public String getFareClass() {
        return fareClass;
    }

    public void setFareClass(String fareClass) {
        this.fareClass = fareClass;
    }

    public List<Amenity> getAmenities() {
        return amenities;
    }

    public void setAmenities(List<Amenity> amenities) {
        this.amenities = amenities;
    }

    public String getBrandedFare() {
        return brandedFare;
    }

    public void setBrandedFare(String brandedFare) {
        this.brandedFare = brandedFare;
    }

    public String getBrandedFareLabel() {
        return brandedFareLabel;
    }

    public void setBrandedFareLabel(String brandedFareLabel) {
        this.brandedFareLabel = brandedFareLabel;
    }

    public int getIncludedCabinBags() {
        return includedCabinBags;
    }

    public void setIncludedCabinBags(int includedCabinBags) {
        this.includedCabinBags = includedCabinBags;
    }

    public int getIncludedCheckedBags() {
        return includedCheckedBags;
    }

    public void setIncludedCheckedBags(int includedCheckedBags) {
        this.includedCheckedBags = includedCheckedBags;
    }
}
