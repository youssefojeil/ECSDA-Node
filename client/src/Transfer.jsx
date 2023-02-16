import { useState } from "react";
import server from "./server";
import localWallets from "./localWallets";

/**
 * Manage coin transfer.
 */
function Transfer({ user, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    // build the transaction payload composed of
    // the message itself (amount to transfer and recipient) and
    // the signature of the transaction build from the user private key
    // and the message, inside the localWallets.
    const message = {
      amount: parseInt(sendAmount),
      recipient,
    };
    const signature = await localWallets.sign(user, message);
    const transaction = {
      message,
      signature,
    };

    try {
      const {
        data: { balance },
      } = await server.post(`send`, transaction);

      setBalance(balance);
      alert(`Sent ${message.amount} to ${message.recipient} from ${user}`);
    } catch (err) {
      alert(err);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type a user address, for example: BE13..."
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
