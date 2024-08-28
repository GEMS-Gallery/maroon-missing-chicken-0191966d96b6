import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, Button, Box, Card, CardContent, List, ListItem, ListItemText, CircularProgress, TextField, Grid, Link } from '@mui/material';
import { styled } from '@mui/system';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.warning.main,
  color: theme.palette.warning.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.warning.dark,
  },
}));

type Address = {
  publicKey: string;
  createdAt: bigint;
  balance: number;
};

type Transaction = {
  id: string;
  from: string;
  to: string;
  amount: number;
  fee: number;
  status: string;
  timestamp: bigint;
};

const App: React.FC = () => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<[string, Address][]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendFrom, setSendFrom] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [lastTxId, setLastTxId] = useState<string | null>(null);

  useEffect(() => {
    fetchAddresses();
    fetchTransactions();
  }, []);

  const fetchAddresses = async () => {
    const result = await backend.getAddresses();
    setAddresses(result);
  };

  const fetchTransactions = async () => {
    const result = await backend.getTransactions();
    setTransactions(result);
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

  const handleSendBitcoin = async () => {
    setLoading(true);
    try {
      const result = await backend.sendBitcoin(sendFrom, sendTo, parseFloat(sendAmount));
      if ('ok' in result) {
        setLastTxId(result.ok);
        alert('Transaction submitted successfully!');
        await fetchAddresses();
        await fetchTransactions();
      } else {
        alert('Error sending Bitcoin: ' + result.err);
      }
    } catch (error) {
      console.error('Error sending Bitcoin:', error);
      alert('Error sending Bitcoin. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bitcoin Address Generator and Sender
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
          Send Bitcoin
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="From Address"
              value={sendFrom}
              onChange={(e) => setSendFrom(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="To Address"
              value={sendTo}
              onChange={(e) => setSendTo(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendBitcoin}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          Send Bitcoin
        </Button>
        {lastTxId && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Transaction submitted. View on mempool.space:{' '}
            <Link href={`https://mempool.space/tx/${lastTxId}`} target="_blank" rel="noopener noreferrer">
              {lastTxId}
            </Link>
          </Typography>
        )}
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Your Addresses
        </Typography>
        <List>
          {addresses.map(([address, data], index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`Address: ${address}`}
                secondary={`Public Key: ${data.publicKey} | Balance: ${data.balance} BTC`}
              />
            </ListItem>
          ))}
        </List>
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Transactions
        </Typography>
        <List>
          {transactions.map((tx, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={
                  <>
                    From: {tx.from} To: {tx.to}
                    {' '}
                    <Link href={`https://mempool.space/tx/${tx.id}`} target="_blank" rel="noopener noreferrer">
                      View on mempool.space
                    </Link>
                  </>
                }
                secondary={`Amount: ${tx.amount} BTC | Fee: ${tx.fee} BTC | Status: ${tx.status}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default App;
