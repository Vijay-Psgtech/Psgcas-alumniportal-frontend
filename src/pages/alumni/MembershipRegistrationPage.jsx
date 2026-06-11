import React from "react";
import { useAuth } from "../../context/AuthContext";
import usePageTitle from "../../hooks/usePageTitle";
import MembershipPayment from "../../components/payment/MembershipPayment";

const MembershipRegistrationPage = () => {
  const { user } = useAuth();

  usePageTitle("Membership Registration");

  const prefillData = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    batchYear: user?.batchYear || user?.batchYear || "",
    department: user?.department || "",
    city: user?.city || "",
    state: user?.state || "",
    pincode: user?.pincode || "",
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-[2rem] bg-white border border-slate-200 shadow-2xl overflow-hidden">
          <MembershipPayment userId={user?._id} prefillData={prefillData} />
        </div>
      </div>
    </div>
  );
};

export default MembershipRegistrationPage;
