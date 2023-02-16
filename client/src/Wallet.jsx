import server from "./server";
import localWallets from "./localWallets";

function Wallet({ user, setUser, balance, setBalance }) {
  async function onChange(evt) {
    const selectedUser = evt.target.value;
    setUser(selectedUser);

    console.log(selectedUser);

    if (selectedUser) {
      const address = localWallets.getAddress(selectedUser);
      console.log(address);
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);

      console.log(balance);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <label>
        Wallet Address
        <select onChange={onChange} value={user}>
          <option value="">--- please choose a user ---</option>
          {localWallets.USERS.map((user, index) => (
            <option key={index} value={user}>
              {user}
            </option>
          ))}
        </select>
      </label>
      <div className="balance">Address: {localWallets.getAddress(user)}</div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
