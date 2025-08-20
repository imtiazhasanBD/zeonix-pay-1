// pages/MerchantProfilePage.tsx

import ApiKeyCard from "@/app/components/merchant/setting/ApiKeyCard";
import ProfileCard from "@/app/components/merchant/setting/ProfileCard";
import { getApiKey } from "@/app/lib/api/merchant/apiKey";
import { getMerchantProfile, getProfile } from "@/app/lib/api/merchant/profile";


export default async function MerchantProfilePage() {
  // Fetch data
  const { data: profileData } = await getMerchantProfile();
  const { data: apiData } = await getApiKey();

console.log(profileData);


  return (
    <div className="mx-auto w-full space-y-6">
      <ProfileCard data={profileData} />
      <ApiKeyCard
        apiKey={apiData}
      />
    </div>
  );
}
