import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, Button, Box, Card, CardContent, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.warning.main,
  color: theme.palette.warning.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.warning.dark,
  },
}));

const App: React.FC = () => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<[string, { publicKey: string; createdAt: bigint }][]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const result = await backend.getAddresses();
    setAddresses(result);
  };

  const handleGenerateAddress = async () => {
    setLoading(true);
    try {
      const result = await backend.generateAddress();
      if ('ok' in result) {
        setPublicKey(result.ok);
        await fetchAddresses();
      } else {
        console.error('Error generating address:', result.err);
      }
    } catch (error) {
      console.error('Error generating address:', error);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bitcoin Address Generator
        </Typography>
        <StyledButton
          variant="contained"
          onClick={handleGenerateAddress}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Generate New Address'}
        </StyledButton>
        {publicKey && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6">Newly Generated Public Key:</Typography>
              <Typography variant="body1">{publicKey}</Typography>
            </CardContent>
          </Card>
        )}
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Previously Generated Addresses
        </Typography>
        <List>
          {addresses.map(([address, data], index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`Address: ${address}`}
                secondary={`Public Key: ${data.publicKey}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default App;
