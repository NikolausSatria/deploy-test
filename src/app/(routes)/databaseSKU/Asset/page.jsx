"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BsDatabaseFill, BsDatabaseAdd } from "react-icons/bs";
import { BiArrowBack } from "react-icons/bi";
import RouteLayout from "../../RouteLayout";

function Page() {
  const [sku, setSku] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 25;

  async function getSku(query, page) {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/asset?search=${query}&page=${page}&limit=${itemsPerPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const response = await res.json();
      setSku(response.assets);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to load db Asset:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getSku(searchQuery, currentPage);
  }, [searchQuery, currentPage]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    getSku(searchQuery, 1);
  };

  return (
    <RouteLayout>
      <div className="flex h-full p-5 flex-col bg-white text-left font-sans font-medium shadow-md">
        {/* Header Button */}
        <div className="flex justify-between items-center">
          <Link href="/databaseSKU">
            <button>
              <BiArrowBack className="cursor-pointer" size={"25px"} />
            </button>
          </Link>
          <h1 className="font-medium text-3xl">ASSET</h1>
          <Link href="/databaseSKU/Asset/AssetForm">
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
            ></input>
            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>
        {/* Categories Menubar */}
        <div className="flex flex-row-reverse">
          <nav className="relative z-0 inline-flex shadow-sm">
            <div className="flex justify-center items-center">
              <Link
                href="/databaseSKU/Product"
                className="-ml-px relative inline-flex items-center px-4 py-2 border rounded border-gray-300 bg-white text-sm leading-5 font-medium text-blue-700 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-tertiary active:text-gray-700 transition ease-in-out duration-200 hover:bg-blue-700 hover:text-white"
              >
                Product
              </Link>
              <Link
                href="/databaseSKU/Asset"
                className="-ml-px relative inline-flex items-center px-4 py-2 border rounded border-gray-300 bg-blue-700 text-sm leading-5 font-medium text-blue-700 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-tertiary active:text-gray-700 transition ease-in-out duration-200 text-white"
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
            {/* Head table */}
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Asset Number
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Material Type
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Material Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : Array.isArray(sku) && sku.length > 0 ? (
                sku.map((item, index) => (
                  <tr key={`${item.material_id}-${index}`}>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      #{item.material_id}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {item.asset_number}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {item.material_type}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {item.material_description}
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
      </div>
    </RouteLayout>
  );
}

export default Page;
