export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Address = IDL.Record({ 'publicKey' : IDL.Text, 'createdAt' : IDL.Nat });
  return IDL.Service({
    'generateAddress' : IDL.Func([], [Result], []),
    'getAddresses' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, Address))],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
