"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {


      router.push("/admin/dashboard");  

  }, [router]);

  return <div>Loading...</div>;
};

export default HomePage;
