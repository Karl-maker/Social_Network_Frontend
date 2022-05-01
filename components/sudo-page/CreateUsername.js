import { AccountContext } from "../templates/ContextProvider";
import { useContext, useState } from "react";
import { TextField, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import widget from "../../styles/modules/Widget.module.css";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";

export default function CreateUsername() {
  const accountServices = useContext(AccountContext);
  const [loading, setLoading] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState({ message: "" });
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <div className={widget.primary}>
      <div className="col-12 text-center p-4">
        <h3 className="display-5 mb-3">Create A Username</h3>
        <p className="text-muted">
          Create a username so that everyone can identify you
        </p>
        <TextField
          id="username-input"
          size="small"
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        {error.message && (
          <div className="mt-3 ">
            <small style={{ color: "#c0392b" }}>
              {error.message.toLowerCase()}
            </small>
          </div>
        )}
      </div>
      <div className="col-12 text-center pb-3">
        <LoadingButton
          loading={loading}
          variant="contained"
          disableElevation
          onClick={() => {
            setLoading(true);
            if (!username) {
              setError({ message: "username needs to be created" });
              setLoading(false);
              return;
            }
            accountServices
              .createUsername(username)
              .then((result) => {
                enqueueSnackbar(
                  <small>
                    <strong>Username Created Successfully</strong>
                  </small>,
                  {
                    variant: "success",
                    anchorOrigin: { horizontal: "left", vertical: "top" },
                  }
                );
                setLoading(false);

                setTimeout(() => {
                  router.reload(window.location.pathname);
                }, 1000);
              })
              .catch((err) => {
                // Show Error

                if (err.message == "Already have a profile") {
                  // Rare instance of user having a profile and creating a username, not just updating

                  router.reload(window.location.pathname);
                }

                if (err)
                  setError({
                    message: Array.isArray(err.messages)
                      ? err.messages[0]
                      : err.messages ||
                        err.message ||
                        "Unexpected Error, Try again later.",
                  });
                setLoading(false);
              });
          }}
        >
          Create Username
        </LoadingButton>
      </div>
    </div>
  );
}
