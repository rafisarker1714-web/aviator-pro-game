import { useState } from "react";
import "./auth.scss";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [msg, setMsg] = useState("");

  const handleSubmit = () => {
    setMsg(isLogin ? "Login Successful" : "Account Created");
  };

  return (
    <div className="auth-box">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      {!isLogin && <input placeholder="Full Name" />}
      <input placeholder="Email" />
      <input placeholder="Password" type="password" />
      <button onClick={handleSubmit}>{isLogin ? "Login" : "Register"}</button>
      {msg && <p className="auth-msg">{msg}</p>}
      <p className="auth-switch" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "No account? Register" : "Have account? Login"}
      </p>
    </div>
  );
}
