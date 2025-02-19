"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BsDownload } from "react-icons/bs";
import RouteLayout from "../RouteLayout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Link from "next/link";
import FormattedDate from "@/components/FormattedDate";
import Swal from "sweetalert2";
import { DatePicker } from "antd";
import moment from "moment";

function InventoryTransaction() {
  const router = useRouter();
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 25;

  async function fetchData(query, page, limit, startDate, endDate) {
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_URL
        }/api/inventory_transaction?search=${query}&page=${page}&limit=${limit}&startDate=${
          startDate || ""
        }&endDate=${endDate || ""}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      return await res.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  // Mengambil data inventory untuk ditampilkan ke UI
  useEffect(() => {
    getInventory(searchQuery, currentPage);
  }, [searchQuery, currentPage, startDate, endDate]);

  async function getInventory(query, page) {
    setIsLoading(true);
    try {
      const response = await fetchData(
        query,
        page,
        itemsPerPage,
        startDate,
        endDate
      );
      setInventory(response.inventory);
      setTotalPages(response.totalPages);
    } catch (error) {
      // Menampilkan notifikasi error menggunakan SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to load inventory data. Please try again later.",
        confirmButtonColor: "#3085d6",
      });
      console.error("Failed to load inventory:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Handler untuk pencarian
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset ke halaman 1 setiap kali pencarian dilakukan
    getInventory(searchQuery, 1);
  };

  // Navigasi ke halaman detail
  const handleDetails = (item) => {
    router.push(`/inventoryTransaction/details/page?id=${item}`);
  };

  // Unduh laporan inventory
  async function downloadCompleteInventory() {
    setIsLoading(true);
    try {
      const response = await fetchData(
        searchQuery,
        currentPage,
        itemsPerPage,
        startDate,
        endDate
      );
      createPdf(response.inventory);
    } catch (error) {
      // Menampilkan notifikasi error menggunakan SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Download Failed",
        text: "Failed to fetch complete inventory data. Please try again later.",
        confirmButtonColor: "#3085d6",
      });
      console.error("Failed to fetch complete inventory data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Membuat file PDF menggunakan jsPDF dan jspdf-autotable
  function createPdf(data) {
    const doc = new jsPDF();
    const tableColumns = ["No", "ID", "Description", "Type", "Quantity"];
    const tableRows = data.map((item, index) => [
      index + 1,
      item.product_id,
      item.description,
      item.type,
      item.qty.toString(),
    ]);

    doc.text("Inventory Transaction Report", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [tableColumns],
      body: tableRows,
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 3,
        overflow: "linebreak",
        lineColor: [0, 0, 0],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [255, 255, 255], // Warna latar belakang header putih
        textColor: [0, 0, 0], // Warna teks hitam
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Warna latar belakang baris genap
      },
    });
    // Mendapatkan timestamp
    const timestamp = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
    const fileName = `inventory_transaction_report_${timestamp}.pdf`;
    doc.save(fileName);

    // Menampilkan notifikasi sukses menggunakan SweetAlert2
    Swal.fire({
      icon: "success",
      title: "Download Successful",
      text: "Your inventory report has been downloaded successfully.",
      confirmButtonColor: "#3085d6",
    });
  }

  return (
    <RouteLayout>
      <div className="flex flex-col h-full p-6 bg-white shadow-md rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center flex-1">
            INVENTORY TRANSACTION
          </h1>
        </div>

        {/* Search and Date Filter */}
        <form className="space-y-4" onSubmit={handleSearch}>
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

          {/* Date Filter & Categories */}
          <div className="flex justify-between items-center">
            {/* Date Filter on the Left */}
            <div className="flex items-center space-x-4">
              <span className="font-medium">From:</span>
              <DatePicker
                className="border rounded p-2"
                value={startDate ? moment(startDate, "YYYY-MM-DD") : null}
                onChange={(date) =>
                  setStartDate(date ? date.format("YYYY-MM-DD") : null)
                }
              />
              <span className="font-medium">To:</span>
              <DatePicker
                className="border rounded p-2"
                value={endDate ? moment(endDate, "YYYY-MM-DD") : null}
                onChange={(date) =>
                  setEndDate(date ? date.format("YYYY-MM-DD") : null)
                }
              />
            </div>

            {/* Categories on the Right */}
            <div className="flex space-x-2">
              {[
                {
                  label: "Product",
                  href: "/inventoryTransaction/Product_Inventory",
                },
                {
                  label: "Asset",
                  href: "/inventoryTransaction/Asset_Inventory",
                },
                {
                  label: "Material",
                  href: "/inventoryTransaction/Material_Inventory",
                },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="px-4 py-2 text-blue-600 border rounded-lg hover:bg-blue-700 hover:text-white"
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
                {[
                  "No",
                  "ID",
                  "Description",
                  "Type",
                  "Quantity",
                  "Date Created",
                  "Action",
                ].map((heading) => (
                  <th key={heading} className="px-4 py-3 border-b">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : inventory.length > 0 ? (
                inventory.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-4 py-3">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3">{item.product_id}</td>
                    <td className="px-4 py-3">{item.description}</td>
                    <td className="px-4 py-3">{item.type}</td>
                    <td className="px-4 py-3">{item.qty}</td>
                    <td className="px-4 py-3">
                      <FormattedDate
                        dateStr={item.created_at}
                        dateFormat="dd-MM-yyyy"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDetails(item.product_id)}
                        className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-700"
                      >
                        Details
                      </button>
                    </td>
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

        {/* Pagination & Download */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <button
          onClick={downloadCompleteInventory}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <BsDownload className="inline mr-2" /> Download All
        </button>
      </div>
    </RouteLayout>
  );
}

export default InventoryTransaction;
