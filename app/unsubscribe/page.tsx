import UnsubscribeForm from "@/components/UnsubscribeForm";
import { Suspense } from "react";

function SubscribeFormFallback() {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded-sm mb-4"></div>
      <div className="h-6 bg-gray-200 rounded-sm mb-4"></div>
      <div className="h-6 bg-gray-200 rounded-sm mb-4"></div>
    </div>
  )
}

export default function UnsubscribePage() {

  return <>
    <div>
      <Suspense fallback={<SubscribeFormFallback />}><UnsubscribeForm /></Suspense>
    </div>
  </>
}