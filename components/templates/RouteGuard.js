import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { AccountContext } from "./ContextProvider";

export default function RouteGuard({ children, pageProps }) {
  const accountServices = useContext(AccountContext);
  const [authenticated, setAuthenticated] = useState(
    accountServices.isLoggedIn
  );
  const router = useRouter();

  useEffect(() => {
    /**
     * Here goes the logic of retrieving a user
     * from the backend and redirecting
     * an unauthorized user
     * to the login page
     */
    if (pageProps.protected && !authenticated) {
      router.push({
        pathname: "/login",
        query: { return_url: router.asPath },
      });
    }

    setAuthenticated(accountServices.isLoggedIn);
  }, [accountServices.isLoggedIn]);

  return <>{children}</>;
}
