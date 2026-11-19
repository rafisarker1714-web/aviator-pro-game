import { useState } from "react";
import "./wallet.scss";

const NUMBERS: any = {
  bKash: "01XXXXXXXXX",
  Nagad: "01XXXXXXXXX",
  Rocket: "01XXXXXXXXX",
};

export default function Wallet() {
  const [tab, setTab] = useState("deposit");
  const [method, setMethod] = useState("bKash");
  const [amount, setAmount] = useState("");
  const [trxId, setTrxId] = useState("");
  const [msg, setMsg] = useState("");

  const submit = () => {
    if (!amount || Number(amount) <= 0) return setMsg("Insufficient Balance");
    setMsg(tab === "deposit" ? "Deposit Request Sent" : "Withdraw Request Sent");
  };

  return (
    <div className="wallet-box">
      <h3>Wallet</h3>
      <p>Balance: ৳ 0.00</p>
      <div className="wallet-tabs">
        <button className={tab === "deposit" ? "active" : ""} onClick={() => setTab("deposit")}>Deposit</button>
        <button className={tab === "withdraw" ? "active" : ""} onClick={() => setTab("withdraw")}>Withdraw</button>
      </div>
      <div className="methods">
        {Object.keys(NUMBERS).map((m) => (
          <button key={m} className={method === m ? "active" : ""} onClick={() => setMethod(m)}>{m}</button>
        ))}
      </div>
      <p className="admin-num">Send to: {NUMBERS[method]} ({method})</p>
      <input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <input placeholder="TrxID / Your Number" value={trxId} onChange={(e) => setTrxId(e.target.value)} />
      <button className="submit-btn" onClick={submit}>{tab === "deposit" ? "Deposit Request" : "Withdraw Request"}</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
