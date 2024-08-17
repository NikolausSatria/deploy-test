"use client";
import RouteLayout from "@/app/(routes)/RouteLayout";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { BiArrowBack } from "react-icons/bi";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Page() {
  const [created, setCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [productName, setProductName] = useState("");
  const [state, setState] = useState({
    productId: "",
    productDesc: "",
    neckType: "",
    volume: "",
    material: "",
    weight: "",
    color: "",
    bottles_per_coli: "",
    coli_per_box: "",
    uom: ""
  });

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "Input data to database",
      confirmButtonText: "Yes",
      showCancelButton: true,
      cancelButtonText: "Close",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        await AddSku();
        setIsLoading(false);
        if (created) {
          toast.success("Input Successfully");
          router.push('/databaseSKU/Product');
        }
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
        product_id: state.productId,
        product_description: state.productDesc,
        neck_type: state.neckType,
        volume: state.volume,
        material: state.material,
        weight: state.weight,
        color: state.color,
        bottles_per_coli: state.bottles_per_coli,
        coli_per_box: state.coli_per_box,
        uom: state.uom,
      }),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/product`,
        postData
      );
      if (res.ok) {
        setCreated(true);
      } else {
        const errorData = await res.json();
        console.error("Server error:", errorData);
        toast.error("Failed to submit data. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error. Please try again later.");
    }
  }

  const updateProductDescription = () => {
    const descriptionParts = [
      productName,
      state.neckType,
      `${state.volume}ml`,
      state.material,
      `${state.weight}gr`,
      state.color,
      `${state.bottles_per_coli}`,
      `${state.coli_per_box}`,
      `${state.uom}`,
    ];

    const description = descriptionParts
      .filter(part => part) // Hanya ambil parts yang memiliki nilai
      .join('; '); // Gabungkan dengan '; ' sebagai pemisah

    setState(prevState => ({
      ...prevState,
      productDesc: description
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'productName') {
      setProductName(value);
    } else {
      setState(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    updateProductDescription();
  }, [productName, state.neckType, state.volume, state.material, state.weight, state.color, state.bottles_per_coli, state.coli_per_box, state.uom]);

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
            Input New Data to Product Database
          </h1>
        </div>

        {/* Product Description */}
        <div className="mb-5 w-full px-3">
          <label
            htmlFor="productDesc"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Product Description
          </label>
          <input
            type="text"
            id="productDesc"
            name="productDesc"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Product Description"
            autoComplete="false"
            value={state.productDesc}
            readOnly
          />
        </div>

        {/* Form input container */}
        <div className="px-3 flex space-x-5">
          {/* Product Name */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="productName"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Product Name"
              value={productName}
              onChange={handleInputChange}
              required
            />
          </div>
          {/* Product ID */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="productId"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Product ID
            </label>
            <input
              type="text"
              id="productId"
              name="productId"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Product ID"
              value={state.productId}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Additional fields */}
        <div className="px-3 flex space-x-5">
          {/* Neck Type */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="neckType"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Neck Type
            </label>
            <input
              type="text"
              id="neckType"
              name="neckType"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Neck Type"
              value={state.neckType}
              onChange={handleInputChange}
            />
          </div>
          {/* Volume */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="volume"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Volume
            </label>
            <input
              type="text"
              id="volume"
              name="volume"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Volume"
              value={state.volume}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="px-3 flex space-x-5">
          {/* Material */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="material"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Material
            </label>
            <input
              type="text"
              id="material"
              name="material"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Material"
              value={state.material}
              onChange={handleInputChange}
            />
          </div>
          {/* Weight */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="weight"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Weight
            </label>
            <input
              type="text"
              id="weight"
              name="weight"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Weight"
              value={state.weight}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="px-3 flex space-x-5">
          {/* Color */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="color"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Color
            </label>
            <input
              type="text"
              id="color"
              name="color"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Color"
              value={state.color}
              onChange={handleInputChange}
            />
          </div>
          {/* Bottles Per Coli */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="bottles_per_coli"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Bottles Per Coli
            </label>
            <input
              type="text"
              id="bottles_per_coli"
              name="bottles_per_coli"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Bottles Per Coli"
              value={state.bottles_per_coli}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="px-3 flex space-x-5">
          {/* Coli Per Box */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="coli_per_box"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Coli Per Box
            </label>
            <input
              type="text"
              id="coli_per_box"
              name="coli_per_box"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Coli Per Box"
              value={state.coli_per_box}
              onChange={handleInputChange}
            />
          </div>
          {/* UOM */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="uom"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              UOM
            </label>
            <input
              type="text"
              id="uom"
              name="uom"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="UOM"
              value={state.uom}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700"
          >
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </div>
      </div>
    </RouteLayout>
  );
}
