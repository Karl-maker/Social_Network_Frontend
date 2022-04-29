import Link from "next/link";

export default function Custom500() {
  return (
    <div style={{ padding: "20px", height: "80%" }} className={widget.primary}>
      <div className="row d-flex align-items-center">
        <div className="col-12 text-center">
          <p>Unexpect Error</p>
          <p>
            <Link href="/">
              <small>Go Back To Home Page</small>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
