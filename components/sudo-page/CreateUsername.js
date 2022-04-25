import { AccountContext, AlertContext } from "../templates/ContextProvider";
import { useContext, useState } from "react";
import { TextField, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import widget from "../../styles/modules/Widget.module.css";
import { useRouter } from "next/router";

export default function CreateUsername() {
  const accountServices = useContext(AccountContext);
  const alertServices = useContext(AlertContext);
  const setAlert = alertServices.setAlert;
  const setAlertMessage = alertServices.setAlertInfo;
  const [loading, setLoading] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  return (
    <div className={widget.primary}>
      <div className="col-12 text-center p-4">
        <h3 className="display-5 mb-3">Create A Username</h3>
        <p className="text-muted">
          This is so that other users may have a way to identify you, without
          revealing your identity
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
      </div>
      <div className="col-12 text-center pb-3">
        <LoadingButton
          loading={loading}
          variant="contained"
          disableElevation
          onClick={() => {
            setLoading(true);
            accountServices
              .createUsername(username)
              .then((result) => {
                setAlertMessage({
                  severity: "success",
                  content: "Username created",
                  title: "Username",
                });

                setLoading(false);

                setTimeout(() => {
                  router.reload(window.location.pathname);
                }, 1000);

                setAlert(true);
              })
              .catch((error) => {
                setAlertMessage({
                  severity: "error",
                  content: "Issue Creating Username",
                  title: "Username",
                });

                setLoading(false);
                setAlert(true);
              });
          }}
        >
          Create Username
        </LoadingButton>
      </div>
    </div>
  );
}
