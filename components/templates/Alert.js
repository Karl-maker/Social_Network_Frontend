import * as React from "react";
import { AlertTitle, Snackbar, Collapse } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

export default function AlertWidget({
  severity,
  content,
  title,
  open,
  setOpen,
  duration,
  vertical,
  horizontal,
}) {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Collapse in={open}>
      <Snackbar
        anchorOrigin={{
          vertical: vertical || "top",
          horizontal: horizontal || "left",
        }}
        open={open}
        autoHideDuration={duration || 6000}
        onClose={handleClose}
      >
        <Alert severity={severity} onClose={handleClose} sx={{ width: "100%" }}>
          <AlertTitle>{title}</AlertTitle>
          {content}
        </Alert>
      </Snackbar>
    </Collapse>
  );
}
