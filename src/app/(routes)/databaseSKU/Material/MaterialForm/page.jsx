"use client";
import RouteLayout from "@/app/(routes)/RouteLayout";
import Link from "next/link";
import React, { useState, useRef } from "react";
import { BiArrowBack } from "react-icons/bi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";


export default function MaterialForm() {
  const [created, setCreated] = useState(false);
  const router = useRouter();

  const [state, setState] = useState({
    material_id: "",
    material_type: "",
    material_description: "",
    minimum_stock: "",
    rop: "",
    maximum_stock: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "input data to database",
      confirmButtonText: "Yes",
      showCancelButton: true,
      cancelButtonText: "Close",
    }).then((result) => {
      if (result.isConfirmed) {
        AddSku();
        toast.success("Input Successfully")
        router.push('/databaseSKU/Material')
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
        material_type: state.material_type,
        material_description: state.material_description,
        minimum_stock: state.minimum_stock,
        rop: state.rop,
        maximum_stock: state.maximum_stock,
      }),
    };
  
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/material`,
        postData
      );
      if (res.ok) {
        setCreated(true);
      } else {
        console.error("Server responded with non-200 code:", res);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }
  return (
    <RouteLayout>
      <div className="flex h-full p-5 flex-col bg-white text-left font-sans font-medium shadow-md">
        <div className="flex justify-between items-center">
          <Link href={"/databaseSKU/Asset"}>
            <button>
              <BiArrowBack className="cursor-pointer" size={"25px"} />
            </button>
          </Link>
          <h1 className="font-medium text-3xl p-5">
            Input new Data to Material Database
          </h1>
        </div>

        {/** form input container Product Description*/}
        <div className="px-3 flex space-x-5">
          {/* Material / Product Description */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="productNumber"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Material ID
            </label>
            <input
              type="number"
              id="productNumber"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Material ID"
              value={state.material_id}
              onChange={(e) =>
                setState({ ...state, material_id: e.target.value })
              }
              required
            />
          </div>
          {/* Material Type*/}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="Material Type"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Material Type
            </label>
            <input
              type="text"
              id="material Type"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Material type"
              value={state.material_type}
              onChange={(e) =>
                setState({ ...state, material_type: e.target.value })
              }
              required
            />
          </div>
        </div>
        {/* Material Description */}
        <div className="px-3 mb-5 w-full">
          <label
            htmlFor="Material Description"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Material Description
          </label>
          <input
            type="text"
            id="productID"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Material Description"
            value={state.material_description}
            onChange={(e) =>
              setState({ ...state, material_description: e.target.value })
            }
            required
          />
        </div>

        <div className="px-3 flex space-x-5">
          {/* Minimum Stock*/}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="neckType"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Minimum Stock
            </label>
            <input
              type="text"
              id="neckType"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Minimum Stock"
              value={state.minimum_stock}
              onChange={(e) =>
                setState({ ...state, minimum_stock: e.target.value })
              }
              required
            />
          </div>
          {/* ROP */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="material"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              ROP
            </label>
            <input
              type="text"
              id="material"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="ROP"
              value={state.rop}
              onChange={(e) => setState({ ...state, rop: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="w-full px-3">
          <fieldset
            htmlFor="guest"
            className="mb-3 block text-base font-medium text-[#07074D]"
          >
            Maximum Stock
          </fieldset>
          <input
            type="number"
            name="guest"
            id="guest"
            placeholder="5"
            min="0"
            className="w-full appearance-none rounded-md border border-gray-300 text-gray-900 bg-gray-50 py-3 px-6 text-base font-medium  outline-none focus:border-[#6A64F1] focus:shadow-md"
          />
        </div>

        {/* Three options for Data inventory */}
        {/* Submit button */}
        <Link href={"/Confirmpage"} passHref>
          <button
            type="button"
            className="text-white h-[50px] mt-5 bg-blue-700 hover:bg-blue-600 outline-none focus:font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb- w-full"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </Link>
      </div>
    </RouteLayout>
  );
}
