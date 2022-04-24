import { AccountContext } from "../components/templates/ContextProvider";
import { useContext, useState } from "react";
import { TextField, CircularProgress, Button } from "@mui/material";
import widget from "../styles/modules/Widget.module.css";
import { useRouter } from "next/router";
import AlertWidget from "../components/templates/Alert";

export default function CreateUsername() {
  const [username, setUsername] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({});
  const accountServices = useContext(AccountContext);
  const router = useRouter();

  return (
    <div className={widget.primary}>
      <AlertWidget
        severity={alertMessage.severity}
        content={alertMessage.content}
        title={alertMessage.severity}
        open={alert}
        setOpen={setAlert}
      />
      <div className="col-12 text-center">
        <p>Start by creating a username</p>
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
        <Button
          onClick={() => {
            accountServices.createUsername(username).then((result) => {
              if (result) {
                setAlertMessage({
                  severity: "success",
                  content: "Username created",
                  title: "Username",
                });

                setTimeout(() => {
                  router.push("/");
                }, 2000);

                setAlert(true);
              } else {
                setAlertMessage({
                  severity: "error",
                  content: "Username couldn't be created",
                  title: "Username",
                });
                setAlert(true);
              }
            });
          }}
        >
          Create Username
        </Button>
      </div>
    </div>
  );
}
