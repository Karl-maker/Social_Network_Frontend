import widget from "../styles/modules/Widget.module.css";

export default function Error404() {
  return (
    <div style={{ padding: "20px", height: "80%" }} className={widget.primary}>
      <div className="row d-flex align-items-center">
        <div className="col-12 text-center">
          <p>Not Found</p>
          <p>
            <small>404</small>
          </p>
        </div>
      </div>
    </div>
  );
}
