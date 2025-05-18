"use client";
import Historico from "./history-component";

export default function InitialPage() {
  return (
    <div className="flex flex-col bg-[#020202] w-full h-full p-4 gap-1 overflow-auto">
      <Historico/>
    </div>
  );
}
