import {
  AccountContext,
  AlertContext,
} from "../components/templates/ContextProvider";
import { useState, useEffect, useContext } from "react";
import { TextField, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import widget from "../styles/modules/Widget.module.css";
import Link from "next/link";
import Image from "next/image";
import Profile from "../components/api/profile/Profile";
import { LoadingButton } from "@mui/lab";

export async function getStaticProps(context) {
  return {
    props: {
      protected: false,
      title: "Sign Up",
      description:
        "Sign up today so that you can start creating posts for all to view.",
    },
  };
}

export default function Registration() {
  const router = useRouter();
  const accountServices = useContext(AccountContext);
  const alertServices = useContext(AlertContext);
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [loading, setLoading] = useState(false);
  const [successfulRegistration, setSuccessfulRegistration] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  if (isLoggedIn) {
    const returnUrl = router.query.return_url || "/";
    router.push(returnUrl);
  }

  if (successfulRegistration) {
    router.push("/login");
  }

  const handleLogin = async (e) => {
    if (!email) {
      setError("Email is required");
      setLoading(false);
    }

    if (password === confirmPassword) {
      try {
        const response = await accountServices.register(email, password);

        // Set that registration was successful

        setSuccessfulRegistration(true);
        alertServices.setAlertInfo({
          severity: "success",
          title: "Registered",
          content: response.message,
        });
        alertServices.setAlert(true);

        setLoading(false);
      } catch (error) {
        alertServices.setAlertInfo({
          severity: "error",
          title: "Issue Registering",
          content: typeof error == "object" ? error.message : error,
        });
        alertServices.setAlert(true);
        setLoading(false);
      }
    } else {
      setError("Passwords must match");
      setLoading(false);
    }
  };

  return (
    <div className={widget.primary}>
      <div className="text-center">
        <div>
          <Image src="/logo192.png" alt="Syncviz Logo" width={90} height={90} />
        </div>
        <div className="mt-3">
          <TextField
            id="email-input"
            size="small"
            label="Email"
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
        <div className="mt-3">
          <TextField
            id="confirm-password-input"
            size="small"
            label="Confirm Password"
            variant="outlined"
            value={confirmPassword}
            type="password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
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
              handleLogin(e);
            }}
            disableElevation
            loading={loading}
          >
            Sign Up
          </LoadingButton>
        </div>
        {error && (
          <div className="mt-3 ">
            <small style={{ color: "#c0392b" }}>{error}</small>
          </div>
        )}
        <div className="mt-3 mb-4">
          <small>
            Already have an account? <Link href="/login">Login</Link>
          </small>
        </div>
      </div>
    </div>
  );
}
