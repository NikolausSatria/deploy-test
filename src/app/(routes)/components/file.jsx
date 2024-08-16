import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";
import HakedoLogoLetter from "../images/Hakedologo.png";
import "../../styles/DeliveryNote.css";
import React, { useState, useEffect } from "react";
import Date from "@/components/Date";
import { useSession } from "next-auth/react";

const MyComponent = ({
  deliveryNoteNo,
  soNo,
  deliveryDate,
  in_out = "OUT-EXT",
}) => {
  const [deliveryData, setDeliveryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  const printDocument = () => {
    const input = document.getElementById("myElementId");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      // Adjust scale as needed
      // const imgData = canvas.toDataURL("image/png");
      const imgData = canvas.toDataURL({
        format: "png",
        quality: 0.1,
      });
      const imgWidth = 297; // width of A4 in mm
      const pageHeight = 210; // height of A4 in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF("landscape", "mm", "a4", true);
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`surat-jalan-${deliveryData[0].delivery_note_no}.pdf`);
    });
  };

  useEffect(() => {
    async function fetchDeliveryData() {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/downloadDn?delivery_note_no=${deliveryNoteNo}&so_no=${soNo}&delivery_date=${deliveryDate}&in_out=${in_out}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data.deliveryData);
        setDeliveryData(data.deliveryData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDeliveryData();
  }, [deliveryNoteNo, soNo, deliveryDate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-start px-8 pt-4">
        <button
          className=" p-2 rounded text-blue border-2 border-blue-500 hover:bg-blue-500 hover:text-white duration-100"
          onClick={printDocument}
        >
          Download as PDF
        </button>
      </div>

      <div id="myElementId">
        {deliveryData && deliveryData.length > 0 ? (
          <div className="delivery-notes-container">

            {/* left Container */}
            <div className="delivery-note">
              <div className="bg-white rounded px-8 pt-3 pb-3 mb-4 ml-16 flex flex-col mt-8 border-0">
                <div className="-mx-3 md:flex mb-6 flex flex-1">
                  {/* Head letter container */}
                  <div className="w-1/2 px-3">
                    <div className="">
                      {/* Head letter */}
                      <p className="font-[11px] font-calibri">
                       <strong>PT Hakedo Putra Mandiri</strong>
                      </p>
                      <p className="font-[11px] font-calibri">
                        Jalan Raya Perancis, Komp. Perg. Ocean Park Kav. 38 Blok
                        HF Tangerang, Banten, 15213, Indonesia
                      </p>
                      <p className="font-[11px] font-calibri">
                        Phone: +622152395563
                      </p>
                      <p className="font-[11px] font-calibri">
                        Email: info@hakedoputramandiri.com
                      </p>
                    </div>
                  </div>
                  {/* Logo container */}

                  <div className="w-1/2 px-3 flex justify-end items-center">
                    <Image
                      src={HakedoLogoLetter}
                      width={200} // Set the width to 350px
                      height={200} // Set the height to 350px
                      alt="PT Hakedo Putra Mandiri Logo"
                    />
                  </div>
                </div>
                {/* Delivery Details Section */}

                <div className="block">
                  <p className="font-[14px] font-calibri flex justify-center">
                    <strong>DELIVERY NOTE</strong>
                  </p>
                  <br></br>

                  <div className="flex justify-around">
                    <div className="w-1/2">
                      <p className="font-[11px] font-calibri">
                       <strong>DELIVERY TO</strong> 
                      </p>
                      {/* company name */}
                      <p className="font-[11px] font-calibri">
                       {deliveryData[0].company_name}
                      </p>
                      {/* company address */}
                      <p className="font-[11px] font-calibri">
                        {deliveryData[0].address}
                      </p>
                      <div>
                        <span className="font-[11px] font-calibri">Attn</span>
                        <span className="ml-6 font-[11px] font-calibri">:</span>
                        <span className="ml-2 font-[11px] font-calibri">
                          {deliveryData[0].attn_name}
                        </span>
                      </div>
                      <div>
                        <span className="font-[11px] font-calibri">Phone</span>
                        <span className="ml-[10px] font-[11px] font-calibri">:</span>
                        <span className="ml-2 font-[11px] font-calibri">
                          {deliveryData[0].phone_number}
                        </span>
                      </div>
                    </div>

                    <div className="w-1/2 text-right">
                      <div className="delivery-note-details">
                        <div className="detail-row">
                          <p className="detail-key font-[11px] font-calibri">
                            Delivery Note No.
                          </p>
                          <p className="detail-value font-[11px] font-calibri">
                            : {deliveryData[0].delivery_note_no}
                          </p>
                        </div>
                        <div className="detail-row">
                          <p className="detail-key font-[11px] font-calibri">
                            Delivery Date
                          </p>
                          <p className="detail-value font-[11px] font-calibri">
                            :{" "}
                            <Date
                              dateStr={deliveryData[0].delivery_date}
                              dateFormat="dd MMMM yyyy"
                            />
                          </p>
                        </div>
                        <div className="detail-row">
                          <p className="detail-key font-[11px] font-calibri">
                            PO No.
                          </p>
                          <p className="detail-value font-[11px] font-calibri">
                            : {deliveryData[0].po}
                          </p>
                        </div>
                        <div className="detail-row">
                          <p className="detail-key font-[11px] font-calibri">
                            SO No.
                          </p>
                          <p className="detail-value font-[11px] font-calibri">
                            : {deliveryData[0].so_no}
                          </p>
                        </div>
                        <div className="detail-row">
                          <p className="detail-key font-[11px] font-calibri">
                            Customer ID
                          </p>
                          <p className="detail-value font-[11px] font-calibri">
                            : {deliveryData[0].customer_id}
                          </p>
                        </div>
                        <div className="detail-row">
                          <p className="detail-key font-[11px] font-calibri">
                            Lisence Plate No.
                          </p>
                          <p className="detail-value font-[11px] font-calibri">
                            : {deliveryData[0].license_plate_no}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="table mt-10">
                  <div class="overflow-x-auto sm:mx-0.5 lg:mx-0.5 border-1">
                    <div class="overflow-hidden border-black">
                      <table class="min-w-full border text-center font-[11px] border-black">
                        <thead class="border-b  items-center font-[11px] border-black">
                          
                            <th
                              scope="col"
                              class="font-calibri border-r text-center align-middle font-[11px] px-4 pb-3 border-black"
                            >
                              NO.
                            </th>
                            <th
                              scope="col"
                              class="font-calibri border-r font-[11px] px-1 pb-3 text-center align-middle border-black"
                            >
                              PRODUCT ID
                            </th>
                            <th
                              scope="col"
                              class="font-calibri border-r  font-[11px] px-6 pb-3 text-center align-middle border-black"
                            >
                              ITEM DESCRIPTION
                            </th>
                            <th
                              scope="col"
                              class="font-calibri border-r font-[11px] px-6 pb-3 text-center align-middle border-black"
                            >
                              QTY
                            </th>
                            <th
                              scope="col"
                              class="font-calibri border-r font-[11px] px-6 pb-3 text-center align-middle border-black"
                            >
                              UoM
                            </th>
                          
                        </thead>
                        <tbody>
                          {deliveryData.map((item, index) => (
                            <tr
                              class="border-b border-black"
                              key={index}
                            >
                              <td class=" font-calibri px-6 pb-3 border-r border-black whitespace-nowrap font-[11px]">
                                {index + 1}
                              </td>
                              <td class=" font-calibri font-[11px] border-r border-black px-6 pb-3 whitespace-nowrap">
                                {item.product_id}
                              </td>
                              <td class=" font-calibri font-[11px] border-r border-black px-2 pb-2 text-left whitespace-nowrap">
                                {item.description}
                              </td>
                              <td class=" font-calibri font-[11px] border-r border-black px-6 pb-3 whitespace-nowrap">
                                {item.qty}
                              </td>
                              <td class=" font-calibri font-[11px] border-r border-black px-6 pb-3 whitespace-nowrap">
                                {item.uom}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/**Sign Section */}
                <div className="block mt-5">
                  <div className="flex items-start justify-between">
                    <div className="flex text-center"></div>
                    <div className=" flex text-center"></div>
                    <div className="w-[180px] text-center ">
                      <p className="font-[11px] ml-6 font-calibri">
                        Tangerang,{" "}
                        <Date
                          dateStr={deliveryData[0].delivery_date}
                          dateFormat="dd/MM/yyyy"
                        />{" "}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="w-[150px] ml-4 text-center ">
                      <p className="font-[11px] font-calibri">Received By,</p>
                    </div>
                    <div className="w-[150px] ml-4 text-center ">
                      <p className="font-[11px] font-calibri">Expedition, </p>
                    </div>
                    <div className="w-[150px] ml-4 text-center ">
                      <p className="font-[11px] font-calibri">Warehouse,</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-8">
                    <span></span>
                    <span></span>
                    <span className="w-[150px] mt-5 text-center ">
                      {session ? (
                        <p className="font-[11px] font-calibri">
                          {session.user.name}
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center mt-3 justify-between">
                    <span className="w-[150px] ml-4 text-center  border-black border-t-2">
                      <br />
                    </span>
                    <span className="w-[150px] text-center  border-black border-t-2">
                      <br />
                    </span>
                    <span className="w-[150px] text-center  border-black border-t-2">
                      <br />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Container */}
            <div className="delivery-note">
              <div className="bg-white rounded px-8 pt-3 pb-3 mb-4 mr-16 flex flex-col mt-8 border-0">
                <div className="-mx-3 md:flex mb-6 flex flex-1">
                  {/* Head letter container */}
                  <div className="w-1/2 px-3">
                    <div className="">
                      {/* Head letter */}
                      <p className="font-[11px] font-calibri">
                       <strong>PT Hakedo Putra Mandiri</strong>
                      </p>
                      <p className="font-[11px] font-calibri">
                        Jalan Raya Perancis, Komp. Perg. Ocean Park Kav. 38 Blok
                        HF Tangerang, Banten, 15213, Indonesia
                      </p>
                      <p className="font-[11px] font-calibri">
                        Phone: +622152395563
                      </p>
                      <p className="font-[11px] font-calibri">
                        Email: info@hakedoputramandiri.com
                      </p>
                    </div>
                  </div>
                  {/* Logo container */}

                  <div className="w-1/2 px-3 flex justify-end items-center">
                    <Image
                      src={HakedoLogoLetter}
                      width={200} // Set the width to 350px
                      height={200} // Set the height to 350px
                      alt="PT Hakedo Putra Mandiri Logo"
                    />
                  </div>
                </div>
                {/* Delivery Details Section */}

                <div className="block">
                  <p className="font-[14px] font-calibri flex justify-center">
                    <strong>DELIVERY NOTE</strong>
                  </p>
                  <br></br>

                  <div className="flex justify-around">
                    <div className="w-1/2">
                      <p className="font-[11px] font-calibri">
                       <strong>DELIVERY TO</strong> 
                      </p>
                      {/* company name */}
                      <p className="font-[11px] font-calibri">
                       {deliveryData[0].company_name}
                      </p>
                      {/* company address */}
                      <p className="font-[11px] font-calibri">
                        {deliveryData[0].address}
                      </p>
                      <div>
                        <span className="font-[11px] font-calibri">Attn</span>
                        <span className="ml-6 font-[11px] font-calibri">:</span>
                        <span className="ml-2 font-[11px] font-calibri">
                          {deliveryData[0].attn_name}
                        </span>
                      </div>
                      <div>
                        <span className="font-[11px] font-calibri">Phone</span>
                        <span className="ml-[10px] font-[11px] font-calibri">:</span>
                        <span className="ml-2 font-[11px] font-calibri">
                          {deliveryData[0].phone_number}
                        </span>
                      </div>
                    </div>

                    <div className="w-1/2 text-right">
                      <div className="delivery-note-details">
                        <div className="detail-row">
                          <p className="detail-key font-[11px] font-calibri">
                            Delivery Note No.
                          </p>
                          <p className="detail-value font-[11px] font-calibri">
                            : {deliveryData[0].delivery_note_no}
                          </p>
                        </div>
                        <div className="detail-row">
                          <p className="detail-key font-[11px] font-calibri">
                            Delivery Date
                          </p>
                          <p className="detail-value font-[11px] font-calibri">
                            :{" "}
                            <Date
                              dateStr={deliveryData[0].delivery_date}
                              dateFormat="dd MMMM yyyy"
                            />
                          </p>
                        </div>
                        <div className="detail-row">
                          <p className="detail-key font-[11px] font-calibri">
                            PO No.
                          </p>
                          <p className="detail-value font-[11px] font-calibri">
                            : {deliveryData[0].po}
                          </p>
                        </div>
                        <div className="detail-row">
                          <p className="detail-key font-[11px] font-calibri">
                            SO No.
                          </p>
                          <p className="detail-value font-[11px] font-calibri">
                            : {deliveryData[0].so_no}
                          </p>
                        </div>
                        <div className="detail-row">
                          <p className="detail-key font-[11px] font-calibri">
                            Customer ID
                          </p>
                          <p className="detail-value font-[11px] font-calibri">
                            : {deliveryData[0].customer_id}
                          </p>
                        </div>
                        <div className="detail-row">
                          <p className="detail-key font-[11px] font-calibri">
                            Lisence Plate No.
                          </p>
                          <p className="detail-value font-[11px] font-calibri">
                            : {deliveryData[0].license_plate_no}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="table mt-10">
                  <div class="overflow-x-auto sm:mx-0.5 lg:mx-0.5 border-1">
                    <div class="overflow-hidden border-black">
                      <table class="min-w-full border text-center font-[11px] border-black">
                        <thead class="border-b  items-center font-[11px] border-black">
                          
                            <th
                              scope="col"
                              class="font-calibri border-r text-center align-middle font-[11px] px-4 pb-3 border-black"
                            >
                              NO.
                            </th>
                            <th
                              scope="col"
                              class="font-calibri border-r font-[11px] px-1 pb-3 text-center align-middle border-black"
                            >
                              PRODUCT ID
                            </th>
                            <th
                              scope="col"
                              class="font-calibri border-r  font-[11px] px-6 pb-3 text-center align-middle border-black"
                            >
                              ITEM DESCRIPTION
                            </th>
                            <th
                              scope="col"
                              class="font-calibri border-r font-[11px] px-6 pb-3 text-center align-middle border-black"
                            >
                              QTY
                            </th>
                            <th
                              scope="col"
                              class="font-calibri border-r font-[11px] px-6 pb-3 text-center align-middle border-black"
                            >
                              UoM
                            </th>
                          
                        </thead>
                        <tbody>
                          {deliveryData.map((item, index) => (
                            <tr
                              class="border-b border-black"
                              key={index}
                            >
                              <td class=" font-calibri px-6 pb-3 border-r border-black whitespace-nowrap font-[11px]">
                                {index + 1}
                              </td>
                              <td class=" font-calibri font-[11px] border-r border-black px-6 pb-3 whitespace-nowrap">
                                {item.product_id}
                              </td>
                              <td class=" font-calibri font-[11px] border-r border-black px-2 pb-2 text-left whitespace-nowrap">
                                {item.description}
                              </td>
                              <td class=" font-calibri font-[11px] border-r border-black px-6 pb-3 whitespace-nowrap">
                                {item.qty}
                              </td>
                              <td class=" font-calibri font-[11px] border-r border-black px-6 pb-3 whitespace-nowrap">
                                {item.uom}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/**Sign Section */}
                <div className="block mt-5">
                  <div className="flex items-start justify-between">
                    <div className="flex text-center"></div>
                    <div className=" flex text-center"></div>
                    <div className="w-[180px] text-center ">
                      <p className="font-[11px] ml-6 font-calibri">
                        Tangerang,{" "}
                        <Date
                          dateStr={deliveryData[0].delivery_date}
                          dateFormat="dd/MM/yyyy"
                        />{" "}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="w-[150px] ml-4 text-center ">
                      <p className="font-[11px] font-calibri">Received By,</p>
                    </div>
                    <div className="w-[150px] ml-4 text-center ">
                      <p className="font-[11px] font-calibri">Expedition, </p>
                    </div>
                    <div className="w-[150px] ml-4 text-center ">
                      <p className="font-[11px] font-calibri">Warehouse,</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-8">
                    <span></span>
                    <span></span>
                    <span className="w-[150px] mt-5 text-center ">
                      {session ? (
                        <p className="font-[11px] font-calibri">
                          {session.user.name}
                        </p>
                      ) : (
                        <p></p>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center mt-3 justify-between">
                    <span className="w-[150px] ml-4 text-center  border-black border-t-2">
                      <br />
                    </span>
                    <span className="w-[150px] text-center  border-black border-t-2">
                      <br />
                    </span>
                    <span className="w-[150px] text-center  border-black border-t-2">
                      <br />
                    </span>
                  </div>
                </div>
              </div>
            </div>

{/* end right container */}

          </div>
        ) : (
          <p>Delivery data is loading or not available...</p>
        )}
      </div>
    </div>
  );
};

export default MyComponent;
