"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import RouteLayout from '../RouteLayout';

export default function Page() {
  // State untuk menyimpan nilai input
  const [formData, setFormData] = useState({
    productDescription: '',
    productNumber: '',
    productID: '',
    neckType: '',
    material: '',
    weight: '',
    volume: '',
    bottlesOfColi: '',
    coliOfBox: ''
  });

  // Mengupdate state ketika ada perubahan input
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  // Menangani pengiriman form
  const handleSubmit = (e) => {
    e.preventDefault();
    // Implementasikan logika pengiriman data form ke API atau server
    console.log('Form data submitted:', formData);
  };

  return (
    <RouteLayout>
      <div className="flex h-full p-5 flex-col bg-white text-left font-sans font-medium shadow-md">
        <div className='flex justify-between items-center mb-5'>
          <Link href="/databaseSKU">
            <button>
              <BiArrowBack className="cursor-pointer" size={"25px"} />
            </button>
          </Link>
          <h1 className='font-medium text-3xl'>Input New Data to Database</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="productDescription" className="block mb-2 text-sm font-medium text-gray-900">Product Description</label>
            <input
              type="text"
              id="productDescription"
              value={formData.productDescription}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter Product Description"
              required
            />
          </div>

          <div className="px-3 flex space-x-5">
            <div className="mb-5 w-1/2">
              <label htmlFor="productNumber" className="block mb-2 text-sm font-medium text-gray-900">Product Detail</label>
              <input
                type="text"
                id="productNumber"
                value={formData.productNumber}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Product Detail"
                required
              />
            </div>
            <div className="mb-5 w-1/2">
              <label htmlFor="productID" className="block mb-2 text-sm font-medium text-gray-900">Product ID</label>
              <input
                type="number"
                id="productID"
                value={formData.productID}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Product ID"
                required
              />
            </div>
          </div>

          <div className="px-3 flex space-x-5">
            <div className="mb-5 w-1/2">
              <label htmlFor="neckType" className="block mb-2 text-sm font-medium text-gray-900">Neck Type</label>
              <input
                type="text"
                id="neckType"
                value={formData.neckType}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Neck Type"
                required
              />
            </div>
            <div className="mb-5 w-1/2">
              <label htmlFor="material" className="block mb-2 text-sm font-medium text-gray-900">Material</label>
              <input
                type="text"
                id="material"
                value={formData.material}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Material"
                required
              />
            </div>
          </div>

          <div className="px-3 flex space-x-5">
            <div className="mb-5 w-1/2">
              <label htmlFor="weight" className="block mb-2 text-sm font-medium text-gray-900">Weight (gr)</label>
              <input
                type="number"
                id="weight"
                value={formData.weight}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter Weight"
                required
              />
            </div>
            <div className="mb-5 w-1/2">
              <label htmlFor="volume" className="block mb-2 text-sm font-medium text-gray-900">Volume (ml)</label>
              <input
                type="number"
                id="volume"
                value={formData.volume}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter Volume"
                required
              />
            </div>
          </div>

          <div className="px-3 flex space-x-5">
            <div className="mb-5 w-1/2">
              <label htmlFor="bottlesOfColi" className="block mb-2 text-sm font-medium text-gray-900"># Bottles / Coli</label>
              <input
                type="number"
                id="bottlesOfColi"
                value={formData.bottlesOfColi}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter Number of Bottles"
                required
              />
            </div>
            <div className="mb-5 w-1/2">
              <label htmlFor="coliOfBox" className="block mb-2 text-sm font-medium text-gray-900"># of Coli / Box</label>
              <input
                type="number"
                id="coliOfBox"
                value={formData.coliOfBox}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter Number of Coli"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="text-white h-[50px] mt-5 bg-blue-700 hover:bg-blue-600 outline-none focus:font-medium rounded-full text-sm px-5 py-2.5 text-center w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </RouteLayout>
  );
}
