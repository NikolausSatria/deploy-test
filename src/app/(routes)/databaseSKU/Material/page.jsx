"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import { BsDatabaseAdd } from "react-icons/bs";
import RouteLayout from "../../RouteLayout";
import { usePathname } from "next/navigation";

function Material() {
  const pathname = usePathname();

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
      <div className="flex flex-col h-full p-6 bg-white shadow-md rounded-lg">
        {/* Header Button */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/databaseSKU">
            <button>
              <BiArrowBack className="cursor-pointer" size="25px" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 text-center flex-1">
            MATERIAL
          </h1>
          <Link href="/databaseSKU/Material/MaterialForm">
            <button>
              <BsDatabaseAdd size="30px" className="cursor-pointer" />
            </button>
          </Link>
        </div>

        {/* Search and Categories */}
        <form className="mb-4 space-y-4" onSubmit={handleSearch}>
          {/* Search Bar */}
          <div className="flex items-center space-x-2">
            <input
              type="search"
              className="flex-1 p-3 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search Inventory by Name"
              value={searchQuery}
              onChange={handleSearchChange}
              required
            />
            <button
              type="submit"
              className="px-5 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
          </div>

          {/* Categories on the Right */}
          <div className="flex justify-between items-center">
            <div></div> {/* Categories on the Right */}
            <div className="flex justify-end space-x-2">
              {[
                {
                  label: "Product",
                  href: "/databaseSKU/Product",
                },
                {
                  label: "Asset",
                  href: "/databaseSKU/Asset",
                },
                {
                  label: "Material",
                  href: "/databaseSKU/Material",
                },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className={`px-4 py-2 border rounded-lg ${
                    pathname === href
                      ? "bg-blue-700 text-white"
                      : "text-blue-600 hover:bg-blue-700 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </form>

        {/* Table */}
        <div className="overflow-auto rounded-lg shadow mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-100 text-blue-700">
                {["No", "ID", "Material Description", "Material Type"].map(
                  (heading) => (
                    <th key={heading} className="px-4 py-3 border-b">
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="bg-white divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : Array.isArray(sku_material) && sku_material.length > 0 ? (
                sku_material.map((material, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-4 py-3">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3">#{material.material_id}</td>
                    <td className="px-4 py-3">
                      {material.material_description}
                    </td>
                    <td className="px-4 py-3">{material.material_type}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
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
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
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
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </RouteLayout>
  );
}

export default Material;
