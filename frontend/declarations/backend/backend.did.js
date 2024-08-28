export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Address = IDL.Record({
    'balance' : IDL.Float64,
    'publicKey' : IDL.Text,
    'createdAt' : IDL.Nat,
  });
  const Transaction = IDL.Record({
    'id' : IDL.Text,
    'to' : IDL.Text,
    'fee' : IDL.Float64,
    'status' : IDL.Text,
    'from' : IDL.Text,
    'timestamp' : IDL.Int,
    'amount' : IDL.Float64,
  });
  return IDL.Service({
    'generateAddress' : IDL.Func([], [Result], []),
    'getAddresses' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, Address))],
        ['query'],
      ),
    'getTransactions' : IDL.Func([], [IDL.Vec(Transaction)], ['query']),
    'sendBitcoin' : IDL.Func([IDL.Text, IDL.Text, IDL.Float64], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
