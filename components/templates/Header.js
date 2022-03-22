import { useEffect, useState, useContext } from "react";
import { AccountContext } from "./ContextProvider";
import { FaUserCircle } from "react-icons/fa";
import Button from "@mui/material/Button";
import Image from "next/image";
import Link from "next/link";

export default function Header({}) {
  const accountServices = useContext(AccountContext);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (accountServices.isLoggedIn) setUsername(accountServices.username);
  }, []);

  return (
    <>
      <div className="col-4 px-4 m-0">
        <Link href="/" passHref>
          <Image src="/logo192.png" alt="Syncviz Logo" width={70} height={70} />
        </Link>
      </div>
      <div className="col-8 text-end px-4">
        {accountServices.isLoggedIn ? (
          <>
            {`${username}`}
            <FaUserCircle style={{ marginLeft: "20px", fontSize: "30px" }} />
          </>
        ) : (
          <Button
            variant="contained"
            href="/login"
            sx={{
              borderRadius: "20px",
              borderColor: "transparent",
              backgroundColor: "#2980b9",
            }}
            disableElevation
          >
            Login
          </Button>
        )}
      </div>
    </>
  );
}
