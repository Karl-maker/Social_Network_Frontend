import NotificationsDisplayWidget from "../../components/notification/NotificationsDisplayWidget";

export async function getStaticProps(context) {
  return {
    props: {
      protected: true,
      title: "Notifications",
      description: "See all your notifications.",
    },
  };
}

export default function Notifications() {
  return (
    <div className="row">
      <div className="col-12 mb-5">
        <NotificationsDisplayWidget />
      </div>
    </div>
  );
}
