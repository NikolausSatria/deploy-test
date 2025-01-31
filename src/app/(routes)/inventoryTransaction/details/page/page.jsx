"use client";
import React, { useState, useEffect, Suspense } from "react";
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
  const [totalStock, setTotalStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    // Cek apakah session ada
    if (!session || !session.user) {
      router.push("/");
    }
  }, [session, router]);

  useEffect(() => {
    const getInventory = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const response = await res.json();

        // Cek apakah inventory kosong
        if (response.inventory && response.inventory.length > 0) {
          setInventory(response.inventory);
          setTitle(response.inventory[0].description);
          setProductId(response.inventory[0].product_id);

          // Calculate total stock
          let totalIn = 0;
          let totalOut = 0;

          response.inventory.forEach(item => {
            if (item.in_out === "IN-INT") {
              totalIn += item.qty;
            } else if (item.in_out === "OUT-EXT") {
              totalOut += item.qty;
            }
          });

          setTotalStock(totalIn - totalOut);
        } else {
          // Jika tidak ada data, set inventory ke array kosong dan set title ke pesan
          setInventory([]);
          setTitle("Tidak ada data");
          setProductId("");
          setTotalStock(0);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getInventory();
  }, [id]);

  const handleUpdate = (item) => {
    router.push(`/editInventory?id=${item}`);
  };

  const handleDelete = async (id, item) => {
    Swal.fire({
      title: "DELETE",
      text: `Are you sure you want to delete ${item}?`,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
      showCancelButton: true,
      cancelButtonText: "Cancel",
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
      <div className="flex h-full p-5 flex-col bg-white text-left font-sans font-medium shadow-md">
        <div className="flex justify-between items-center">
          <Link href={"/inventoryTransaction"}>
            <button>
              <BiArrowBack className="cursor-pointer" size={"25px"} />
            </button>
          </Link>
          <div className="flex flex-col mb-4">
            <h1 className="font-medium text-2xl">{title.split(";")[0]}</h1>
            <span className="text-sm text-gray-500">ID: {productId}</span>
            <span className="font-medium text-xl">Total Qty: {totalStock}</span>
          </div>
        </div>

        <div className="justify-center items-center max-w-full max-h-screen shadow bg-white shadow-dashboard px-4 pt-5 mt-4 rounded-bl-lg rounded-br-lg overflow-y-auto overflow-x">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-2 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  No
                </th>
                <th className="px-2 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Qty
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Date Created
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Employee
                </th>
                <th className="px-2 py-3 border-b-2 border-gray-300"></th>
                <th className="px-2 py-3 border-b-2 border-gray-300"></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {/* Cek apakah inventory kosong */}
              {inventory.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                inventory.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="px-2 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                        {index + 1}
                      </td>
                      {/* Date */}
                      <td className="px-2 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                        <FormattedDate dateStr={item.date_at} dateFormat="dd-MM-yyyy" />
                      </td>
                      {/* Status */}
                      <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                        {item.in_out}
                      </td>
                      {/* Description */}
                      <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                        {item.description}
                      </td>
                      {/* Quantity */}
                      <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                        {item.qty}
                      </td>
                      {/* Created at */}
                      <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                        <FormattedDate dateStr={item.created_at} dateFormat="PPpp" />
                      </td>
                      {/* Employee */}
                      <td className="px-4 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                        {item.employee_name}
                      </td>

                      {/* Icon container */}
                      <td className="px-2 py-4 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500">
                        <div className="flex items-center space-x-2">
                          {/* button Edit */}
                          <button
                            className="p-1 rounded border text-blue-500 hover:text-white hover:bg-blue-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                            onClick={() => handleUpdate(item.id)}
                          >
                            <FaRegEdit size={"25px"} />
                          </button>

                          {/* button Delete */}
                          {session.user.position !== "user" && (
                            <button
                              className="p-1 text-rose-600 hover:text-white hover:bg-rose-600 rounded border transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                              onClick={() =>
                                handleDelete(item.id, item.product_id)
                              }
                            >
                              <MdDeleteForever size={"25px"} />
                            </button>
                          )}
                        </div>
                      </td>
                      <th className="px-4 py-3 border-b-2 border-gray-300"></th>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          {/* Footer Information */}
          <div className="sm:flex-1 sm:flex sm:items-center sm:justify-between mt-4 work-sans">
            <div></div>
          </div>
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
