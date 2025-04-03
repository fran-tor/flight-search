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
            <Box display="flex" flexDirection="column" minWidth="540px" flexWrap="wrap" gap={2}>
              <Box display="flex" flexDirection="column" textAlign="left">
                <Typography variant="subtitle1">
                  {formatTime(result.segments[0].departureTime)} - {formatTime(result.segments[result.segments.length - 1].arrivalTime)}
                </Typography>
                <Typography variant="body2">
                  {getAirportName(result.segments[0].departureAirport)} → {getAirportName(result.segments[result.segments.length - 1].arrivalAirport)}
                </Typography>
                <Typography variant="body2">
                  {formatTravelTime(result.totalDuration)} in total ({result.layovers.length > 0 ? `${result.layovers.length} stop${result.layovers.length > 1 ? 's' : ''}` : 'Nonstop'})
                </Typography>
                {result.layovers.length > 0 && (
                  <Typography variant="body2">
                    {result.layovers.map((layover, index) => (
                      <span key={index} style={{ display: 'block' }}>
                        {formatTravelTime(layover.duration)} layover in {getAirportName(layover.airportCode)}
                      </span>
                    ))}
                  </Typography>
                )}
              </Box>
              <Box flex="1 1 50%" display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Box display="flex" alignItems="left">
                    <Typography variant="body2" color="text.secondary">
                      {result.segments.length > 1 ? (
                        <span>
                          Airlines:
                        </span>
                      ) : (
                        <span>
                          Airline:
                        </span>
                      )}
                    </Typography>
                  </Box>
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
                </Box>
                <Box textAlign="right">
                  <Typography variant="h6">
                    {result.totalPrice} {result.currency} total
                  </Typography>
                  <Typography variant="body2">
                    {result.pricePerTraveler} {result.currency} per traveler
                  </Typography>
                </Box>
              </Box>
            </Box>
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