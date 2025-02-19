"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BsDownload } from "react-icons/bs";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import RouteLayout from "../../RouteLayout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";

function MaterialInventoryTransaction() {
  const router = useRouter();
  const pathname = usePathname();

  const [material_inventory, setMaterialInventory] = useState([]);
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
        `${process.env.NEXT_PUBLIC_URL}/api/materialinventory?search=${query}&page=${page}&limit=${itemsPerPage}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const response = await res.json();
      if (Array.isArray(response.material_inventory)) {
        setMaterialInventory(response.material_inventory);
      } else {
        console.error("Invalid data format:", response);
        setMaterialInventory([]);
      }
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error("Failed to load Material Inventory Transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset ke halaman 1 setiap kali pencarian dilakukan
    getInventory(searchQuery, 1);
  };
  const handleDetails = (item) => {
    router.push(`/inventoryTransaction/details/page?id=${item}`);
  };

  async function downloadCompleteInventory() {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/materialinventory?allData=true`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (res.status === 200 && Array.isArray(data.material_inventory)) {
        createPdf(data.material_inventory);
      } else {
        console.error(
          "Failed to download material inventory data:",
          data.message
        );
      }
    } catch (error) {
      console.error("Failed to fetch material inventory data:", error);
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

    doc.text("Product Inventory Transaction Report", 14, 15);
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
    const fileName = `product_inventory_transaction_report_${timestamp}.pdf`;
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
        {/* Header Button */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/inventoryTransaction">
            <button>
              <BiArrowBack className="cursor-pointer" size={"25px"} />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 text-center flex-1">
            MATERIAL INVENTORY TRANSACTION
          </h1>
        </div>

        {/* Search Bar container */}
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
                {["No", "ID", "Description", "Type", "Quantity", "Action"].map(
                  (heading) => (
                    <th key={heading} className="px-4 py-3 border-b">
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : Array.isArray(material_inventory) &&
                material_inventory.length > 0 ? (
                material_inventory.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-4 py-3">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3">{item.id}</td>
                    <td className="px-4 py-3">{item.description}</td>
                    <td className="px-4 py-3">{item.type}</td>
                    <td className="px-4 py-3">{item.qty}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDetails(item.id)}
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

        {/* Pagination */}
        <div className="flex justify-between mt-4">
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
          className="px-4 py-2 mt-4 text-white bg-blue-500 hover:bg-blue-700 font-semibold rounded"
        >
          <BsDownload className="inline mr-2" />
          Download All
        </button>
      </div>
    </RouteLayout>
  );
}

export default MaterialInventoryTransaction;
