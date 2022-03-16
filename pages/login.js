import { AccountContext } from "../components/templates/ContextProvider";
import { useState, useEffect, useContext } from "react";
import { TextField, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import widget from "../styles/modules/Widget.module.css";
import Link from "next/link";
import Image from "next/image";

export async function getStaticProps(context) {
  return {
    props: {
      protected: false,
    },
  };
}

export default function Login() {
  const router = useRouter();
  const accountServices = useContext(AccountContext);
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isLoggedIn) {
    const returnUrl = router.query.return_url || "/";
    router.push(returnUrl);
  }

  const handleLogin = (e) => {
    accountServices.login(email, password).then(() => {
      if (accountServices.isLoggedIn) setIsLoggedIn(accountServices.isLoggedIn);
      else setError("Email or password is incorrect");

      setLoading(false);
    });
  };

  return (
    <div className={widget.primary}>
      <div className="text-center">
        <div>
          <Image src="/logo192.png" alt="Syncviz Logo" width={90} height={90} />
        </div>
        <div className="mt-3">
          <TextField
            id="email-or-username-input"
            size="small"
            label="Email / Username"
            variant="outlined"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="mt-3">
          <TextField
            id="password-input"
            size="small"
            label="Password"
            variant="outlined"
            value={password}
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="mt-2">
          <small>
            <Link href="/forgot-password">Forgotten Password?</Link>
          </small>
        </div>
        <div className="mt-3">
          <Button
            variant="contained"
            sx={{
              borderRadius: "5px",
              borderColor: "transparent",
              width: "222.8px",
            }}
            onClick={(e) => {
              setLoading(true);
              handleLogin(e);
            }}
            disableElevation
          >
            {loading ? <CircularProgress color="inherit" /> : <>Log in</>}
          </Button>
        </div>
        {error && (
          <div className="mt-3 ">
            <small style={{ color: "#c0392b" }}>{error}</small>
          </div>
        )}
        <div className="mt-3 mb-4">
          <small>
            Don't have an account? <Link href="/register">Sign Up</Link>
          </small>
        </div>
      </div>
    </div>
  );
}
