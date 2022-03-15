import { AccountContext } from "../components/templates/ContextProvider";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export async function getStaticProps(context) {
  return {
    props: {
      protected: false,
    },
  };
}

export default function Login() {
  const router = useRouter();
  const accountServices = useContext(AccountContext);
  const [isLoggedIn, setIsLoggedIn] = useState();

  useEffect(() => {
    accountServices.login("officialkarl66@gmail.com", "password").then(() => {
      // Push to home page

      setIsLoggedIn(accountServices.isLoggedIn);
    });
  }, []);

  if (isLoggedIn) {
    const returnUrl = router.query.return_url || "/";
    router.push(returnUrl);
  }

  return <></>;
}
