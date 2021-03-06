import Header from "./Header";
import { AccountContext } from "../../components/templates/ContextProvider";
import { useEffect, useState, useContext } from "react";
import ProfileChipWidget from "../profile/ProfileChipWidget";
import SideNav from "../navigation/SideNav";
import BottomNav from "../navigation/BottomNav";
import CreateUsername from "../sudo-page/CreateUsername";
import Image from "next/image";

export default function PageLayout({ children }) {
  const accountServices = useContext(AccountContext);

  if (accountServices.isLoggedIn && !accountServices.username) {
    return (
      <div className="container-fluid" style={{ backgroundColor: "#ffff" }}>
        <div className="row ">
          <div className="col-12 text-center mt-5">
            <Image
              src="/dripplie-banner-center(blue).svg"
              height={90}
              width={90}
              alt="Dripplie-Banner"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-2 col-sm-0 d-none d-lg-block">
            <div></div>
          </div>
          <div className="col-lg-8 col-sm-12 mt-5 mb-5">
            {/*

             Here we will force the user to create a username

             */}
            <CreateUsername />
          </div>
          <div className="col-lg-2 col-sm-0 d-none d-lg-block">
            <div></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid" style={{ backgroundColor: "#ffff" }}>
        <div
          className="row align-items-center pt-3 sticky-top"
          style={{
            opacity: 0.99,
            backdropFilter: "blur(20px)",
          }}
        >
          {/*

          Header

          */}
          <div className="col-lg-1 col-sm-0 d-none d-lg-block"></div>
          <div className="col-lg-10 col-sm-12">
            <Header />
          </div>
          <div className="col-lg-1 col-sm-0 d-none d-lg-block"></div>
        </div>
        <div className="row">
          {/*

          Main Body

          */}
          {accountServices.isLoggedIn ? (
            <>
              <div className="col-lg-1 col-sm-0 d-none d-lg-block"></div>
              <div className="col-lg-2 col-sm-0 p-0 d-none d-lg-block">
                <SideNav />
              </div>
              <div className="col-lg-1 col-sm-0 d-none d-lg-block"></div>
              <div className="col-lg-7 col-sm-12 p-0 m-0">{children}</div>
              <div className="col-lg-1 col-sm-0 d-none d-lg-block"></div>
            </>
          ) : (
            <>
              <div className="col-lg-3 col-sm-0 d-none d-lg-block"></div>
              <div className="col-lg-6 col-sm-12 p-0 m-0">{children}</div>
              <div className="col-lg-3 col-sm-0 d-none d-lg-block"></div>
            </>
          )}
        </div>
        <div className="d-lg-none">
          <BottomNav />
        </div>
      </div>
    </>
  );
}
