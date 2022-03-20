import Header from "./Header";
import { AccountContext } from "../../components/templates/ContextProvider";
import { useEffect, useState, useContext } from "react";
import NotificationSideWidget from "../notification/NotificationSideWidget";

export default function PageLayout({ children }) {
  const accountServices = useContext(AccountContext);

  return (
    <>
      <div className="container-fluid" style={{ backgroundColor: "#ffff" }}>
        <div
          className="row align-items-center pt-2 sticky-top"
          style={{
            opacity: 0.99,
            backdropFilter: "blur(20px)",
          }}
        >
          {/*

          Header

          */}
          <Header />
        </div>
        <div className="row">
          {/*

          Main Body

          */}
          <div className="col-lg-3 col-md-1 col-sm-0">
            {accountServices.isLoggedIn && <NotificationSideWidget />}
          </div>
          <div className="col-lg-6 col-md-10 col-sm-12">{children}</div>
          <div className="col-lg-3 col-md-1 col-sm-0"></div>
        </div>
      </div>
    </>
  );
}
