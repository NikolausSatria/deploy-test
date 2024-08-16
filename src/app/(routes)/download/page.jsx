'use client'
import React from "react";
import MyComponent from "../components/file";
import RouteLayout from "../RouteLayout";
import { useSearchParams } from "next/navigation";

function Download() {
  const searchParams = useSearchParams()
  const deliveryNoteNo = searchParams.get('deliveryNoteNo');
  const soNo = searchParams.get('soNo')
  const deliveryDate = searchParams.get('deliveryDate')
  return (
    <RouteLayout>
      <MyComponent 
      deliveryNoteNo={deliveryNoteNo}
      soNo={soNo}
      deliveryDate={deliveryDate}
      />
    </RouteLayout>
  );
}

export default Download;
