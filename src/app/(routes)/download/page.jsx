'use client'
import React, { Suspense } from "react";
import MyComponent from "../components/file";
import RouteLayout from "../RouteLayout";
import { useSearchParams } from "next/navigation";

function DownloadWithSuspense() {
  const searchParams = useSearchParams();
  const delivery_note_no = searchParams.get('delivery_note_no');

  // Validasi parameter
  if (!delivery_note_no) {
    return <div>Error: Missing required parameters.</div>;
  }

  return (
    <RouteLayout>
      <MyComponent 
        delivery_note_no={delivery_note_no}
      />
    </RouteLayout>
  );
}

const Download = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DownloadWithSuspense />
    </Suspense>
  );
};

export default Download;
