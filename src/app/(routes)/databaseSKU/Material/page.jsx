"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import { BsDatabaseAdd } from "react-icons/bs";
import RouteLayout from "../../RouteLayout";

function Material() {
  const [sku_material, setSku] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 25;

  async function getSku(query, page) {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/material?search=${query}&page=${page}&limit=${itemsPerPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const response = await res.json();
      setSku(response.materials);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to load materials:", error);
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
    setCurrentPage(1); // Reset to the first page on search
    getSku(searchQuery, 1);
  };

  return (
    <RouteLayout>
      <div className="flex flex-col h-full p-5 bg-white font-sans text-left shadow-md">
        {/* Header Button */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/databaseSKU">
            <button>
              <BiArrowBack className="cursor-pointer" size="25px" />
            </button>
          </Link>
          <h1 className="text-3xl font-medium text-center flex-1">MATERIAL</h1>
          <Link href="/databaseSKU/Material/MaterialForm">
            <button>
              <BsDatabaseAdd size="30px" className="cursor-pointer" />
            </button>
          </Link>
        </div>

        {/* Search Bar */}
        <form className="mb-6" onSubmit={handleSearch}>
          <div className="relative">
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 pl-10 text-sm border border-gray-700 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search Inventory by Name or ID"
              value={searchQuery}
              onChange={handleSearchChange}
              required
            />
            <button
              type="submit"
              className="absolute right-2.5 bottom-2.5 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Search
            </button>
          </div>
        </form>

        {/* Categories Menu */}
        <nav className="flex justify-center space-x-4 mb-6">
          <Link
            href="/databaseSKU/Product"
            className="px-4 py-2 text-sm font-medium text-blue-700 border border-gray-300 rounded hover:bg-blue-700 hover:text-white transition duration-200"
          >
            Product
          </Link>
          <Link
            href="/databaseSKU/Asset"
            className="px-4 py-2 text-sm font-medium text-blue-700 border border-gray-300 rounded hover:bg-blue-700 hover:text-white transition duration-200"
          >
            Asset
          </Link>
          <Link
            href="/databaseSKU/Material"
            className="px-4 py-2 text-sm font-medium text-blue-700 border border-gray-300 rounded hover:bg-blue-700 hover:text-white transition duration-200"
          >
            Material
          </Link>
        </nav>

        {/* Table */}
        <div className="flex-grow overflow-y-auto shadow rounded-lg">
          <table className="min-w-full bg-white">
            {/* Head table */}
            <thead>
              <tr className="border-b border-gray-300">
                <th className="px-4 py-3 text-left text-sm font-medium text-blue-500">
                  No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-blue-500">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-blue-500">
                  Material Description
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-blue-500">
                  Material Type
                </th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : Array.isArray(sku_material) && sku_material.length > 0 ? (
                sku_material.map((material, index) => (
                  <tr key={`${material.material_id}-${index}`}>
                    <td className="px-4 py-3 text-left text-sm font-medium text-blue-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3 text-left text-sm font-medium text-blue-500">
                      #{material.material_id}
                    </td>
                    <td className="px-4 py-3 text-left text-sm font-medium text-blue-500">
                      {material.material_description}
                    </td>
                    <td className="px-4 py-3 text-left text-sm font-medium text-blue-500">
                      {material.material_type}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
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

export default Material;
