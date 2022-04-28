import { AccountContext } from "../components/templates/ContextProvider";
import { useState, useEffect, useContext } from "react";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/router";
import widget from "../styles/modules/Widget.module.css";
import Link from "next/link";
import Image from "next/image";
import Profile from "../components/api/profile/Profile";

export async function getStaticProps(context) {
  return {
    props: {
      protected: false,
      title: "Login",
      description: "All users login here to be able to post.",
    },
  };
}

export default function Login() {
  const router = useRouter();
  const accountServices = useContext(AccountContext);
  const [isLoggedIn, setIsLoggedIn] = useState(accountServices.isLoggedIn);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailPrompt, setEmailPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordPrompt, setPasswordPrompt] = useState(false);
  const [error, setError] = useState({});

  if (isLoggedIn) {
    const returnUrl = router.query.return_url || "/";
    router.push(returnUrl);
  }

  const handleLogin = (e) => {
    accountServices
      .login(email, password)
      .then(() => {
        if (accountServices.isLoggedIn) {
          setIsLoggedIn(accountServices.isLoggedIn);
        } else {
          setError({ message: "Unexpected Error: Please Try Again Later" });
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
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
            error={emailPrompt}
            helperText={emailPrompt && "Email or username must be included"}
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
            error={passwordPrompt}
            helperText={passwordPrompt && "Password must be included"}
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
          <LoadingButton
            variant="contained"
            sx={{
              borderRadius: "5px",
              borderColor: "transparent",
              width: "222.8px",
            }}
            onClick={(e) => {
              setLoading(true);
              setEmailPrompt(false);
              setPasswordPrompt(false);

              if (!email) {
                setEmailPrompt(true);
              }
              if (!password) {
                setPasswordPrompt(true);
              }

              if (!password || !email) {
                setLoading(false);
                return;
              }

              handleLogin(e);
            }}
            disableElevation
            loading={loading}
          >
            Login
          </LoadingButton>
        </div>
        {error.message && (
          <div className="mt-3 ">
            <small style={{ color: "#c0392b" }}>
              {error.message.toLowerCase()}
            </small>
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
