"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const role: string = "admin";

    if (role === "admin") {
      router.push("/admin/dashboard");  
    } else if (role === "staff") {
      router.push("/staff/dashboard");
    } else if (role === "user") {
      router.push("/user/dashboard"); 
    } else {
      router.push("/login"); 
    }
  }, [router]);

  return <div>Loading...</div>; 
};

export default HomePage;
