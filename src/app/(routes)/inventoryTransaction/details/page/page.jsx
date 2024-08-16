"use client";
import React, { useState, useEffect } from "react";
import { BsDownload } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Date from "@/components/Date";
import RouteLayout from "@/app/(routes)/RouteLayout";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

const Details = ({ item }) => {

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const [inventory, setInventory] = useState([]);
  const [title, setTitle] = useState("");
  const { data: session } = useSession();

  if (!session || !session.user){
    router.push("/");
  }

  useEffect(() => {
    const getInventory = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const response = await res.json();
      setInventory(response.inventory);
      setTitle(response.inventory[0].description);
    };
    getInventory();
  }, []);

  const handleUpdate = (item) => {
    router.push(`/inputInventory?id=${item}`);
  };

  const handleDelete = async (id, item) => {
    Swal.fire({
      title: "DELETE",
      text: `Are you sure want to delete ${item}?`,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/api/updateInventory?id=${id}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            // Handle the response from the server
            if (data.message) {
              Swal.fire("Deleted!", "Your record has been deleted.", "success");
              router.push('/inventoryTransaction')
            } else {
              Swal.fire(
                "Error!",
                "There was a problem deleting your record.",
                "error"
              );
            }
          });
      }
    });
  };

  return (
    <RouteLayout>
      <div className="flex h-full p-5 flex-col bg-white text-left font-sans font-medium shadow-md">
        <div className="flex justify-between items-center">
          <Link href={"/inventoryTransaction"}>
            <button>
              <BiArrowBack className="cursor-pointer" size={"25px"} />
            </button>
          </Link>
          <h1 className="font-medium text-2xl">{title.split(";")[0]}</h1>
        </div>

        <div className="justify-center items-center min-w-[800px] max-h-screen shadow bg-white shadow-dashboard px-4 pt-5 mt-4 rounded-bl-lg rounded-br-lg overflow-y-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 text-blue-500 tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 text-blue-500 tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 text-blue-500 tracking-wider">
                  UOM
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 text-blue-500 tracking-wider">
                  Date Created
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-sm leading-4 text-blue-500 tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300"></th>
                <th className="px-6 py-3 border-b-2 border-gray-300"></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {/* Number */}
              {inventory.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="flex items-center justify-center">
                        <div>
                          <div className="text-sm leading-5 text-gray-800 ">
                            {index + 1}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/*Date */}
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm leading-5 text-gray-800">
                            <Date
                              dateStr={item.date_at}
                              dateFormat="dd-MM-yyyy"
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Status */}
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="flex items-center">
                        <div className="text-sm leading-5 text-blue-900">
                          {item.in_out}
                        </div>
                      </div>
                    </td>
                    {/* ID */}
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="text-sm leading-5 text-blue-900">
                        {item.product_id}
                      </div>
                    </td>
                    {/* Description */}
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="text-sm leading-5 text-blue-900">
                        {item.description}
                      </div>
                    </td>
                    {/* Quantity */}
                    <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                      <div className="text-sm leading-5 flex justify-center">
                        {item.qty}
                      </div>
                    </td>
                    {/* UOM */}
                    <td className="px-6 py-4 whitespace-no-wrap border-b text-blue-900 border-gray-500 text-sm leading-5">
                      <div className="text-sm leading-5 flex justify-center">
                        {item.uom}
                      </div>
                    </td>
                    {/* Created at */}
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="flex items-center justify-center">
                        <div className="text-sm leading-5 text-center text-gray-800">
                          <Date dateStr={item.created_at} dateFormat="PPpp" />
                        </div>
                      </div>
                    </td>
                    {/* Employee */}
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="flex items-center justify-center">
                        <div className="text-sm leading-5 text-center text-gray-800">
                          {item.name}
                        </div>
                      </div>
                    </td>
                    {/* Icon container */}
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="flex items-center justify-between space-x-5">
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
                              handleDelete(item.id, [item.product_id])
                            }
                          >
                            <MdDeleteForever size={"25px"} />
                          </button>
                        )}

                        {/* <button
                          className="p-1 text-rose-600 hover:text-white hover:bg-rose-600 rounded border transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                          onClick={() =>
                            handleDelete(item.id, [item.product_id])
                          }
                        >
                          <MdDeleteForever size={"25px"} />
                        </button> */}
                      </div>
                    </td>
                    <th className="px-6 py-3 border-b-2 border-gray-300"></th>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* Footer Information */}
          <div className="sm:flex-1 sm:flex sm:items-center sm:justify-between mt-4 work-sans">
            <div>
              {/* <button
                  type="button"
                  className="text-white bg-blue-700 h-[66px] w-[355px] flex items-center justify-around  hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  <BsDownload size={"25px"} />
                  Download Letter of Shipping
                </button> */}
            </div>
          </div>
        </div>
      </div>
    </RouteLayout>
  );
};
export default Details;
