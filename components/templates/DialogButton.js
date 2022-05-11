import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";

function PaperComponent(props) {
  return (
    <div>
      <Paper {...props} />
    </div>
  );
}

export default function DialogButton({
  children,
  title,
  content,
  actions,
  setOpen,
  open,
  element,
}) {
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {children}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="delete-alert"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {element ? element : <DialogContentText>{content}</DialogContentText>}
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    </div>
  );
}
