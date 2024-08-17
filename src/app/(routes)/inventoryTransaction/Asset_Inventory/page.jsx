"use client";
import React, { useState, useEffect } from "react";
import { BsDownload } from "react-icons/bs";
import Link from "next/link";
import Popup from "../Popup";
import RouteLayout from "../../RouteLayout";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function AssetInventoryTransaction() {
  const [buttonPopup, setbuttonPopup] = useState(false);
  const [asset_inventory, setAssetInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 25;

  useEffect(() => {
    if (searchQuery.length === 0 || searchQuery.length > 2) {
      getInventory(searchQuery, currentPage);
    }
  }, [searchQuery, currentPage]);

  const getInventory = async (query, page) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/assetInventory?search=${query}&page=${page}&limit=${itemsPerPage}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const response = await res.json();
      setAssetInventory(response.asset_inventory);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to load Asset Inventory Transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    getInventory(searchQuery, 1);
  };

  const downloadCompleteInventory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/assetInventory?allData=true`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.status === 200) {
        createPdf(data.asset_inventory);
      } else {
        console.error("Failed to download asset inventory data:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch asset inventory data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPdf = (data) => {
    const doc = new jsPDF();
    const tableColumns = ["No", "ID", "Description", "Type", "Quantity"];
    const tableRows = data.map((item, index) => [
      index + 1,
      item.id,
      item.description,
      item.type,
      item.qty.toString(),
    ]);

    doc.text("Asset Transaction Report", 14, 15);
    autoTable(doc, { startY: 20, head: [tableColumns], body: tableRows });
    doc.save('asset_transaction_report.pdf');
  };

  return (
    <RouteLayout>
      <div className="flex w-[75rem] h-full p-5 flex-col bg-white text-left font-sans font-medium shadow-md">
        <h1 className="font-medium text-4xl">ASSET INVENTORY TRANSACTION</h1>

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
              placeholder="Search Inventory by Name"
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
                href="/inventoryTransaction/Product_Inventory"
                className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium text-blue-600 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-tertiary transition ease-in-out duration-200 hover:bg-blue-700 hover:text-white active:text-white"
              >
                Product
              </Link>
              <Link
                href="/inventoryTransaction/Asset_Inventory"
                className="-ml-px relative inline-flex items-center px-4 py-2 border rounded border-gray-300 bg-blue-700 text-sm leading-5 font-medium text-white focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-tertiary transition ease-in-out duration-200 hover:bg-blue-700 hover:text-white active:text-white"
              >
                Asset
              </Link>
              <Link
                href="/inventoryTransaction/Material_Inventory"
                className="-ml-px relative inline-flex items-center px-4 py-2 border rounded border-gray-300 text-sm leading-5 font-medium text-blue-600 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-blue transition ease-in-out duration-200 hover:bg-blue-700 hover:text-white active:text-white"
              >
                Material
              </Link>
            </div>
          </nav>
        </div>

        {/* the pop Up download menu */}
        <Popup trigger={buttonPopup} setTrigger={setbuttonPopup}></Popup>

        {/* Main Page Container */}
        <div className="justify-center items-center min-w-[800px] max-h-screen shadow bg-white shadow-dashboard px-4 pt-5 mt-4 rounded-bl-lg rounded-br-lg overflow-y-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Description
                </th>
                <th className="px-7 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 text-blue-500 tracking-wider">
                  Type
                </th>
                <th className="px-7 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 text-blue-500 tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300"></th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">Loading...</td>
                </tr>
              ) : asset_inventory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">No data available</td>
                </tr>
              ) : (
                asset_inventory.map((inventory, index) => (
                  <tr key={inventory.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-no-wrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm text-gray-500">
                      {inventory.id}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm text-gray-500">
                      {inventory.description}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm text-gray-500 text-center">
                      {inventory.type}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm text-gray-500 text-center">
                      {inventory.qty}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm text-gray-500">
                      <button
                        onClick={() => setbuttonPopup(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Download Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={downloadCompleteInventory}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Download PDF
              <BsDownload className="inline ml-2" />
            </button>
          </div>
        </div>
      </div>
    </RouteLayout>
  );
}

export default AssetInventoryTransaction;
