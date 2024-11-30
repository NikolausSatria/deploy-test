"use client"
import React from 'react'
import Link from 'next/link'
import { useState } from 'react'
import RouteLayout from '../RouteLayout'



function page() {

  const [logoutButton, setLogoutbutton] = useState(false);

  return (
    <RouteLayout>
        {/* the container div */}
        <div className="flex h-full p-5 flex-col bg-white text-left font-sans font-medium shadow-md">
          <h1 className='sm:text-lg md:text-2xl lg:text-4xl text font-medium'>Dashboard</h1>
          <div className="justify-center items-center max-h-screen shadow bg-white shadow-dashboard px-4 pt-5 mt-4 rounded-bl-lg rounded-br-lg overflow-x-scroll">
            <table className="min-w-full ">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">No</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">ID</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Name</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Admin</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Status</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Stock</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300"></th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr>
                  <td className="px-6 py-4 md:px-4 md:py-2 whitespace-no-wrap border-b border-gray-500">
                    <div className="">
                        <div className="text-sm leading-5 text-center text-gray-800">8</div>
                    </div>
                  </td>

                  <td className="px-6 py-4 md:px-4 md:py-2  whitespace-no-wrap border-b border-gray-500">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm leading-5 text-gray-800">#234</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4  whitespace-no-wrap border-b border-gray-500">
                    <div className="text-sm leading-5 text-blue-900">Damilare Anjorin</div>
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">damilareanjorin1@gmail.com</td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <span className="relative inline-block font-semibold text-left text-orange-900 leading-tight">
                      <span className="relative text-xs">OUT-EXT</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-blue-900 text-sm leading-5">September 12</td>
                  {/*Stock available */}
                  <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                    <span className="relative inline-block px-3 py-1 font-semibold leading-tight">
                      <span aria-hidden className="absolute inset-0opacity-50 rounded-full"></span>
                      <span className="relative text-xs">200</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <Link href={"/detailPage"}>
                      <button className="px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">View Details</button>
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
    </RouteLayout>


  )
}

export default page