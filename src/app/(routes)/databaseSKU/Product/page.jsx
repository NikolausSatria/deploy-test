"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import { BsDatabaseAdd } from "react-icons/bs";
import RouteLayout from "../../RouteLayout";

function DatabaseSku() {
  const [sku_product, setSkuProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 25;

  async function getSku(query, page) {
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
      console.log(response.sku_product);
      setSkuProduct(response.sku_product);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to load db Product:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (searchQuery.length === 0 || searchQuery.length > 2) {
      getSku(searchQuery, currentPage);
    }
  }, [searchQuery, currentPage]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    getSku(searchQuery);
  };
  return (
    <RouteLayout>
      <div className="flex h-full p-5 flex-col bg-white text-left font-sans font-medium shadow-md">
        {/*Header Button */}
        <div className="flex justify-between items-center">
          <Link href={"/databaseSKU"}>
            <button>
              <BiArrowBack className="cursor-pointer" size={"25px"} />
            </button>
          </Link>
          <h1 className="font-medium text-3xl">Product</h1>
          <Link href={"databaseSKU/Product/ProductForm"}>
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
        {/*Categories Menubar */}
        <div className="flex flex-row-reverse">
          <nav className="relative z-0 inline-flex shadow-sm ">
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

        <div className="justify-center items-center  max-w-full max-h-screen shadow bg-white shadow-dashboard px-4 pt-5 mt-4 rounded-bl-lg rounded-br-lg overflow-y-auto overflow-x">
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
                  UOM
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300"></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                sku_product.map((item, index) => {
                  return (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-center">
                        <div>
                          <div className="text-sm leading-5 text-gray-800">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-center">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm leading-5 text-gray-800">
                              #{item.product_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Product Description*/}
                      <td className="px-7 py-4 whitespace-no-wrap border-b border-gray-500">
                        <div className="text-sm leading-5 text-blue-900">
                          {item.product_description}
                        </div>
                      </td>
                      {/* Neck Type */}
                      <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                        {item.neck_type}
                      </td>
                      {/*Material type */}
                      <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5 text-center">
                        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                          <span className="relative text-xs">
                            {item.material}
                          </span>
                        </span>
                      </td>
                      {/* Volume */}
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-blue-900 text-sm leading-5 text-center">
                        {item.volume}
                      </td>
                      {/*Weight */}
                      <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5 text-center">
                        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                          <span className="relative text-xs">
                            {item.weight}
                          </span>
                        </span>
                      </td>
                      {/**Color Material */}
                      <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5 text-center">
                        {item.color}
                      </td>
                      {/*bottle/coli */}
                      <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5 text-center">
                        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                          <span className="relative text-xs">
                            {item.bottles_per_coli}
                          </span>
                        </span>
                      </td>
                      {/*Box/coli */}
                      <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5 text-center">
                        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                          <span className="relative text-xs">
                            {item.coli_per_box}
                          </span>
                        </span>
                      </td>
                      {/*UOM */}
                      <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5 text-center">
                        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                          <span className="relative text-xs">
                          {item.uom}
                          </span>
                        </span>
                      </td>
                      {/*Just a line */}
                      <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Footer Information */}
          <div className="sm:flex-1 sm:flex sm:items-center sm:justify-between mt-4 work-sans">
            {/* <div>
                <p className="text-sm leading-5 gap-1 flex text-blue-700">
                  Showing
                  <span className="font-medium">1</span>
                  to
                  <span className="font-medium">200</span>
                  of
                  <span className="font-medium">2000</span>
                  results
                </p>
              </div> */}
            <div>
            <nav className="relative z-0 inline-flex shadow-sm pb-5 pt-5">
                <div className="flex justify-center items-center">
                  {currentPage > 1 && (
                    <button
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
                      onClick={() => setCurrentPage((current) => current - 1)}
                    >
                      Previous
                    </button>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        className={`-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 transition ease-in-out duration-150 ${
                          page === currentPage
                            ? "bg-blue-500 text-white" // Ini menandai halaman saat ini
                            : "bg-white text-blue-700 hover:bg-blue-50"
                        }`}
                        key={page}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    )
                  )}

                  {currentPage < totalPages && (
                    <button
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
                      onClick={() => setCurrentPage((current) => current + 1)}
                    >
                      Next
                    </button>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </RouteLayout>
  );
}

export default DatabaseSku;
