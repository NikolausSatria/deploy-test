import React from 'react'
import RouteLayout from '../RouteLayout'
import Image from 'next/image'
import HakedoLogoLetter from '../images/Hakedologo.png'

{/* Surat Jalan template section*/}
function page() {

  const deliveryData = {
    sender: {
      companyName: "PT. Hakedo Putra Mandiri",
      address: "Jalan Raya Perancis, Komp. Perg. Ocean Park Kav. 38 Blok HF Tangerang, Banten, 15213, Indonesia",
      phone: "+622152395563",
      email: "info@hakedoputramandiri.com",
    },
    recipient: {
      companyName: "PT. Tirta Alkalindo",
      address: "Jl. Lurah Namat No. 06, RT002/RW006, Kelurahan Jatirangga, Kecamatan Jatisampurna, Kabupaten Bekasi, Provinsi Jawa Barat, 17434.",
      attn: "Raymond Leonardo",
      phone: "+6281272888866",
    },
    deliveryDetails: {
      dn: "1058-12/SD/HPM/2023",
      date: "12 October 2023",
      po: "PEM/TA/09-2023/05-01",
      so: "500117",
      customerId: "10012",
      licensePlate: "B 9249 XO",
    },
    tableInfo: {
      productId: 72110005,
      itemDescription: "Botol Eternal Plus LN 30/25mm; 500ml; PET; 27gr; Natural",
      qty: 43200,
      uom: "pcs"
    }
  };

  return (
    <RouteLayout>
         <div className="flex h-full w-auto p-5 flex-col bg-white text-left font-sans font-medium shadow-md">
            <div className="flex justify-between items-center">
                <h1 className="font-medium text-4xl">Letter of Shipping</h1>
            </div>

            <div className="bg-white shadow-md rounded px-8 pt-4 pb-5 mb-4 flex flex-col my-2 border-2 border-blue-500">
            <div className="-mx-3 md:flex mb-6 flex flex-1">
                {/* Head letter container */}
                <div className="w-1/2 px-3">
                  <div className="space-y-3">
                    {/* Head letter */}
                    <h3 className="font-medium">PT Hakedo Putra Mandiri</h3>
                    <h6 className="max-w-xs">
                      Jalan Raya Perancis, Komp. Perg. Ocean Park Kav. 38 Blok HF
                      Tangerang, Banten, 15213, Indonesia
                    </h6>
                    <h5>Phone: +622152395563</h5>
                    <h5>Email: info@hakedoputramandiri.com</h5>
                  </div>
                </div>
                {/* Logo container */}
                <div className="w-1/2 px-3 flex justify-end items-start">
                  <Image
                    src={HakedoLogoLetter}
                    width={350} // Set the width to 350px
                    height={350} // Set the height to 350px
                    alt="PT Hakedo Putra Mandiri Logo"
                  />
                </div>
              </div>
            {/* Delivery Details Section */}
            <div className="block">
              <h1 className="flex justify-center">DELIVERY NOTE</h1>

               <div className="flex justify-around">
                  <div className="w-1/2">
                    <table>
                      <h4>PT. Tirta Alkalindo</h4>
                      <h5 className='max-w-xs'>
                        Jl. Lurah Namat No. 06, RT002/RW006,
                        Kelurahan Jatirangga, Kecamatan
                        Jatisampurna, Kabupaten Bekasi,
                        Provinsi Jawa Barat, 17434.
                      </h5>
                      <h4>Attn : Raymond Leonardo</h4>
                      <h4>Phone : +6281272888866</h4>
                  </table>
               </div>

                <div className="w-1/2 space-y-2  text-right">
                    <h2>Delivery No : 1058-12/SD/HPM/2023</h2>
                    <h2>Delivery Date : 12 November 2023</h2>
                    <h3>PO No.: PEM/TA/09-2023/05-01</h3>
                    <h3>SO No. : 500117</h3>
                    <h2>Customer ID : 10012</h2>
                    <h3>Lisence Plate No. : B 9249 XO</h3>
                 </div>
              </div>
          </div>


              <div className='table top-5 mt-10'>
                <div class="overflow-x-auto sm:mx-0.5 lg:mx-0.5 border-2">
                  <div class="py-2 inline-block  min-w-full sm:px-6 lg:px-8">
                    <div class="overflow-hidden">
                      <table class="min-w-full">
                        <thead class="bg-white border-b">
                          <tr>
                            <th scope="col" class="text-sm font-medium text-gray-900 px-4 py-4 text-left">
                              No.
                            </th>
                            <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                              Product ID
                            </th>
                            <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                              Item Description
                            </th>
                            <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                              QTY
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr class="bg-gray-100 border-b">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1</td>
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
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2</td>
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
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">3</td>
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
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">4</td>
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
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">5</td>
                            <td colspan="2" class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">
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
            <div className='block mt-5'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h4>Received by:</h4>
                  </div>
                  <div className='relative right-5'>
                    <h4>Expedition :</h4>
                  </div>
                  <div className=' text-end'>
                      <h4>Tangereang,12/08/2023: </h4>
                      <h6>Warehouse</h6>
             
                  </div>
               
                  </div>

                  <div className='flex items-center justify-between mt-5'>
                      <span className='w-[200px] mt-10 text-center  border-black border-t-4'>Signature</span>
                      <span className='w-[200px] mt-10 text-center  border-black border-t-4'>Signature</span>
                      <span className='w-[200px] mt-10 text-center  border-black border-t-4'>Warehouse</span>
                  </div>
           
            </div>
          </div>
          
          {/** Page Copy */}

            <div className="bg-white shadow-md rounded px-8 pt-4 pb-5 mb-4 flex flex-col my-2 border-2 border-blue-500">
            <div className="-mx-3 md:flex mb-6 flex flex-1">
                {/* Head letter container */}
                <div className="w-1/2 px-3">
                  <div className="space-y-3">
                    {/* Head letter */}
                    <h3 className="font-medium">PT Hakedo Putra Mandiri</h3>
                    <h6 className="max-w-xs">
                      Jalan Raya Perancis, Komp. Perg. Ocean Park Kav. 38 Blok HF
                      Tangerang, Banten, 15213, Indonesia
                    </h6>
                    <h5>Phone: +622152395563</h5>
                    <h5>Email: info@hakedoputramandiri.com</h5>
                  </div>
                </div>
                {/* Logo container */}
                <div className="w-1/2 px-3 flex justify-end items-start">
                  <Image
                    src={HakedoLogoLetter}
                    width={350} // Set the width to 350px
                    height={350} // Set the height to 350px
                    alt="PT Hakedo Putra Mandiri Logo"
                  />
                </div>
              </div>
            {/* Delivery Details Section */}
            <div className="block">
              <h2 className="flex justify-center">Delivery Note</h2>

               <div className="flex justify-around">
                  <div className="w-1/2">
                    <table>
                      <h4>PT. Tirta Alkalindo</h4>
                      <h5 className='max-w-xs'>
                        Jl. Lurah Namat No. 06, RT002/RW006,
                        Kelurahan Jatirangga, Kecamatan
                        Jatisampurna, Kabupaten Bekasi,
                        Provinsi Jawa Barat, 17434.
                      </h5>
                      <h4>Attn : Raymond Leonardo</h4>
                      <h4>Phone : +6281272888866</h4>
                  </table>
               </div>

                <div className="w-1/2 space-y-2  text-right">
                    <h2>Delivery No :</h2>
                    <p>'1058-12/SD/HPM/2023</p>
                    <h2>Delivery Date :</h2>
                    <p>12 November 2023</p>
                    <h3>PO No.: PEM/TA/09-2023/05-01</h3>
                    <h3>SO No. : 500117</h3>
                    <h2>Customer ID : 10012</h2>
                    <h3>Lisence Plate No. : </h3>
                    <p>B 9249 XO</p>
                 </div>
              </div>
          </div>


              <div className='table top-5 mt-10'>
                <div class="overflow-x-auto sm:mx-0.5 lg:mx-0.5 border-2">
                  <div class="py-2 inline-block  min-w-full sm:px-6 lg:px-8">
                    <div class="overflow-hidden">
                      <table class="min-w-full">
                        <thead class="bg-white border-b">
                          <tr>
                            <th scope="col" class="text-sm font-medium text-gray-900 px-4 py-4 text-left">
                              No.
                            </th>
                            <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                              Product ID
                            </th>
                            <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                              Item Description
                            </th>
                            <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                              QTY
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr class="bg-gray-100 border-b">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1</td>
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
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2</td>
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
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">3</td>
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
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">4</td>
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
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">5</td>
                            <td colspan="2" class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-center">
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
            <div className='block mt-5'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h4>Received by:</h4>
                  </div>
                  <div className='relative right-5'>
                    <h4>Expedition :</h4>
                  </div>
                  <div className=' text-end'>
                      <h4>Tangereang,12/08/2023: </h4>
                      <h6>Warehouse</h6>
             
                  </div>
               
                  </div>

                  <div className='flex items-center justify-between mt-5'>
                      <span className='w-[200px] mt-10 text-center  border-black border-t-4'>Signature</span>
                      <span className='w-[200px] mt-10 text-center  border-black border-t-4'>Signature</span>
                      <span className='w-[200px] mt-10 text-center  border-black border-t-4'>Warehouse</span>
                  </div>
           
            </div>
          </div>

        </div>


          


          

      
    </RouteLayout>
  )
}

export default page