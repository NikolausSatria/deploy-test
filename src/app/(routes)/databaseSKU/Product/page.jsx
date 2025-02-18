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
      <div className="flex flex-col h-full p-5 bg-white font-sans text-left shadow-md">
        {/*Header Button */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/databaseSKU">
            <button>
              <BiArrowBack className="cursor-pointer" size={"25px"} />
            </button>
          </Link>
          <h1 className="text-3xl font-medium text-center flex-1">PRODUCT</h1>
          <Link href="/databaseSKU/Product/ProductForm">
            <button>
              <BsDatabaseAdd size={"30px"} className="cursor-pointer" />
            </button>
          </Link>
        </div>

        {/* Search Bar container */}
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
            {/*Head table */}
            <thead>
              <tr className="border-b border-gray-300">
                <th className="px-2 py-3 text-left text-sm text-blue-500">
                  No
                </th>
                <th className="px-2 py-3 text-left text-sm text-blue-500">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-sm text-blue-500">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-sm text-blue-500">
                  Neck Type
                </th>
                <th className="px-4 py-3 text-left text-sm text-blue-500">
                  Material
                </th>
                <th className="px-4 py-3 text-left text-sm text-blue-500">
                  Volume(ml)
                </th>
                <th className="px-4 py-3 text-left text-sm text-blue-500">
                  Weight(gr)
                </th>
                <th className="px-4 py-3 text-left text-sm text-blue-500">
                  Color
                </th>
                <th className="px-4 py-3 text-left text-sm text-blue-500">
                  Bottles/Coli
                </th>
                <th className="px-4 py-3 text-left text-sm text-blue-500">
                  Box/Coli
                </th>
                <th className="px-4 py-3 text-left text-sm text-blue-500">
                  uom
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
                  <tr key={`${item.id}-${index}`} className="border-b border-gray-300">
                    <td className="px-2 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-2 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {item.product_id}
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {item.product_description}
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {item.neck_type}
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {item.material}
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {item.volume}
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {item.weight}
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {item.color}
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {item.bottles_per_coli}
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                      {item.coli_per_box}
                    </td>
                    <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
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
      </div>
    </RouteLayout>
  );
}

export default DatabaseSku;
