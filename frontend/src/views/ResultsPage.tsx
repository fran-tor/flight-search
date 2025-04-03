import { useLocation, useNavigate } from 'react-router-dom';
import { getAirlineName, getAirportName, formatTime, formatTravelTime } from '../utils/formatters';
import {
  Container, Typography, Paper, Button, Box, FormControl, InputLabel, Select, MenuItem, Divider,
  Chip,
  Pagination,
  Stack
} from '@mui/material';
import { useState } from 'react';

interface Layover {
  duration: string;
  airportCode: string;
}

interface Segment {
  departureTime: string;
  arrivalTime: string;
  departureAirport: string;
  arrivalAirport: string;
  carrierCode: string;
  operatingCarrierCode?: string;
}

interface FlightResult {
  segments: Segment[];
  layovers: Layover[];
  totalDuration: string;
  totalPrice: string;
  currency: string;
  pricePerTraveler: string;
}

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('price');
  const [results, setResults] = useState<FlightResult[]>(location.state?.data || []);
  const [isRoundTrip] = useState(location.state?.roundTrip || false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const handleReturnToSearch = () => {
    navigate('/');
  };

  const handleFlightClick = (result: FlightResult) => {
    navigate('/flight-details', { state: { flightDetails: result } });
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedResults = results.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const formatDuration = (duration: string): string => {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
    const match = duration.match(regex);
    if (match) {
      const hours = match[1] || '0';
      const minutes = match[2] || '0';
      return `${hours !== '0' ? `${hours}h ` : ''}${minutes !== '0' ? `${minutes}m` : ''}`.trim();
    }
    return duration;
  };

  const handleSort = (criteria: string) => {
    setSortBy(criteria);
    const sortedResults = [...results].sort((a, b) => {
      if (criteria === 'price') {
        return parseFloat(a.totalPrice) - parseFloat(b.totalPrice);
      } else {
        console.log('Sorting by duration');
        const parseDurationToMinutes = (duration: string) => {
          const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
          const match = duration.match(regex);
          if (match) {
            const hours = parseInt(match[1] || '0', 10);
            const minutes = parseInt(match[2] || '0', 10);
            return hours * 60 + minutes;
          }
          console.error('Invalid duration format:', duration);
          return NaN;
        };
        console.log('Duration A in minutes:', parseDurationToMinutes(a.totalDuration));
        console.log('Duration B in minutes:', parseDurationToMinutes(b.totalDuration));
        return parseDurationToMinutes(a.totalDuration) - parseDurationToMinutes(b.totalDuration);
      }
    });
    setResults(sortedResults);
    console.log('Sorted results:', sortedResults.map((result) => ({
      totalPrice: result.totalPrice,
      totalDuration: result.totalDuration,
    })));
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

      {paginatedResults.map((result: FlightResult, index: number) => (
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
                    {result.layovers.map((layover: Layover, index: number) => (
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
                      {result.segments.length > 1 ? 'Airlines:' : 'Airline:'}
                    </Typography>
                  </Box>
                  {result.segments.map((segment: Segment, idx: number) => (
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

      {results.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2, marginBottom: 2 }}>
          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(results.length / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
            />
          </Stack>
        </Box>
      )}

      {results.length === 0 && (
        <Typography variant="body1" align="center" sx={{ mt: 4 }}>
          No flights found matching your criteria.
        </Typography>
      )}
    </Container>
  );
};

export default ResultsPage;