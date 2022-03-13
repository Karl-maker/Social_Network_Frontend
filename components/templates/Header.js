import { useEffect, useState, useContext } from "react";
import { AccountContext } from "./ContextProvider";
import { FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function Header({}) {
  const accountServices = useContext(AccountContext);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (!accountServices.id) {
      accountServices.fetchCurrentUser().then((result) => {
        if (result) {
          accountServices.fetchUserInformation(null).then((user) => {
            setUsername(user.user[0].username);
            setDisplayName(user.display_name);
          });
        }
      });
    }
  }, []);

  return (
    <>
      <div className="col-6 px-4">
        <Link href="/" passHref>
          <Image src="/logo192.png" alt="Syncviz Logo" width={70} height={70} />
        </Link>
      </div>
      <div className="col-6 text-end px-4">
        {username && `${username}`}
        <FaUserCircle style={{ marginLeft: "20px", fontSize: "30px" }} />
      </div>
    </>
  );
}
