import { AccountContext } from "../components/templates/ContextProvider";
import { useState, useEffect, useContext } from "react";
import { TextField, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import widget from "../styles/modules/Widget.module.css";
import Link from "next/link";
import Image from "next/image";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";

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
  const { enqueueSnackbar } = useSnackbar();
  const accountServices = useContext(AccountContext);
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [loading, setLoading] = useState(false);
  const [successfulRegistration, setSuccessfulRegistration] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({ fields: [""], messages: "" });

  if (isLoggedIn) {
    const returnUrl = router.query.return_url || "/";
    router.push(returnUrl);
  }

  if (successfulRegistration) {
    router.push("/login");
  }

  const handleLogin = async (e) => {
    setError({ fields: [""], messages: "" });

    if (!email) {
      setError({ messages: "email is required", fields: ["email"] });
      setLoading(false);
      return;
    }

    if (password === confirmPassword && password) {
      try {
        const response = await accountServices
          .register(email, password)
          .then((response) => {
            console.log(response);
            setSuccessfulRegistration(true);
            enqueueSnackbar("Registered", {
              variant: "success",
              anchorOrigin: { horizontal: "left", vertical: "top" },
            });
          })
          .catch((err) => {
            // Check if message is an array, if so grab first element, if not

            setError({
              messages: Array.isArray(err.messages)
                ? err.messages[0]
                : err.messages ||
                  err.message ||
                  "Unexpected Error, Try again later.",
              fields: err.fields || [],
            });
          });
      } catch (err) {
        setError({
          messages: Array.isArray(error.messages)
            ? err.messages[0]
            : err.messages || "Unexpected Error",
          fields: err.fields || [],
        });
      }
    } else {
      setError({
        messages: "passwords must match",
        fields: ["password", "confirm-password"],
      });
      setLoading(false);
    }

    setLoading(false);
  };

  return (
    <div className={widget.primary}>
      <div className="text-center">
        <div className="mt-2">
          <Image
            src="/dripplie-banner-center(blue).svg"
            height={110}
            width={110}
          />
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
            error={error.fields.includes("email")}
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
            error={error.fields.includes("password")}
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
            error={error.fields.includes("confirm-password")}
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
        {error.messages && (
          <div className="mt-3 ">
            <small style={{ color: "#c0392b" }}>
              {error.messages.toLowerCase()}
            </small>
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
