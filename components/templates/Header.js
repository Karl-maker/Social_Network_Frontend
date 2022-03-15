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
    setUsername(accountServices.username);
  }, [accountServices.username]);

  return (
    <>
      <div className="col-6 px-4">
        <Link href="/" passHref>
          <Image src="/logo192.png" alt="Syncviz Logo" width={70} height={70} />
        </Link>
      </div>
      <div className="col-6 text-end px-4">
        {username ? (
          <>
            {`${username}`}
            <FaUserCircle style={{ marginLeft: "20px", fontSize: "30px" }} />
          </>
        ) : (
          <Link href="/login" passHref>
            <Button variant="contained" disableElevation>
              Login
            </Button>
          </Link>
        )}
      </div>
    </>
  );
}
