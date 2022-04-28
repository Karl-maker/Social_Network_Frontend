import * as React from "react";
import { AlertTitle, Snackbar, Collapse, Slide } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { SnackbarProvider, useSnackbar } from "notistack";

export default function AlertWidget({
  severity,
  content,
  title,
  open,
  setOpen,
  duration,
  vertical,
  horizontal,
  children,
  setAlert,
}) {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    enqueueSnackbar(setAlertInfo.title, setAlertInfo.severity);
  }, [setAlertInfo]);

  // function SlideTransition(props) {
  //   return <Slide {...props} direction="right" />;
  // }

  // const Alert = React.forwardRef(function Alert(props, ref) {
  //   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  // });

  // const handleClose = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   setOpen(false);
  // };

  return (
    // <Collapse in={open}>
    //   <Snackbar
    //     TransitionComponent={SlideTransition}
    //     anchorOrigin={{
    //       vertical: vertical || "top",
    //       horizontal: horizontal || "left",
    //     }}
    //     open={open}
    //     autoHideDuration={duration || 6000}
    //     onClose={handleClose}
    //   >
    //     <Alert severity={severity} onClose={handleClose} sx={{ width: "100%" }}>
    //       <AlertTitle>{title}</AlertTitle>
    //       {content}
    //     </Alert>
    //   </Snackbar>
    // </Collapse>
    <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
  );
}
