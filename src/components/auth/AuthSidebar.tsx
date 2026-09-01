import { Sofa, Sparkles, Shield, Clock } from "lucide-react";

interface AuthSidebarProps {
  title: string;
  subtitle: string;
}

export default function AuthSidebar({ title, subtitle }: AuthSidebarProps) {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-blue-900 via-blue-800 to-blue-600 p-12 flex-col justify-between">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Sofa className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">LaundryApp</span>
        </div>
      </div>

      <div className="relative z-10 space-y-6">
        <h1 className="text-4xl font-bold text-white leading-tight">
          {title}
        </h1>
        <p className="text-blue-100 text-lg">{subtitle}</p>

        <div className="space-y-4 mt-8">
          <div className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <span>Proses cepat & tepat waktu</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <span>Keamanan & kebersihan terjamin</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>Hasil bersih, wangi, dan rapi</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 text-blue-200 text-sm">
        © 2026 LaundryApp. All rights reserved.
      </div>
    </div>
  );
}