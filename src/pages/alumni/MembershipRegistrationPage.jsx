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
        <div className="mb-8 rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.34em] text-slate-400">
            Alumni Membership
          </p>
          <h1 className="mt-4 text-3xl font-black text-slate-900">
            Register your membership
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500 max-w-2xl">
            {user
              ? "We have prefilled your details from your alumni profile. Update any missing information before payment."
              : "Complete the form to register as an alumni member and unlock exclusive benefits."}
          </p>
        </div>

        <div className="rounded-[2rem] bg-white border border-slate-200 shadow-2xl overflow-hidden">
          <MembershipPayment userId={user?._id} prefillData={prefillData} />
        </div>
      </div>
    </div>
  );
};

export default MembershipRegistrationPage;
