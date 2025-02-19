"use client";
import RouteLayout from "@/app/(routes)/RouteLayout";
import Link from "next/link";
import React, { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";


export default function Page() {
  const router = useRouter(); // Router for navigation
  const [created, setCreated] = useState(false);
  const [state, setState] = useState({
    material_id: "",
    asset_number: "",
    material_type: "",
    material_description: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "input data to database",
      confirmButtonText: "Yes",
      showCancelButton: true,
      cancelButtonText: "Close",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        AddSku();
        toast.success("Input Successfully")
        router.push('/databaseSKU/Asset')
      } else {
      }
    });
  };

  async function AddSku() {
    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        material_id: state.material_id,
        asset_number: state.asset_number,
        material_type: state.material_type,
        material_description: state.material_description,
      }),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/asset`,
        postData
      );
      if (!res.ok) {
        console.error("Server responded with non-200 code:", res.status);
        return;
      }
      const response = await res.json();
      setCreated(true);
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  return (
    <RouteLayout>
      <div className="flex h-fit p-5 flex-col bg-white text-left font-sans font-medium shadow-md">
        <div className="flex justify-between items-center">
          <Link href="/databaseSKU/Asset">
            <button>
              <BiArrowBack className="cursor-pointer" size={"25px"} />
            </button>
          </Link>
          <h1 className="font-medium text-2xl p-5">
            Form Input Asset Database
          </h1>
        </div>

        {/* Form input new Asset form to database */}
        <div className="px-3 flex space-x-5">
          {/* Material ID */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="material_id"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Material ID
            </label>
            <input
              type="text"
              id="material_id"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Material ID"
              value={state.material_id}
              onChange={(e) =>
                setState({ ...state, material_id: e.target.value })
              }
              required
            />
          </div>
          {/* Asset ID*/}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="asset_number"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Asset ID / Number
            </label>
            <input
              type="number"
              id="asset_number"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Asset Number"
              value={state.asset_number}
              onChange={(e) =>
                setState({ ...state, asset_number: e.target.value })
              }
              required
            />
          </div>
        </div>
        <div className="px-3 flex space-x-5">
          {/* Material Type */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="material_type"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Material Type
            </label>
            <input
              type="text"
              id="material_type"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Material Type"
              value={state.material_type}
              onChange={(e) =>
                setState({ ...state, material_type: e.target.value })
              }
              required
            />
          </div>
          {/* Material Description */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="material_description"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Material Description
            </label>
            <input
              type="text"
              id="material_description"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Material Description"
              value={state.material_description}
              onChange={(e) =>
                setState({ ...state, material_description: e.target.value })
              }
              required
            />
          </div>
        </div>
        {/* Submit button */}
        <button
          type="button"
          className="text-white h-[50px] mt-5 bg-blue-700 hover:bg-blue-600 outline-none focus:font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb- w-full"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </RouteLayout>
  );
}
