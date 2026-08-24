import Header from "../../components/common/Header";

import ProfileAbout from "../../components/customer/profile/ProfileAbout";
import ProfileActions from "../../components/customer/profile/ProfileActions";
import ProfileHeader from "../../components/customer/profile/ProfileHeader";
import ProfileInfo from "../../components/customer/profile/ProfileInfo";

function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 text-[#111827]">
      <Header />

      <ProfileHeader />

      <main className="px-4 py-4">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-start">
          <ProfileInfo />

          <div>
            <ProfileActions />

            <ProfileAbout />
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
