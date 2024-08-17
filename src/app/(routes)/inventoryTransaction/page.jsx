"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BsDownload } from "react-icons/bs";
import Popup from "./Popup";
import RouteLayout from "../RouteLayout";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function InventoryTransaction({ item }) {
  const router = useRouter();

  const [buttonPopup, setbuttonPopup] = useState(false);
  const [inventory, setInventory] = useState([]);
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

  async function getInventory(query, page) {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/inventory?search=${query}&page=${page}&limit=${itemsPerPage}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const response = await res.json();
      setInventory(response.inventory);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to load dbSku:", error);
    } finally{
      setIsLoading(false);
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    getInventory(searchQuery);
  };

  const handleDetails = (item) => {
    router.push(`/inventoryTransaction/details/page?id=${item}`);
  };

  async function downloadCompleteInventory() {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/inventory?allData=true`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.status === 200) {
        createPdf(data.inventory);
      } else {
        console.error("Failed to download complete inventory data:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch complete inventory data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function createPdf(data) {
    const doc = new jsPDF();
    const tableColumns = ["No", "ID", "Description", "Type", "Quantity"];
    const tableRows = data.map((item, index) => [
      index + 1,
      item.id,
      item.description,
      item.type,
      item.qty.toString(),
    ]);
  
    doc.text("Inventory Transaction Report", 14, 15);
    autoTable(doc, { startY: 20, head: [tableColumns], body: tableRows });
    doc.save('inventory_transaction_report.pdf');
  }

  return (
    <RouteLayout>
      <div className="flex w-full h-full p-5 flex-col bg-white text-left font-sans font-medium shadow-md">
        <h1 className="font-medium text-4xl">INVENTORY TRANSACTION</h1>
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
              <a
                href="/inventoryTransaction/Product_Inventory"
                className="-ml-px relative inline-flex items-center px-4 py-2 border rounded border-gray-300 bg-white text-sm leading-5 font-medium text-blue-700 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-tertiary active:text-gray-700 transition ease-in-out duration-200 hover:bg-blue-700 hover:text-white"
              >
                Product
              </a>
              <a
                href="/inventoryTransaction/Asset_Inventory"
                className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-blue-600 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-tertiary active:text-gray-700 transition ease-in-out duration-200 hover:bg-blue-700 hover:text-white"
              >
                Asset
              </a>
              <a
                href="/inventoryTransaction/Material_Inventory"
                className="-ml-px relative inline-flex items-center px-4 py-2 border rounded border-gray-300 bg-white text-sm leading-5 font-medium text-blue-600 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-tertiary active:text-gray-700 transition ease-in-out duration-200 hover:bg-blue-700 hover:text-white"
              >
                Material
              </a>
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
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 text-blue-500 tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300"></th>
                <th className="px-6 py-3 border-b-2 border-gray-300"></th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {/* Number */}
              { isLoading ? (
                  <p>Loading...</p>
                ) : 
                (inventory.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="flex  justify-center items-center">
                        <div>
                          <div className="text-sm leading-5 text-gray-800">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/*ID */}
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm leading-5 text-gray-800">
                            #{item.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Description */}
                    <td className="px-7 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="text-sm leading-5 text-blue-900">
                        {item.description}
                      </div>
                    </td>
                    {/* Type */}
                    <td className="px-7 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="text-sm leading-5 text-blue-900">
                        {item.type}
                      </div>
                    </td>
                    {/* Quantity */}
                    <td className="px-7 py-4  whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                      <span className="text-xs flex justify-center">
                        {item.qty}
                      </span>
                    </td>

                    {/**Detail Button Section */}
                    <td className="px-7 py-4 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                      <button
                        className="px-5 py-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
                        onClick={() => handleDetails(item.id)}
                      >
                        View Details
                      </button>
                    </td>
                    <th className="px-6 py-3 border-b-2 border-gray-300"></th>
                  </tr>
                );
              }))}
            </tbody>
          </table>
          {/* Footer Information */}
          <div className="sm:flex-1 sm:flex sm:items-center sm:justify-between mt-4 work-sans">

                    <div>
                      <nav className="relative z-0 inline-flex shadow-sm pb-5 pt-5 ">
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
                    
                    {/* Download button section */}
                    <div className="flex place-items-end">
                          <button
                          onClick={downloadCompleteInventory} 
                          disabled={isLoading}
                          type="button"
                          className="text-white bg-blue-700 h-[58px] w-[355px] flex items-center justify-around  hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                          <BsDownload size={"25px"} />
                          {isLoading ? 'Downloading...' : 'Download Document in PDF'}
                        </button>
                     </div>
          </div>
        </div>
      </div>
    </RouteLayout>
  );
}

export default InventoryTransaction;
