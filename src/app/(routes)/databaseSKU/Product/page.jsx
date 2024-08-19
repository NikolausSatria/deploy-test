"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import { BsDatabaseAdd } from "react-icons/bs";
import RouteLayout from "../../RouteLayout";

function DatabaseSku() {
  const [skuProduct, setSkuProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 25;

  const getSku = useCallback(async (query, page) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/product?search=${query}&page=${page}&limit=${itemsPerPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const response = await res.json();
      console.log("API Response:", response); // Tambahkan log ini
      setSkuProduct(
        Array.isArray(response.sku_product) ? response.sku_product : []
      );
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error("Failed to load db Product:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchQuery.length === 0 || searchQuery.length > 2) {
      getSku(searchQuery, currentPage);
    }
  }, [searchQuery, currentPage, getSku]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    getSku(searchQuery, currentPage);
  };

  return (
    <RouteLayout>
      <div className="flex h-full p-5 flex-col bg-white text-left font-sans font-medium shadow-md">
        {/*Header Button */}
        <div className="flex justify-between items-center">
          <Link href="/databaseSKU">
            <button>
              <BiArrowBack className="cursor-pointer" size={"25px"} />
            </button>
          </Link>
          <h1 className="font-medium text-3xl">Product</h1>
          <Link href="/databaseSKU/Product/ProductForm">
            <button>
              <BsDatabaseAdd size={"30px"} className="cursor-pointer" />
            </button>
          </Link>
        </div>
        {/* Search Bar container */}
        <form className="p-7" onSubmit={handleSearch}>
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-700 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search Inventory by Name or ID"
              value={searchQuery}
              onChange={handleSearchChange}
              required
            />
            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>
        {/*Categories Menubar */}
        <div className="flex flex-row-reverse">
          <nav className="relative z-0 inline-flex shadow-sm">
            <div className="flex justify-center items-center">
              <Link
                href="/databaseSKU/Product"
                className="-ml-px relative inline-flex items-center px-4 py-2 border rounded border-gray-300 bg-blue-700 text-sm leading-5 font-medium text-white focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-tertiary transition ease-in-out duration-200 active:text-white"
              >
                Product
              </Link>
              <Link
                href="/databaseSKU/Asset"
                className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-blue-600 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-tertiary active:text-gray-700 transition ease-in-out duration-200 hover:bg-blue-700 hover:text-white"
              >
                Asset
              </Link>
              <Link
                href="/databaseSKU/Material"
                className="-ml-px relative inline-flex items-center px-4 py-2 border rounded border-gray-300 bg-white text-sm leading-5 font-medium text-blue-600 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-tertiary active:text-gray-700 transition ease-in-out duration-200 hover:bg-blue-700 hover:text-white"
              >
                Material
              </Link>
            </div>
          </nav>
        </div>

        <div className="justify-center items-center max-w-full max-h-screen shadow bg-white shadow-dashboard px-4 pt-5 mt-4 rounded-bl-lg rounded-br-lg overflow-y-auto overflow-x">
          <table className="min-w-full">
            {/*Head table */}
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  ID
                </th>
                <th className="px-7 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Product Description
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Neck Type
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Material
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Volume(ml)
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Weight(gr)
                </th>
                <th className="px-8 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Color
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Bottles/Coli
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Box/Coli
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Qty/Coli
                </th>
              </tr>
            </thead>
            {/*Table Body */}
            <tbody className="bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="11" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : Array.isArray(skuProduct) && skuProduct.length > 0 ? (
                skuProduct.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {item.product_description}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {item.neck_type}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {item.material}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {item.volume}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {item.weight}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {item.color}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {item.bottles_per_coli}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {item.coli_per_box}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {item.uom}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center py-4">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() =>
              setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
            }
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-700 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-700 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div> j
    </RouteLayout>
  );
}

export default DatabaseSku;
