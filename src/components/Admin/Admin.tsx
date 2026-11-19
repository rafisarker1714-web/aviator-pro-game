import { useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { db } from "../../firebase";
import "./admin.scss";

export default function Admin() {
  const [tab, setTab] = useState("deposit");
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdraws, setWithdraws] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    onValue(ref(db, "deposits"), (s) => {
      const v = s.val() || {};
      setDeposits(Object.entries(v).map(([id, d]: any) => ({ id, ...d })));
    });
    onValue(ref(db, "withdraws"), (s) => {
      const v = s.val() || {};
      setWithdraws(Object.entries(v).map(([id, d]: any) => ({ id, ...d })));
    });
    onValue(ref(db, "users"), (s) => {
      const v = s.val() || {};
      setUsers(Object.entries(v).map(([id, d]: any) => ({ id, ...d })));
    });
  }, []);

  const handle = async (type: string, id: string, status: string, userId: string, amount: number) => {
    await update(ref(db, `${type}/${id}`), { status });
    if (type === "deposits" && status === "approved") {
      const userRef = ref(db, `users/${userId}`);
      // balance add hobe Wallet theke, ekhane sudhu status update
    }
    alert(`${status} hoye gese!`);
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>👑 Admin Panel</h2>
        <p>Aviator Pro - Control Room</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card"><span>👥 Users</span><b>{users.length}</b></div>
        <div className="stat-card"><span>💰 Deposit Req</span><b>{deposits.filter(d=>d.status==="pending").length}</b></div>
        <div className="stat-card"><span>🏧 Withdraw Req</span><b>{withdraws.filter(d=>d.status==="pending").length}</b></div>
      </div>

      <div className="admin-tabs">
        <button className={tab==="deposit"?"active":""} onClick={()=>setTab("deposit")}>Deposit</button>
        <button className={tab==="withdraw"?"active":""} onClick={()=>setTab("withdraw")}>Withdraw</button>
        <button className={tab==="users"?"active":""} onClick={()=>setTab("users")}>Users</button>
      </div>

      <div className="admin-list">
        {tab==="deposit" && deposits.map(d=>(
          <div key={d.id} className="req-card">
            <div><b>{d.userName || d.userId}</b><small>{d.method} - {d.trxId}</small></div>
            <b className="amt">৳{d.amount}</b>
            <span className={`status ${d.status}`}>{d.status}</span>
            {d.status==="pending" && <div className="actions">
              <button className="approve" onClick={()=>handle("deposits", d.id, "approved", d.userId, d.amount)}>Approve</button>
              <button className="reject" onClick={()=>handle("deposits", d.id, "rejected", d.userId, d.amount)}>Reject</button>
            </div>}
          </div>
        ))}
        {tab==="withdraw" && withdraws.map(d=>(
          <div key={d.id} className="req-card">
            <div><b>{d.userName || d.userId}</b><small>{d.method} - {d.number}</small></div>
            <b className="amt">৳{d.amount}</b>
            <span className={`status ${d.status}`}>{d.status}</span>
            {d.status==="pending" && <div className="actions">
              <button className="approve" onClick={()=>handle("withdraws", d.id, "approved", d.userId, d.amount)}>Approve</button>
              <button className="reject" onClick={()=>handle("withdraws", d.id, "rejected", d.userId, d.amount)}>Reject</button>
            </div>}
          </div>
        ))}
        {tab==="users" && users.map(u=>(
          <div key={u.id} className="req-card">
            <div><b>{u.name || u.email}</b><small>ID: {u.id}</small></div>
            <b className="amt">৳{u.balance || 0}</b>
          </div>
        ))}
        {tab==="deposit" && deposits.length===0 && <p className="empty">Kono deposit request nai. Firebase e data asle ekhane dekhabe.</p>}
      </div>
    </div>
  );
}
