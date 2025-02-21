import Image from "next/image";
import HakedoLogoLetter from "../images/Hakedologo.png";
import "../../styles/DeliveryNote.css";
import React, { useState, useEffect } from "react";
import FormattedDate from "@/components/FormattedDate";
import { useSession } from "next-auth/react";

const MyComponent = ({ delivery_note_no }) => {
  const [deliveryData, setDeliveryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  
  useEffect(() => {
    async function fetchDeliveryData() {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/download_dn?delivery_note_no=${delivery_note_no}`
        );        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data.deliveryData);
        setDeliveryData(data.deliveryData);
        console.log(deliveryData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDeliveryData();
  }, [delivery_note_no]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return ( 
      <>  
        {deliveryData && deliveryData.length > 0 ? (  
          <div id="myElementId" className="delivery-notes-container"> 
            {/* Left Container */}  
            <div className="delivery-note">  
              <div className="bg-white rounded px-4 pt-2 pb-2 mb-2 ml-8 flex flex-col mt-4 border-0">  
                <div className="-mx-3 md:flex mb-4 flex flex-1">  
                  {/* Head letter container */}  
                  <div className="w-1/2 px-2">  
                    <p className="font-[11px] font-calibri">  
                      <strong>PT Hakedo Putra Mandiri</strong>  
                    </p>  
                    <p className="font-[11px] font-calibri">  
                      Jalan Raya Perancis, Komp. Perg. Ocean Park Kav. 38 Blok HF Tangerang, Banten, 15213, Indonesia  
                    </p>  
                    <p className="font-[11px] font-calibri">Phone: +622152395563</p>  
                    <p className="font-[11px] font-calibri">Email: info@hakedoputramandiri.com</p>  
                  </div>  
                  {/* Logo container */}  
                  <div className="w-1/2 px-2 flex justify-end items-center">  
                    <Image  
                      src={HakedoLogoLetter}  
                      width={200}  
                      height={200}  
                      alt="PT Hakedo Putra Mandiri Logo"  
                    />  
                  </div>  
                </div>  
                {/* Delivery Details Section */}  
                <div className="block">  
                  <p className="font-[14px] font-calibri flex justify-center">  
                    <strong>DELIVERY NOTE</strong>  
                  </p>  
                  <br />  
                  <div className="flex justify-around">  
                    <div className="w-1/2">  
                      <p className="font-[11px] font-calibri"><strong>DELIVERY TO</strong></p>  
                      <p className="font-[11px] font-calibri">{deliveryData[0].company_name}</p>  
                      <p className="font-[11px] font-calibri">{deliveryData[0].address}</p>  
                      <div>  
                        <span className="font-[11px] font-calibri">Attn</span>  
                        <span className="ml-4 font-[11px] font-calibri">:</span>  
                        <span className="ml-2 font-[11px] font-calibri">{deliveryData[0].attn_name}</span>  
                      </div>  
                      <div>  
                        <span className="font-[11px] font-calibri">Phone</span>  
                        <span className="ml-4 font-[11px] font-calibri">:</span>  
                        <span className="ml-2 font-[11px] font-calibri">{deliveryData[0].phone_number}</span>  
                      </div>  
                    </div>  
                    <div className="w-1/2 text-right">  
                      <div className="delivery-note-details">  
                        <div className="detail-row">  
                          <p className="detail-key font-[11px] font-calibri">Delivery Note No.</p>  
                          <p className="detail-value font-[11px] font-calibri">: {deliveryData[0].delivery_note_no}</p>  
                        </div>  
                        <div className="detail-row">  
                          <p className="detail-key font-[11px] font-calibri">Delivery Date</p>  
                          <p className="detail-value font-[11px] font-calibri">: <FormattedDate dateStr={deliveryData[0].delivery_date} dateFormat="dd MMMM yyyy" /></p>  
                        </div>  
                        <div className="detail-row">  
                          <p className="detail-key font-[11px] font-calibri">PO No.</p>  
                          <p className="detail-value font-[11px] font-calibri">: {deliveryData[0].po}</p>  
                        </div>  
                        <div className="detail-row">  
                          <p className="detail-key font-[11px] font-calibri">SO No.</p>  
                          <p className="detail-value font-[11px] font-calibri">: {deliveryData[0].so_no}</p>  
                        </div>  
                        <div className="detail-row">  
                          <p className="detail-key font-[11px] font-calibri">Customer ID</p>  
                          <p className="detail-value font-[11px] font-calibri">: {deliveryData[0].customer_id}</p>  
                        </div>  
                        <div className="detail-row">  
                          <p className="detail-key font-[11px] font-calibri">License Plate No.</p>  
                          <p className="detail-value font-[11px] font-calibri">: {deliveryData[0].license_plate_no}</p>  
                        </div>  
                      </div>  
                    </div>  
                  </div>  
                </div>  
        
                <div className="table mt-2 mb-2">  
                  <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5 border-1">  
                    <div className="overflow-hidden border-black">  
                      <table className="min-w-full border text-center font-[11px] border-black">  
                        <thead className="border-b items-center font-[11px] border-black">  
                          <tr>  
                            <th scope="col" className="font-calibri border-r text-center align-middle font-[11px] px-2 pb-1 border-black">NO.</th>  
                            <th scope="col" className="font-calibri border-r font-[11px] px-1 pb-1 text-center align-middle border-black">PRODUCT ID</th>  
                            <th scope="col" className="font-calibri border-r font-[11px] px-2 pb-1 text-center align-middle border-black">ITEM DESCRIPTION</th>  
                            <th scope="col" className="font-calibri border-r font-[11px] px-2 pb-1 text-center align-middle border-black">QTY</th>  
                            <th scope="col" className="font-calibri border-r font-[11px] px-2 pb-1 text-center align-middle border-black">UoM</th>  
                          </tr>  
                        </thead>  
                        <tbody>  
                          {deliveryData.map((item, index) => (  
                            <tr className="border-b border-black" key={index}>  
                              <td className="font-calibri px-2 pb-1 border-r border-black whitespace-nowrap font-[11px]">{index + 1}</td>  
                              <td className="font-calibri font-[11px] border-r border-black px-2 pb-1 whitespace-nowrap">{item.product_id}</td>  
                              <td className="font-calibri font-[11px] border-r border-black px-2 pb-1 text-left whitespace-nowrap">{item.product_name}</td>  
                              <td className="font-calibri font-[11px] border-r border-black px-2 pb-1 whitespace-nowrap">{item.qty}</td>  
                              <td className="font-calibri font-[11px] border-r border-black px-2 pb-1 whitespace-nowrap">{item.uom}</td>  
                            </tr>  
                          ))}  
                        </tbody>  
                      </table>  
                    </div>  
                  </div>  
                </div>  
        
                {/* Sign Section */}  
                <div className="block mt-4">  
                  <div className="flex items-start justify-between">  
                    <div className="flex text-center"></div>  
                    <div className="flex text-center"></div>  
                    <div className="w-[180px] text-center">  
                      <p className="font-[11px] ml-2 font-calibri">  
                        Tangerang, <FormattedDate dateStr={deliveryData[0].delivery_date} dateFormat="dd/MM/yyyy" />  
                      </p>  
                    </div>  
                  </div>  
        
                  <div className="flex items-center justify-between">  
                    <div className="w-[150px] ml-2 text-center">  
                      <p className="font-[11px] font-calibri">Received By,</p>  
                    </div>  
                    <div className="w-[150px] ml-2 text-center">  
                      <p className="font-[11px] font-calibri">Expedition,</p>  
                    </div>  
                    <div className="w-[150px] ml-2 text-center">  
                      <p className="font-[11px] font-calibri">Warehouse,</p>  
                    </div>  
                  </div>  
        
                  <div className="flex items-center justify-between mt-4">  
                    <span></span>  
                    <span></span>  
                    <span className="w-[150px] mt-5 text-center">  
                      {session ? (  
                        <p className="font-[11px] font-calibri">{session.user.name}</p>  
                      ) : (  
                        <p></p>  
                      )}  
                    </span>  
                  </div>  
                  <div className="flex items-center mt-2 justify-between">  
                    <span className="w-[150px] ml-2 text-center border-black border-t-2"><br /></span>  
                    <span className="w-[150px] text-center border-black border-t-2"><br /></span>  
                    <span className="w-[150px] text-center border-black border-t-2"><br /></span>  
                  </div>  
                </div>  
              </div>  
            </div>  
  
            {/* Right Container */}
            <div className="delivery-note">  
            <div className="bg-white rounded px-4 pt-2 pb-2 mb-2 mr-8 flex flex-col mt-4 border-0">  
                <div className="-mx-3 md:flex mb-4 flex flex-1">  
                  {/* Head letter container */}  
                  <div className="w-1/2 px-2">  
                    <p className="font-[11px] font-calibri">  
                      <strong>PT Hakedo Putra Mandiri</strong>  
                    </p>  
                    <p className="font-[11px] font-calibri">  
                      Jalan Raya Perancis, Komp. Perg. Ocean Park Kav. 38 Blok HF Tangerang, Banten, 15213, Indonesia  
                    </p>  
                    <p className="font-[11px] font-calibri">Phone: +622152395563</p>  
                    <p className="font-[11px] font-calibri">Email: info@hakedoputramandiri.com</p>  
                  </div>  
                  {/* Logo container */}  
                  <div className="w-1/2 px-2 flex justify-end items-center">  
                    <Image  
                      src={HakedoLogoLetter}  
                      width={200}  
                      height={200}  
                      alt="PT Hakedo Putra Mandiri Logo"  
                    />  
                  </div>  
                </div>  
                {/* Delivery Details Section */}  
                <div className="block">  
                  <p className="font-[14px] font-calibri flex justify-center">  
                    <strong>DELIVERY NOTE</strong>  
                  </p>  
                  <br />  
                  <div className="flex justify-around">  
                    <div className="w-1/2">  
                      <p className="font-[11px] font-calibri"><strong>DELIVERY TO</strong></p>  
                      <p className="font-[11px] font-calibri">{deliveryData[0].company_name}</p>  
                      <p className="font-[11px] font-calibri">{deliveryData[0].address}</p>  
                      <div>  
                        <span className="font-[11px] font-calibri">Attn</span>  
                        <span className="ml-4 font-[11px] font-calibri">:</span>  
                        <span className="ml-2 font-[11px] font-calibri">{deliveryData[0].attn_name}</span>  
                      </div>  
                      <div>  
                        <span className="font-[11px] font-calibri">Phone</span>  
                        <span className="ml-4 font-[11px] font-calibri">:</span>  
                        <span className="ml-2 font-[11px] font-calibri">{deliveryData[0].phone_number}</span>  
                      </div>  
                    </div>  
                    <div className="w-1/2 text-right">  
                      <div className="delivery-note-details">  
                        <div className="detail-row">  
                          <p className="detail-key font-[11px] font-calibri">Delivery Note No.</p>  
                          <p className="detail-value font-[11px] font-calibri">: {deliveryData[0].delivery_note_no}</p>  
                        </div>  
                        <div className="detail-row">  
                          <p className="detail-key font-[11px] font-calibri">Delivery Date</p>  
                          <p className="detail-value font-[11px] font-calibri">: <FormattedDate dateStr={deliveryData[0].delivery_date} dateFormat="dd MMMM yyyy" /></p>  
                        </div>  
                        <div className="detail-row">  
                          <p className="detail-key font-[11px] font-calibri">PO No.</p>  
                          <p className="detail-value font-[11px] font-calibri">: {deliveryData[0].po}</p>  
                        </div>  
                        <div className="detail-row">  
                          <p className="detail-key font-[11px] font-calibri">SO No.</p>  
                          <p className="detail-value font-[11px] font-calibri">: {deliveryData[0].so_no}</p>  
                        </div>  
                        <div className="detail-row">  
                          <p className="detail-key font-[11px] font-calibri">Customer ID</p>  
                          <p className="detail-value font-[11px] font-calibri">: {deliveryData[0].customer_id}</p>  
                        </div>  
                        <div className="detail-row">  
                          <p className="detail-key font-[11px] font-calibri">License Plate No.</p>  
                          <p className="detail-value font-[11px] font-calibri">: {deliveryData[0].license_plate_no}</p>  
                        </div>  
                      </div>  
                    </div>  
                  </div>  
                </div>  
        
                <div className="table mt-2 mb-2">  
                  <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5 border-1">  
                    <div className="overflow-hidden border-black">  
                      <table className="min-w-full border text-center font-[11px] border-black">  
                        <thead className="border-b items-center font-[11px] border-black">  
                          <tr>  
                            <th scope="col" className="font-calibri border-r text-center align-middle font-[11px] px-2 pb-1 border-black">NO.</th>  
                            <th scope="col" className="font-calibri border-r font-[11px] px-1 pb-1 text-center align-middle border-black">PRODUCT ID</th>  
                            <th scope="col" className="font-calibri border-r font-[11px] px-2 pb-1 text-center align-middle border-black">ITEM DESCRIPTION</th>  
                            <th scope="col" className="font-calibri border-r font-[11px] px-2 pb-1 text-center align-middle border-black">QTY</th>  
                            <th scope="col" className="font-calibri border-r font-[11px] px-2 pb-1 text-center align-middle border-black">UoM</th>  
                          </tr>  
                        </thead>  
                        <tbody>  
                          {deliveryData.map((item, index) => (  
                            <tr className="border-b border-black" key={index}>  
                              <td className="font-calibri px-2 pb-1 border-r border-black whitespace-nowrap font-[11px]">{index + 1}</td>  
                              <td className="font-calibri font-[11px] border-r border-black px-2 pb-1 whitespace-nowrap">{item.product_id}</td>  
                              <td className="font-calibri font-[11px] border-r border-black px-2 pb-1 text-left whitespace-nowrap">{item.product_name}</td>  
                              <td className="font-calibri font-[11px] border-r border-black px-2 pb-1 whitespace-nowrap">{item.qty}</td>  
                              <td className="font-calibri font-[11px] border-r border-black px-2 pb-1 whitespace-nowrap">{item.uom}</td>  
                            </tr>  
                          ))}  
                        </tbody>  
                      </table>  
                    </div>  
                  </div>  
                </div>  
        
                {/* Sign Section */}  
                <div className="block mt-4">  
                  <div className="flex items-start justify-between">  
                    <div className="flex text-center"></div>  
                    <div className="flex text-center"></div>  
                    <div className="w-[180px] text-center">  
                      <p className="font-[11px] ml-2 font-calibri">  
                        Tangerang, <FormattedDate dateStr={deliveryData[0].delivery_date} dateFormat="dd/MM/yyyy" />  
                      </p>  
                    </div>  
                  </div>  
        
                  <div className="flex items-center justify-between">  
                    <div className="w-[150px] ml-2 text-center">  
                      <p className="font-[11px] font-calibri">Received By,</p>  
                    </div>  
                    <div className="w-[150px] ml-2 text-center">  
                      <p className="font-[11px] font-calibri">Expedition,</p>  
                    </div>  
                    <div className="w-[150px] ml-2 text-center">  
                      <p className="font-[11px] font-calibri">Warehouse,</p>  
                    </div>  
                  </div>  
        
                  <div className="flex items-center justify-between mt-4">  
                    <span></span>  
                    <span></span>  
                    <span className="w-[150px] mt-5 text-center">  
                      {session ? (  
                        <p className="font-[11px] font-calibri">{session.user.name}</p>  
                      ) : (  
                        <p></p>  
                      )}  
                    </span>  
                  </div>  
                  <div className="flex items-center mt-2 justify-between">  
                    <span className="w-[150px] ml-2 text-center border-black border-t-2"><br /></span>  
                    <span className="w-[150px] text-center border-black border-t-2"><br /></span>  
                    <span className="w-[150px] text-center border-black border-t-2"><br /></span>  
                  </div>  
                </div>  
              </div>  
            </div>  
  
            {/* End Right Container */}  
          </div>  
        ) : (  
          <p>Delivery data is loading or not available...</p>  
        )}  
      </>
  );  
};  

export default MyComponent;
