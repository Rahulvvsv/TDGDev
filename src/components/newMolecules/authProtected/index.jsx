import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";

export function withAuth(WrappedComponent) {
  return (props) => {
    const Router = useRouter();
    const [verified, setVerified] = useState(false);

    useEffect(() => {
      const cookies = parseCookies();
      const authCookie = cookies["loggedIn"];

      if (authCookie != true) {
        Router.replace("/login");
      } else {
        setVerified(true);
      }
    }, []);

    if (verified) {
      return <WrappedComponent {...props} />;
    } else {
      return <p>Please sign in</p>;
    }
  };
}
