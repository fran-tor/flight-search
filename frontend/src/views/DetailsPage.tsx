import { useLocation, useNavigate } from 'react-router-dom';
import { getAirlineName, getAirportName, formatTime, formartDateTime, formatTravelTime } from '../utils/formatters';
import {
  Container, Typography, Paper, Button, Box, Grid, Divider, List, ListItem, 
  ListItemText, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';

const DetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flightDetails = location.state?.flightDetails;

  const handleBack = () => {
    navigate(-1);
  };
  
  if (!flightDetails) {
    return <Typography>No flight details available</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="left">
          <Button
            variant="outlined"
            onClick={handleBack}
            style={{ marginTop: '20px', marginBottom: '20px', width: '200px' }}
          >
            Return to Results
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Flight Details
              </Typography>
              <Typography variant="subtitle1">
                {getAirportName(flightDetails.segments[0].departureAirport)} →{' '}
                {getAirportName(flightDetails.segments[flightDetails.segments.length - 1].arrivalAirport)}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Duration: {formatTravelTime(flightDetails.totalDuration)}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {flightDetails.segments.map((segment: any, index: number) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Segment {index + 1}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        Flight {segment.flightNumber}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        Aircraft: {segment.aircraftName} ({segment.aircraftCode})
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Departure</Typography>
                      <Typography>{formartDateTime(segment.departureTime)} {formatTime(segment.departureTime)}</Typography>
                      <Typography>{getAirportName(segment.departureAirport)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Arrival</Typography>
                      <Typography>{formartDateTime(segment.arrivalTime)} {formatTime(segment.arrivalTime)}</Typography>
                      <Typography>{getAirportName(segment.arrivalAirport)}</Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Operated by</Typography>
                    <Typography>
                      {getAirlineName(segment.carrierCode)}
                      {segment.operatingCarrierCode && segment.operatingCarrierCode !== segment.carrierCode && (
                        <Typography component="span" color="text.secondary">
                          {' '}(Operated by {getAirlineName(segment.operatingCarrierCode)})
                        </Typography>
                      )}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Travel Class</Typography>
                    <Typography>
                      {segment.cabin} (Class {segment.fareClass})
                    </Typography>
                    {segment.brandedFare && (
                      <Typography variant="body2" color="text.secondary">
                        {segment.brandedFareLabel || segment.brandedFare}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Amenities</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {segment.amenities.map((amenity: any, idx: number) => (
                        <Chip
                          key={idx}
                          label={amenity.description}
                          color={amenity.isChargeable ? "default" : "primary"}
                          variant={amenity.isChargeable ? "outlined" : "filled"}
                        />
                      ))}
                    </Box>
                  </Box>

                  {index < flightDetails.segments.length - 1 && flightDetails.layovers[index] && (
                    <Box sx={{ mt: 2, bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Layover in {getAirportName(flightDetails.layovers[index].airportCode)}
                      </Typography>
                      <Typography color="text.secondary">
                        Duration: {formatTravelTime(flightDetails.layovers[index].duration)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Paper>

            {flightDetails.returnFlight && (
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Return Flight Details
                </Typography>
                {/* Similar structure as above for return flight */}
              </Paper>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Price Details
              </Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Base Price</TableCell>
                      <TableCell align="right">{flightDetails.basePrice} {flightDetails.currency}</TableCell>
                    </TableRow>
                    {flightDetails.fees.map((fee: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{fee.type}</TableCell>
                        <TableCell align="right">{fee.amount} {flightDetails.currency}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell>Price per Traveler</TableCell>
                      <TableCell align="right">{flightDetails.pricePerTraveler} {flightDetails.currency}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Total Price</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        {flightDetails.totalPrice} {flightDetails.currency}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DetailsPage;