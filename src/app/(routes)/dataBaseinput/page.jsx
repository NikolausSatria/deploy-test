import Link from 'next/link'
import React from 'react'
import {BiArrowBack} from 'react-icons/bi'
import RouteLayout from '../RouteLayout'

function page() {
  return (
        <RouteLayout>
            <div className="flex h-full p-5 flex-col bg-white text-left font-sans font-medium shadow-md">
                <div className='flex justify-between items-center'>
                    <Link href={"/databaseSKU"}>
                            <button>
                                <BiArrowBack className="cursor-pointer" size={"25px"}/>
                            </button>
                    </Link>
                    <h1 className='font-medium text-3xl'>Input new Data to Database</h1>
                </div>
                 
            {/** form input container Product Description*/}
            <div className="mb-6">
                <label htmlFor="productDescription" className="block mb-2 text-sm font-medium text-gray-900">Product Description</label>
                <input type="text" id="productDescription" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Product Description" required/>
            </div> 

                <div className="px-3 flex space-x-5">
                    {/* Product Detail */}
                    <div className="mb-5 w-1/2">
                        <label htmlFor="productNumber" className="block mb-2 text-sm font-medium text-gray-900">Product Detail</label>
                        <input type="text" id="productNumber" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Product Detail" required/>
                    </div>  
                    {/* Product ID*/}
                    <div className="mb-5 w-1/2">
                        <label htmlFor="productID" className="block mb-2 text-sm font-medium text-gray-900">Product ID</label>
                        <input type="number" id="productID" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Product Detail" required/>
                     </div>
                </div>

                <div className="px-3 flex space-x-5">
                    {/* Neck Type */}
                    <div className="mb-5 w-1/2">
                        <label htmlFor="neckType" className="block mb-2 text-sm font-medium text-gray-900">Neck Type</label>
                        <input type="text" id="neckType" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Neck Type" required/>
                    </div>  
                    {/* Material*/}
                    <div className="mb-5 w-1/2">
                        <label htmlFor="material" className="block mb-2 text-sm font-medium text-gray-900">Material</label>
                        <input type="text" id="material" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Material" required/>
                     </div>
                </div>
                <div className="px-3 flex space-x-5">
                    {/* Neck Type */}
                    <div className="mb-5 w-1/2">
                        <label htmlFor="Weight" className="block mb-2 text-sm font-medium text-gray-900">Weight(gr)</label>
                        <input type="number" id="Weight" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Weight" required/>
                    </div>  
                    {/* Material*/}
                    <div className="mb-5 w-1/2">
                        <label htmlFor="productMaterial" className="block mb-2 text-sm font-medium text-gray-900">Volume(ml)</label>
                        <input type="number" id="productMaterial" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Volume" required/>
                     </div>
                </div>
                <div className="px-3 flex space-x-5">
                    {/* #Bottles / Coli*/}
                    <div className="mb-5 w-1/2">
                        <label htmlFor="BottlesofColi" className="block mb-2 text-sm font-medium text-gray-900"># Bottles / Coli</label>
                        <input type="number" id="BottlesofColi" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Weight" required/>
                    </div>  
                    {/* Coli / BOX*/}
                    <div className="mb-5 w-1/2">
                        <label htmlFor="ColiofBox" className="block mb-2 text-sm font-medium text-gray-900"># of Coli / Box</label>
                        <input type="number" id="ColiofBox" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Volume" required/>
                     </div>
                </div>
            
                {/* Three options for Data inventory */}
                   {/* Submit button */}
                   <Link href={"/Confirmpage"} passHref>
                            <button type="button" className="text-white h-[50px] mt-5 bg-blue-700 hover:bg-blue-600 outline-none focus:font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb- w-full">Submit</button>
                     </Link>
           </div>
        </RouteLayout>
  )
}

export default page