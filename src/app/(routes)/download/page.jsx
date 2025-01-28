'use client'
import React from "react";
import MyComponent from "../components/file";
import RouteLayout from "../RouteLayout";
import { useSearchParams } from "next/navigation";

function Download() {
  const searchParams = useSearchParams()
  const delivery_note_no = searchParams.get('delivery_note_no');
  const so_no = searchParams.get('so_no')
  const date_at = searchParams.get('date_at')
  const customer_id = searchParams.get('customer_id')

    // Validasi parameter  
    if (!delivery_note_no || !so_no || !date_at || !customer_id) {  
      // console.log(deliveryNoteNo, so_no, date_at, customer_id);
      return <div>Error: Missing required parameters.</div>;  
    }  

  return (
    <RouteLayout>
      <MyComponent 
      delivery_note_no={delivery_note_no}
      so_no={so_no}
      date_at={date_at}
      customer_id={customer_id}
      />
    </RouteLayout>
  );
}

export default Download;
