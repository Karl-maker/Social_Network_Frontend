import { LoadingButton } from "@mui/lab";
import { TextField, Button } from "@mui/material";
import { useState, useContext } from "react";
import DialogButton from "../templates/DialogButton";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { AccountContext } from "../templates/ContextProvider";

export default function EditProfile({ children, setOpen, open, profile }) {
  const router = useRouter();
  const accountServices = useContext(AccountContext);
  const [updateLoading, setUpdateLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [profileDetails, setProfileDetails] = useState({
    bio: accountServices.bio || "",
  });

  return (
    <DialogButton
      setOpen={setOpen}
      open={open}
      element={
        <TextField
          key="bio"
          size="large"
          label="bio"
          variant="outlined"
          multiline
          rows={4}
          className="mt-2"
          sx={{ width: "300px" }}
          value={profileDetails.bio}
          onChange={(e) => {
            setProfileDetails((prevState) => ({
              ...prevState,
              bio: e.target.value,
            }));
          }}
        />
      }
      title="Edit Profile"
      actions={
        <div>
          <LoadingButton
            loading={updateLoading}
            onClick={() => {
              setUpdateLoading(true);
              profile
                .updateProfile(profileDetails, {
                  access_token: accountServices.access_token,
                })
                .then((result) => {
                  enqueueSnackbar("Update Successful", {
                    variant: "success",
                    anchorOrigin: {
                      horizontal: "left",
                      vertical: "top",
                    },
                  });
                  setOpen(false);
                  setUpdateLoading(false);
                })
                .catch((err) => {
                  enqueueSnackbar("Issue Updating Profile", {
                    variant: "error",
                    anchorOrigin: {
                      horizontal: "left",
                      vertical: "top",
                    },
                  });
                  setOpen(false);
                });
            }}
          >
            Update
          </LoadingButton>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
        </div>
      }
    >
      {children}
    </DialogButton>
  );
}
