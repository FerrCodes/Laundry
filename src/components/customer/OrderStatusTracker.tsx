"use client";

import { Check, Clock, Package, Loader, Sparkles, Truck, Home } from "lucide-react";

interface OrderStatusTrackerProps {
  currentStatus: string;
}

export default function OrderStatusTracker({ currentStatus }: OrderStatusTrackerProps) {
  const steps = [
    { key: "pending", label: "Menunggu", icon: Clock },
    { key: "confirmed", label: "Dikonfirmasi", icon: Check },
    { key: "washing", label: "Dicuci", icon: Loader },
    { key: "drying", label: "Dikeringkan", icon: Sparkles },
    { key: "ironing", label: "Disetrika", icon: Package },
    { key: "ready", label: "Siap Diambil", icon: Truck },
    { key: "picked_up", label: "Sudah Diambil", icon: Home },
  ];

  const currentIndex = steps.findIndex((s) => s.key === currentStatus);
  const isCancelled = currentStatus === "cancelled";

  if (isCancelled) {
    return (
      <div className="text-center py-4">
        <div className="text-red-400 text-lg font-semibold">❌ Pesanan Dibatalkan</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Progress Bar Background */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#333333] -translate-y-1/2 hidden sm:block" />

      {/* Progress Bar Active */}
      <div
        className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 transition-all duration-500 hidden sm:block"
        style={{
          width: `${Math.min((currentIndex / (steps.length - 1)) * 100, 100)}%`,
        }}
      />

      {/* Steps */}
      <div className="relative flex justify-between items-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center gap-2 flex-1">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isActive
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-[#333333] bg-[#1A1A1A] text-gray-500"
                  }
                  ${isCurrent ? "ring-4 ring-blue-500/30 scale-110" : ""}
                `}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className={`
                text-xs font-medium hidden sm:block
                ${isActive ? "text-white" : "text-gray-500"}
              `}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Status Text */}
      <div className="text-center mt-4 sm:hidden">
        <span className="text-sm text-gray-400">
          Status:{" "}
          <span className="text-white font-medium">
            {steps[currentIndex]?.label || currentStatus}
          </span>
        </span>
      </div>
    </div>
  );
}