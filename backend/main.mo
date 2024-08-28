import Iter "mo:base/Iter";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Blob "mo:base/Blob";
import Float "mo:base/Float";

actor {
  // Types
  type Address = {
    publicKey: Text;
    createdAt: Nat;
    balance: Float;
  };

  type Transaction = {
    from: Text;
    to: Text;
    amount: Float;
    fee: Float;
    status: Text;
  };

  // Stable variables
  stable var addressEntries : [(Text, Address)] = [];
  stable var transactionEntries : [Transaction] = [];

  // Mutable state
  var addressCounter : Nat = 0;
  var addresses : HashMap.HashMap<Text, Address> = HashMap.fromIter(addressEntries.vals(), 0, Text.equal, Text.hash);
  var transactions : [Transaction] = [];

  // Helper function to generate a simulated Bitcoin address and public key
  func generateSimulatedAddress() : (Text, Text) {
    let addressId = Nat.toText(addressCounter);
    let simulatedAddress = "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2" # addressId;
    let simulatedPublicKey = "04678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f" # addressId;
    (simulatedAddress, simulatedPublicKey)
  };

  // Generate a new Bitcoin address
  public func generateAddress() : async Result.Result<Text, Text> {
    let (address, publicKey) = generateSimulatedAddress();
    let newAddress : Address = {
      publicKey = publicKey;
      createdAt = addressCounter;
      balance = 1.0; // Start with 1 BTC for simulation
    };
    addresses.put(address, newAddress);
    addressCounter += 1;
    #ok(publicKey)
  };

  // Get all generated addresses
  public query func getAddresses() : async [(Text, Address)] {
    Iter.toArray(addresses.entries())
  };

  // Send Bitcoin
  public func sendBitcoin(from: Text, to: Text, amount: Float) : async Result.Result<Text, Text> {
    switch (addresses.get(from)) {
      case (null) { #err("Sender address not found") };
      case (?senderAddress) {
        if (senderAddress.balance < amount) {
          #err("Insufficient balance")
        } else {
          let fee = 0.0001; // Low fee for simulation
          let newTransaction : Transaction = {
            from = from;
            to = to;
            amount = amount;
            fee = fee;
            status = "Pending";
          };
          transactions := Array.append(transactions, [newTransaction]);
          
          // Update sender's balance
          let updatedSenderAddress : Address = {
            publicKey = senderAddress.publicKey;
            createdAt = senderAddress.createdAt;
            balance = senderAddress.balance - amount - fee;
          };
          addresses.put(from, updatedSenderAddress);
          
          #ok("Transaction submitted to mempool")
        }
      };
    }
  };

  // Get all transactions
  public query func getTransactions() : async [Transaction] {
    transactions
  };

  // System functions for upgrades
  system func preupgrade() {
    addressEntries := Iter.toArray(addresses.entries());
    transactionEntries := transactions;
  };

  system func postupgrade() {
    addresses := HashMap.fromIter(addressEntries.vals(), 0, Text.equal, Text.hash);
    transactions := transactionEntries;
    addressEntries := [];
    transactionEntries := [];
  };
}
