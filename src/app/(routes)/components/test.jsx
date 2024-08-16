import generatePDF, { Resolution, Margin } from "react-to-pdf";
import React from "react";
import Image from "next/image";
import HakedoLogoLetter from "../images/Hakedologo.png";
import "../../styles/DeliveryNote.css";

const options = {
  // default is `save`
  method: "open",
  // default is Resolution.MEDIUM = 3, which should be enough, higher values
  // increases the image quality but also the size of the PDF, so be careful
  // using values higher than 10 when having multiple pages generated, it
  // might cause the page to crash or hang.
  resolution: Resolution.MEDIUM,
  page: {
    // margin is in MM, default is Margin.NONE = 0
    margin: Margin.NONE,
    // default is 'A4'
    format: "A4",
    // default is 'portrait'
    orientation: "landscape",
  },
  // Customize any value passed to the jsPDF instance and html2canvas
  // function. You probably will not need this and things can break,
  // so use with caution.
  overrides: {
    // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
    pdf: {
      compress: true,
    },
  },
};

// you can use a function to return the target element besides using React refs
const getTargetElement = () => document.getElementById("content-id");

const Component = () => {
  return (
    <div>
      <button onClick={() => generatePDF(getTargetElement, options)}>
        Generate PDF
      </button>
      <div id="content-id">
        <div className="delivery-notes-container">

          {/* left Container */}
          <div className="delivery-note">
            <div className="bg-white rounded px-8 pt-4 pb-5 mb-4 flex flex-col my-2 border-0">
              <div className="-mx-3 md:flex mb-6 flex flex-1">
                {/* Head letter container */}
                <div className="w-1/2 px-3">
                  <div className="">
                    {/* Head letter */}
                    <h3 className="font-medium">PT Hakedo Putra Mandiri</h3>
                    <h6 className="max-w-xs">
                      Jalan Raya Perancis, Komp. Perg. Ocean Park Kav. 38 Blok
                      HF Tangerang, Banten, 15213, Indonesia
                    </h6>
                    <h5>Phone: +622152395563</h5>
                    <h5>Email: info@hakedoputramandiri.com</h5>
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
                <h1 className="flex justify-center"><strong>DELIVERY NOTE</strong></h1>
                <br></br>

                <div className="flex justify-around">
                  <div className="w-1/2">
                    <h4>PT. Tirta Alkalindo</h4>
                    <h4 className="max-w-xs">
                      Jl. Lurah Namat No. 06, RT002/RW006, Kelurahan Jatirangga,
                      Kecamatan Jatisampurna, Kabupaten Bekasi, Provinsi Jawa
                      Barat, 17434.
                    </h4>
                    <h4>Attn : Raymond Leonardo</h4>
                    <h4>Phone : +6281272888866</h4>
                  </div>

                  <div className="w-1/2 text-right">
                    <div className="delivery-note-details">
                      <div className="detail-row">
                        <h4 className="detail-key">Delivery Note No.</h4>
                        <h4 className="detail-value">: 1058-12/SD/HPM/2023</h4>
                      </div>
                      <div className="detail-row">
                        <h4 className="detail-key">Delivery Date</h4>
                        <h4 className="detail-value">: 12 November 2023</h4>
                      </div>
                      <div className="detail-row">
                        <h4 className="detail-key">PO No.</h4>
                        <h4 className="detail-value">: PEM/TA/09-2023/05-01</h4>
                      </div>
                      <div className="detail-row">
                        <h4 className="detail-key">SO No.</h4>
                        <h4 className="detail-value">: 500117</h4>
                      </div>
                      <div className="detail-row">
                        <h4 className="detail-key">Customer ID</h4>
                        <h4 className="detail-value">: 10012</h4>
                      </div>
                      <div className="detail-row">
                        <h4 className="detail-key">Lisence Plate No.</h4>
                        <h4 className="detail-value">: B 9249 XO</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="table top-5 mt-10">
                <div class="overflow-x-auto sm:mx-0.5 lg:mx-0.5 border-2">
                  <div class="py-2 inline-block  min-w-full sm:px-6 lg:px-8">
                    <div class="overflow-hidden">
                      <table class="min-w-full">
                        <thead class="bg-white border-b">
                          <tr>
                            <th
                              scope="col"
                              class="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                            >
                              No.
                            </th>
                            <th
                              scope="col"
                              class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                            >
                              Product ID
                            </th>
                            <th
                              scope="col"
                              class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                            >
                              Item Description
                            </th>
                            <th
                              scope="col"
                              class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                            >
                              QTY
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr class="bg-gray-100 border-b">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              1
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              Mark
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              Otto
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              @mdo
                            </td>
                          </tr>
                          <tr class="bg-white border-b">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              2
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              Jacob
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              Dillan
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              @fat
                            </td>
                          </tr>
                          <tr class="bg-gray-100 border-b">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              3
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              Mark
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              Twen
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              @twitter
                            </td>
                          </tr>
                          <tr class="bg-white border-b">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              4
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              Bob
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              Dillan
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              @fat
                            </td>
                          </tr>
                          <tr class="bg-gray-100 border-b">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              5
                            </td>
                            <td
                              colspan="2"
                              class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center"
                            >
                              Larry the Bird
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              @twitter
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/**Sign Section */}
              <div className="block mt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4>Received by:</h4>
                  </div>
                  <div className="relative right-5">
                    <h4>Expedition :</h4>
                  </div>
                  <div className=" text-end">
                    <h4>Tangereang,12/08/2023: </h4>
                    <h6>Warehouse</h6>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5">
                  <span className="w-[200px] mt-10 text-center  border-black border-t-4">
                    Signature
                  </span>
                  <span className="w-[200px] mt-10 text-center  border-black border-t-4">
                    Signature
                  </span>
                  <span className="w-[200px] mt-10 text-center  border-black border-t-4">
                    Warehouse
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Container */}
          <div className="delivery-note">
            <div className="bg-white rounded px-8 pt-4 pb-5 mb-4 flex flex-col my-2 border-0">
              <div className="-mx-3 md:flex mb-6 flex flex-1">
                {/* Head letter container */}
                <div className="w-1/2 px-3">
                  <div className="">
                    {/* Head letter */}
                    <h3 className="font-medium">PT Hakedo Putra Mandiri</h3>
                    <h6 className="max-w-xs">
                      Jalan Raya Perancis, Komp. Perg. Ocean Park Kav. 38 Blok
                      HF Tangerang, Banten, 15213, Indonesia
                    </h6>
                    <h5>Phone: +622152395563</h5>
                    <h5>Email: info@hakedoputramandiri.com</h5>
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
                <h1 className="flex justify-center"><strong>DELIVERY NOTE</strong></h1>
                <br></br>

                <div className="flex justify-around">
                  <div className="w-1/2">
                    <h4>PT. Tirta Alkalindo</h4>
                    <h4 className="max-w-xs">
                      Jl. Lurah Namat No. 06, RT002/RW006, Kelurahan Jatirangga,
                      Kecamatan Jatisampurna, Kabupaten Bekasi, Provinsi Jawa
                      Barat, 17434.
                    </h4>
                    <h4>Attn : Raymond Leonardo</h4>
                    <h4>Phone : +6281272888866</h4>
                  </div>

                  <div className="w-1/2 text-right">
                    <div className="delivery-note-details">
                      <div className="detail-row">
                        <h4 className="detail-key">Delivery Note No.</h4>
                        <h4 className="detail-value">: 1058-12/SD/HPM/2023</h4>
                      </div>
                      <div className="detail-row">
                        <h4 className="detail-key">Delivery Date</h4>
                        <h4 className="detail-value">: 12 November 2023</h4>
                      </div>
                      <div className="detail-row">
                        <h4 className="detail-key">PO No.</h4>
                        <h4 className="detail-value">: PEM/TA/09-2023/05-01</h4>
                      </div>
                      <div className="detail-row">
                        <h4 className="detail-key">SO No.</h4>
                        <h4 className="detail-value">: 500117</h4>
                      </div>
                      <div className="detail-row">
                        <h4 className="detail-key">Customer ID</h4>
                        <h4 className="detail-value">: 10012</h4>
                      </div>
                      <div className="detail-row">
                        <h4 className="detail-key">Lisence Plate No.</h4>
                        <h4 className="detail-value">: B 9249 XO</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="table top-5 mt-10">
                <div class="overflow-x-auto sm:mx-0.5 lg:mx-0.5 border-2">
                  <div class="py-2 inline-block  min-w-full sm:px-6 lg:px-8">
                    <div class="overflow-hidden">
                      <table class="min-w-full">
                        <thead class="bg-white border-b">
                          <tr>
                            <th
                              scope="col"
                              class="text-sm font-medium text-gray-900 px-4 py-4 text-left"
                            >
                              No.
                            </th>
                            <th
                              scope="col"
                              class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                            >
                              Product ID
                            </th>
                            <th
                              scope="col"
                              class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                            >
                              Item Description
                            </th>
                            <th
                              scope="col"
                              class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                            >
                              QTY
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr class="bg-gray-100 border-b">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              1
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              Mark
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              Otto
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              @mdo
                            </td>
                          </tr>
                          <tr class="bg-white border-b">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              2
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              Jacob
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              Dillan
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              @fat
                            </td>
                          </tr>
                          <tr class="bg-gray-100 border-b">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              3
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              Mark
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              Twen
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              @twitter
                            </td>
                          </tr>
                          <tr class="bg-white border-b">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              4
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              Bob
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              Dillan
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              @fat
                            </td>
                          </tr>
                          <tr class="bg-gray-100 border-b">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              5
                            </td>
                            <td
                              colspan="2"
                              class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center"
                            >
                              Larry the Bird
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                              @twitter
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/**Sign Section */}
              <div className="block mt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4>Received by:</h4>
                  </div>
                  <div className="relative right-5">
                    <h4>Expedition :</h4>
                  </div>
                  <div className=" text-end">
                    <h4>Tangereang,12/08/2023: </h4>
                    <h6>Warehouse</h6>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5">
                  <span className="w-[200px] mt-10 text-center  border-black border-t-4">
                    Signature
                  </span>
                  <span className="w-[200px] mt-10 text-center  border-black border-t-4">
                    Signature
                  </span>
                  <span className="w-[200px] mt-10 text-center  border-black border-t-4">
                    Warehouse
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Component;
