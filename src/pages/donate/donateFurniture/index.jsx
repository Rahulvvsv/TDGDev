import DonateFurniture from "@/components/templates/donateFurniture";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = () => {
      const cookies = document.cookie.split(";");
      const loggedInCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("loggedIn=")
      );
      return loggedInCookie && loggedInCookie.split("=")[1] === "true";
    };

    if (checkLoginStatus()) {
      setIsLoggedIn(true);
    } else {
      router.push("/login"); // Redirect to login page if not logged in
    }
  }, [router]);

  if (!isLoggedIn) {
    return null; // Or you could return a loading indicator
  }

  return <DonateFurniture />;
};

export default Index;
