import { AlertCircle, Clock } from "lucide-react";

export default function RegistrationMaintenanceCard() {
  return (
    <div className="min-h-screen flex items-center justify-center p-20">
      <div className="max-w-xl w-full bg-white shadow-xl rounded-3xl border border-gray-100 p-8 text-center">
        
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Registration Temporarily Unavailable
        </h2>

        <p className="text-gray-600 leading-7 text-base">
          Alumni registration is currently unavailable while we complete
          payment gateway integration and system enhancements.
          Registration services will resume shortly.
        </p>

        <div className="mt-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />

          <p className="text-sm text-amber-800 leading-6">
            We appreciate your patience and understanding during this update.
          </p>
        </div>
      </div>
    </div>
  );
}