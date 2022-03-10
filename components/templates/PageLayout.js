export default function PageLayout({ children }) {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          {/*

          Header

          */}
        </div>
        <div className="row">
          {/*

          Main Body

          */}
          <div className="col-lg-3 col-md-1 col-sm-0"></div>
          <div className="col-lg-6 col-md-10 col-sm-12">{children}</div>
          <div className="col-lg-3 col-md-1 col-sm-0"></div>
        </div>
      </div>
    </>
  );
}
