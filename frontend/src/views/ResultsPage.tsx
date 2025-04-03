import { useLocation, useNavigate } from 'react-router-dom';
import { getAirlineName, getAirportName, formatTime, formatTravelTime } from '../utils/formatters';
import {
  Container, Typography, Paper, Button, Box, FormControl, InputLabel, Select, MenuItem, Grid, Divider,
  Chip
} from '@mui/material';
import { useState } from 'react';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('price'); // 'price' or 'duration'
  const [results, setResults] = useState(location.state?.data || []);
  const [isRoundTrip] = useState(location.state?.roundTrip || false);

  const handleReturnToSearch = () => {
    navigate('/');
  };

  const handleFlightClick = (result: any) => {
    navigate('/flight-details', { state: { flightDetails: result } });
  };

  const handleSort = (criteria: string) => {
    setSortBy(criteria);
    const sortedResults = [...results].sort((a, b) => {
      if (criteria === 'price') {
        return parseFloat(a.totalPrice) - parseFloat(b.totalPrice);
      } else {
        return a.totalDuration.localeCompare(b.totalDuration);
      }
    });
    setResults(sortedResults);
  };

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
        <Button
          variant="outlined"
          onClick={handleReturnToSearch}
          sx={{ width: '200px' }}
        >
          Return to Search
        </Button>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            label="Sort by"
            onChange={(e) => handleSort(e.target.value)}
          >
            <MenuItem value="price">Price (lowest first)</MenuItem>
            <MenuItem value="duration">Duration (shortest first)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {results.map((result: any, index: number) => (
        <Box key={index} >
          {isRoundTrip && (index) % 2 === 0 && (
            <Divider sx={{ my: 2 }} >
              <Chip label="Round trip" size="small" />
            </Divider>
          )}
          <Paper
            key={index}
            elevation={3}
            sx={{ p: 3, mb: 2, cursor: 'pointer' }}
            onClick={() => handleFlightClick(result)}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  {formatTime(result.segments[0].departureTime)} - {formatTime(result.segments[result.segments.length - 1].arrivalTime)}
                </Typography>
                <Typography variant="body2">
                  {getAirportName(result.segments[0].departureAirport)} → {getAirportName(result.segments[result.segments.length - 1].arrivalAirport)}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2">
                    {formatTravelTime(result.totalDuration)} total travel time
                    {result.layovers.length > 0 ? ` (${result.layovers.length} stop${result.layovers.length > 1 ? 's' : ''})` : ' (Nonstop)'}
                  </Typography>

                  {result.segments.map((segment: any, idx: number) => (
                    <Box key={idx} sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {getAirlineName(segment.carrierCode)}
                        {segment.operatingCarrierCode && segment.operatingCarrierCode !== segment.carrierCode && (
                          <> (Operated by {getAirlineName(segment.operatingCarrierCode)})</>
                        )}
                      </Typography>
                    </Box>
                  ))}

                  {result.layovers.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {result.layovers.map((layover: any, idx: number) => (
                        <Typography key={idx} variant="body2" color="text.secondary">
                          {formatTravelTime(layover.duration)} layover in {getAirportName(layover.airportCode)}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box display="flex" flexDirection="column" alignItems="flex-end">
                  <Typography variant="h6">
                    {result.totalPrice} {result.currency}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {result.pricePerTraveler} {result.currency} per traveler
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      ))}

      {results.length === 0 && (
        <Typography variant="body1" align="center" sx={{ mt: 4 }}>
          No flights found matching your criteria.
        </Typography>
      )}
    </Container>
  );
};

export default ResultsPage;