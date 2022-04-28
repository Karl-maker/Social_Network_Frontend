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
              .catch((error) => {
                enqueueSnackbar(
                  <small>
                    <strong>Error Creating Username</strong>
                  </small>,
                  {
                    variant: "error",
                    anchorOrigin: { horizontal: "left", vertical: "top" },
                  }
                );

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
