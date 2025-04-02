package com.example.flight_search.models;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

public class FlightDetails {
    private String totalPrice;
    private String currency;
    private String pricePerTraveler;
    private String basePrice;
    private List<Fee> fees = new ArrayList<>();
    private boolean isRoundTrip;
    private FlightDetails returnFlight;
    private List<FlightSegmentDetails> segments = new ArrayList<>();
    private Duration totalDuration;
    private List<Layover> layovers = new ArrayList<>();

    public static class Fee {
        private String type;
        private String amount;

        public Fee(String type, String amount) {
            this.type = type;
            this.amount = amount;
        }

        // Getters and setters
        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getAmount() {
            return amount;
        }

        public void setAmount(String amount) {
            this.amount = amount;
        }
    }

    public void addLayover(String airportCode, Duration duration) {
        Layover layover = new Layover(airportCode, duration);
        this.layovers.add(layover);
    }

    public String getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(String totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getPricePerTraveler() {
        return pricePerTraveler;
    }

    public void setPricePerTraveler(String pricePerTraveler) {
        this.pricePerTraveler = pricePerTraveler;
    }

    public List<FlightSegmentDetails> getSegments() {
        return segments;
    }

    public void setSegments(List<FlightSegmentDetails> segments) {
        this.segments = segments;
    }

    public Duration getTotalDuration() {
        return totalDuration;
    }

    public void setTotalDuration(Duration totalDuration) {
        this.totalDuration = totalDuration;
    }

    public List<Layover> getLayovers() {
        return layovers;
    }

    public void setLayovers(List<Layover> layovers) {
        this.layovers = layovers;
    }

    public String getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(String basePrice) {
        this.basePrice = basePrice;
    }

    public List<Fee> getFees() {
        return fees;
    }

    public void setFees(List<Fee> fees) {
        this.fees = fees;
    }

    public boolean isRoundTrip() {
        return isRoundTrip;
    }

    public void setRoundTrip(boolean roundTrip) {
        isRoundTrip = roundTrip;
    }

    public FlightDetails getReturnFlight() {
        return returnFlight;
    }

    public void setReturnFlight(FlightDetails returnFlight) {
        this.returnFlight = returnFlight;
    }

    public void addFee(String type, String amount) {
        this.fees.add(new Fee(type, amount));
    }

    @Override
    public String toString() {
        return "FlightDetails{" +
                "totalPrice='" + totalPrice + '\'' +
                ", currency='" + currency + '\'' +
                ", pricePerTraveler='" + pricePerTraveler + '\'' +
                ", basePrice='" + basePrice + '\'' +
                ", fees=" + fees +
                ", isRoundTrip=" + isRoundTrip +
                ", returnFlight=" + (returnFlight != null ? returnFlight.toString() : "null") +
                ", segments=" + segments +
                ", totalDuration=" + totalDuration +
                ", layovers=" + layovers +
                '}';
    }
}
