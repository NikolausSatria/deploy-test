"use client";
import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import FormattedDate from "@/components/FormattedDate";
import RouteLayout from "@/app/(routes)/RouteLayout";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

const Details = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const [inventory, setInventory] = useState([]);
  const [title, setTitle] = useState("");
  const [productId, setProductId] = useState("");
  const [remainingStock, setremainingStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  const fetchInventory = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Network response was not ok");

      const response = await res.json();

      if (response.inventory && response.inventory.length > 0) {
        setInventory(response.inventory);
        setTitle(response.inventory[0].description);
        setProductId(response.inventory[0].product_id);

        setremainingStock(response.inventory[0].remaining_stock || 0);
      } else {
        setInventory([]);
        setTitle("Tidak ada data");
        setProductId("");
        setremainingStock(0);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session || !session.user) {
      router.push("/");
    }
  }, [session, router]);

  useEffect(() => {
    fetchInventory();
  }, [id]);

  const handleDelete = async (id, item) => {
    Swal.fire({
      title: "Are you sure?",
      text: `This action will permanently delete "${item}". This cannot be undone.`,
      icon: "warning",
      confirmButtonText: "Yes, Delete",
      confirmButtonColor: "#d33",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      cancelButtonColor: "#6c757d",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${process.env.NEXT_PUBLIC_URL}/api/${id}`, {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            // Handle the response from the server
            if (data.message) {
              Swal.fire("Deleted!", "Your record has been deleted.", "success");
              router.push("/inventoryTransaction");
            } else {
              Swal.fire(
                "Error!",
                "There was a problem deleting your record.",
                "error"
              );
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            Swal.fire(
              "Error!",
              "There was a problem deleting your record.",
              "error"
            );
          });
      }
    });
  };

  const inventoryTable = useMemo(() => {
    return inventory.map((item, index) => (
      <tr key={index} className="border-b hover:bg-gray-50 text-center">
        <td className="px-4 py-3 text-gray-600">{index + 1}</td>
        <td className="px-4 py-3 text-gray-600">
          <FormattedDate dateStr={item.date_at} dateFormat="dd-MM-yyyy" />
        </td>
        <td className="p-1 text-center">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
              item.in_out.includes("IN")
                ? "bg-green-50 text-green-700 ring-green-600/20"
                : "bg-red-50 text-red-700 ring-red-600/20"
            }`}
          >
            {item.in_out}
          </span>
        </td>

        <td className="px-4 py-3 text-gray-600">{item.description}</td>
        <td className="px-4 py-3 font-semibold text-gray-700">{item.qty}</td>
        <td className="px-4 py-3 text-gray-600">
          <FormattedDate dateStr={item.created_at} dateFormat="PPpp" />
        </td>
        <td className="px-4 py-3 text-gray-600">{item.employee_name}</td>
        <td className="px-4 py-3">
          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded border text-blue-500 hover:text-white hover:bg-blue-500 transition transform hover:scale-105"
              onClick={() => handleUpdate(item.id)}
            >
              <FaRegEdit size={"20px"} />
            </button>
            {session.user.position !== "user" && (
              <button
                className="p-2 text-rose-600 hover:text-white hover:bg-rose-600 rounded border transition transform hover:scale-105"
                onClick={() => handleDelete(item.id, item.product_id)}
              >
                <MdDeleteForever size={"20px"} />
              </button>
            )}
          </div>
        </td>
      </tr>
    ));
  }, [inventory, session]); // 🔥 Cache data biar gak re-render terus

  if (loading) {
    return (
      <RouteLayout>
        <div className="flex h-full p-5 flex-col bg-white text-left font-sans font-medium shadow-md items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-medium">Loading...</p>
          </div>
        </div>
      </RouteLayout>
    );
  }

  if (error) {
    return (
      <RouteLayout>
        <div className="flex h-full p-5 flex-col bg-white text-left font-sans font-medium shadow-md items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-medium text-red-500">Error: {error}</p>
          </div>
        </div>
      </RouteLayout>
    );
  }

  return (
    <RouteLayout>
      <div className="flex h-full p-6 flex-col bg-white text-left font-sans font-medium shadow-lg rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm mb-6">
          <Link href={"/inventoryTransaction"}>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm hover:bg-gray-200 transition">
              <BiArrowBack size={"20px"} />
              <span className="text-sm font-medium">Back</span>
            </button>
          </Link>

          {/* Inventory Info */}
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {title.split(";")[0]}
            </h1>
            <p className="text-sm text-gray-500">
              ID: <span className="font-medium">{productId}</span>
            </p>
          </div>

          {/* Total Qty */}
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow">
            <span className="text-sm">Total Qty</span>
            <h2 className="text-lg font-semibold">{remainingStock}</h2>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm font-semibold">
                {[
                  "No",
                  "Date",
                  "Status",
                  "Description",
                  "Qty",
                  "Date Created",
                  "Employee",
                  "Action",
                ].map((heading, index) => (
                  <th key={index} className="px-4 py-3 border-b text-center">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inventory.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                inventoryTable
              )}
            </tbody>
          </table>
        </div>
      </div>
    </RouteLayout>
  );
};

const DetailsWithSuspense = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Details />
    </Suspense>
  );
};

export default DetailsWithSuspense;
