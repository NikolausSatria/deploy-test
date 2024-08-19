"use client";
import RouteLayout from "@/app/(routes)/RouteLayout";
import Link from "next/link";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { BiArrowBack } from "react-icons/bi";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Page() {
  const [created, setCreated] = useState(false);

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
      text: "input data to database",
      confirmButtonText: "Yes",
      showCancelButton: true,
      cancelButtonText: "Close",
    }).then((result) => {
      if (result.isConfirmed) {
        AddSku();
        toast.success("Input Successfully")
        router.push('/databaseSKU/Product')
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
        console.error("Server responded with non-200 code:", response);
      }
    } catch (error) {
      console.error("Network error:", error);
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
      <div className="flex h-fit p-5 flex-col bg-white text-left font-sans font-medium shadow-md ">
        <div className="flex justify-between items-center">
          <Link href={"/databaseSKU/Product"}>
            <button>
              <BiArrowBack className="cursor-pointer" size={"25px"} />
            </button>
          </Link>
          <h1 className="font-medium text-2xl p-5">
            Input New Data to Product Database
          </h1>
        </div>

        {/* Product Description*/}
        <div className="mb-5 w-full px-3">
          <label
            htmlFor="productDesc"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Product Description
          </label>
          <input
            type="text"
            id="ProductDesc"
            name="productDesc"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Product Description"
            autoComplete="false"
            value={state.productDesc}
            readOnly
            // onChange={(e) =>
            //   setState({ ...state, productDesc: e.target.value })
            // }
            // required
          />
        </div>
        {/** form input container Product Description*/}
        <div className="px-3 flex space-x-5">
          {/* product Name */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="productNumber"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Product Name
            </label>
            <input
              type="text"
              id="productNumber"
              name="productName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Product Name"
              value={productName}
              onChange={handleInputChange}
              required
            />
          </div>
          {/* Product ID*/}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="productID"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Product ID
            </label>
            <input
              type="number"
              id="productID"
              name="productId"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Product ID"
              value={state.productId}
              onChange={handleInputChange} 
              required
            />
          </div>
        </div>

        <div className="px-3 flex space-x-5">
          {/* Neck Type */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="neckTypeContainer"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Neck Type
            </label>
            <input
              type="text"
              id="neckTypeContainer"
              name="neckType"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Neck Type"
              value={state.neckType}
              // onChange={(e) => setState({ ...state, neckType: e.target.value })}
              onChange={handleInputChange} 
              required
            />
          </div>
          {/* Volume ml.*/}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="volumeContainer"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Volume (ml)
            </label>
            <input
              type="number"
              id="volumeContainer"
              name="volume"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Volume (ml)"
              value={state.volume}
              // onChange={(e) => setState({ ...state, volume: e.target.value })}
              onChange={handleInputChange} 
              required
            />
          </div>
          {/* UOM.*/}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="volumeContainer"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              UOM
            </label>
            <input
              type="text"
              id="uomContainer"
              name="uom"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Uom"
              value={state.uom}
              // onChange={(e) => setState({ ...state, volume: e.target.value })}
              onChange={handleInputChange} 
              required
            />
          </div>
        </div>
        <div className="px-3 flex space-x-5">
          {/* Material */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="materialContainer"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Material
            </label>
            <input
              type="text"
              id="materialContainer"
              name="material"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Material"
              value={state.material}
              // onChange={(e) => setState({ ...state, material: e.target.value })}
              onChange={handleInputChange} 
              required
            />
          </div>
          {/* Weight*/}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="weightContainer"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Weight (gr)
            </label>
            <input
              type="number"
              id="weightContainer"
              name="weight"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Weight (gr)"
              value={state.weight}
              // onChange={(e) => setState({ ...state, weight: e.target.value })}
              onChange={handleInputChange} 
              required
            />
          </div>
          {/* Color */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="colorContainer"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Color
            </label>
            <input
              type="text"
              id="colorContainer"
              name="color"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Color"
              value={state.color}
              // onChange={(e) => setState({ ...state, color: e.target.value })}
              onChange={handleInputChange} 
              required
            />
          </div>
        </div>
        <div className="px-3 flex space-x-5">
          {/* Bottles/coli */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="bottlesPerColi"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              #Bottles/Coli
            </label>
            <input
              type="number"
              id="bottlesPerColi"
              name="bottles_per_coli"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Bottles/Coli"
              value={state.bottles_per_coli}
              // onChange={(e) =>
              //   setState({ ...state, bottles_per_coli: e.target.value })
              // }
              onChange={handleInputChange} 
            />
          </div>
          {/* #Box/Coli*/}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="boxPerColi"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              #Box/Coli
            </label>
            <input
              type="number"
              id="boxPerColi"
              name="coli_per_box"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Box/Coli"
              value={state.coli_per_box}
              onChange={handleInputChange} 
            />
          </div>
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
