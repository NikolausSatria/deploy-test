"use client";
import React, { useState, useEffect, Suspense } from "react";
import RouteLayout from "../RouteLayout";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AsyncSelect from "react-select/async";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2"; // Impor SweetAlert2

function InputInventory() {
  const optionProductDetail = ["IN-INT", "OUT-INT", "IN-EXT", "OUT-EXT"];
  const { data: session } = useSession();
  const router = useRouter();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [state, setState] = useState({
    in_out: "",
    date_at: "",
    lot: "",
    dn: "",
    po: "",
    mo: "",
    qty: 0,
  });

  const loadOption = (inputValue) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/search?search_query=${encodeURIComponent(inputValue)}`;
    return fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((json) =>
        json.searchs.map((item) => ({
          label: `${item.id} | ${item.description}`,
          value: item.id,
        }))
      )
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleProductChange = (selectedOption) => {
    setSelectedProduct(selectedOption);
  };

  const handleSelectChange = (event) => {
    const selected = event.target.value;
    setState((prevState) => ({
      ...prevState,
      in_out: selected,
    }));
  };

  const isEmpty = (value) => !value || value === "";

  const validateField = (value, fieldName) => {
    if (isEmpty(value)) {
      toast.error(`Please input ${fieldName}`);
      return false;
    }
    return true;
  };

  const validateForm = () => {
    if (!validateField(selectedProduct, "Product")) return false;
    if (!validateField(state.qty, "Quantity")) return false;
    if (!validateField(state.date_at, "Date")) return false;
    if (!validateField(state.in_out, "Transaction Type")) return false;

    if (["IN-INT", "IN-EXT", "OUT-INT", "OUT-EXT"].includes(state.in_out)) {
      if (!validateField(state.lot, "LOT No.")) return false;

      if (["IN-INT", "OUT-INT"].includes(state.in_out)) {
        if (!validateField(state.mo, "MO No.")) return false;
      }

      if (["IN-EXT", "OUT-EXT"].includes(state.in_out)) {
        if (!validateField(state.dn, "DN No.")) return false;
        if (!validateField(state.po, "PO No.")) return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!session) {
      toast.error("Please login!");
      return;
    }

    // Konfirmasi sebelum mengirim data
    const result = await Swal.fire({
      title: 'Konfirmasi',
      text: "Apakah Anda yakin ingin mengirim data ini?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      const url = `/api/inventory_transaction`; // Endpoint untuk update inventory

      const postData = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employees_id: session.user.id,
          product_id: selectedProduct.value,
          in_out: state.in_out,
          date_at: state.date_at,
          lot: state.lot,
          dn: state.dn,
          po: state.po,
          mo: state.mo,
          qty: parseInt(state.qty, 10),
        }),
      };

      try {
        const res = await fetch(url, postData);
        if (res.ok) {
          router.push("/inventoryTransaction");
          toast.success("Data Successfully Updated");
        } else {
          const errorData = await res.json();
          toast.error(`Failed to Update: ${errorData.message || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Request failed:", error);
        toast.error("An error occurred while submitting the data");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <RouteLayout>
      <div className="flex h-fit p-5 flex-col bg-white text-left font-sans font-medium shadow-md">
        <div className="flex justify-center items-center">
          <h1 className="font-medium text-4xl text-center">Input Inventory</h1>
        </div>

        {/** form input container */}
        <div className="-mx-3 md:flex mb-6">
          <div className="md:w-full w-800px px-3 mb-6 md:mb-0">
            <label
              className="block tracking-wide text-grey-darker text-medium mb-4"
              name="input"
              htmlFor="input"
            >
              Product Name
            </label>
            {/* select searchbar Section */}

            <AsyncSelect
              cacheOptions
              loadOptions={loadOption}
              defaultOptions
              value={selectedProduct}
              onChange={handleProductChange}
              placeholder="Select a product..."
              isDisabled={false} // Menonaktifkan select saat dalam mode edit
            />
          </div>
        </div>

        {/* Quantity Container */}
        <div className="flex mb-5 space-x-5">
          <div className="w-1/2">
            <label
              htmlFor="guest"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Quantity
            </label>
            <input
              type="number"
              name="guest"
              id="guest"
              placeholder="Enter Amount of Quantity"
              min="0"
              className="appearance-none rounded-md border border-[#545353] bg-white py-3 px-6 w-full text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              value={state.qty}
              onChange={(e) => setState({ ...state, qty: e.target.value })}
              required
            />
          </div>

          {/* date Section */}
          <div className="w-1/2">
            <label
              htmlFor="datecontainer"
              className="mb-2 block text-sm font-medium text-[#545353]"
            >
              Date
            </label>
            <input
              type="date"
              name="date"
              id="datecontainer"
              className="w-full appearance-none rounded-md border border-[#545353] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              value={state.date_at}
              onChange={(e) => setState({ ...state, date_at: e.target.value })}
            />
          </div>
        </div>

        {/* Three options for Data inventory */}
        <div className="-mx-3 md:flex mb-5">
          <div className="md:w-full px-3">
            <label
              className="block tracking-wide text-grey-darker text-medium mb-2"
              htmlFor="grid-state"
            >
              Transaction Type
            </label>
            <div className="relative">
              <select
                onChange={handleSelectChange}
                value={state.in_out}
                className="block appearance-none w-full bg-grey-lighter border border-[#545353] text-grey-darker py-3 px-4 pr-8 rounded"
                id="grid-state"
              >
                <option value="">--- Select Detail ---</option>

                {optionProductDetail.map((option) => {
                  return (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        {/* Lot, DN, PO and MO Section */}

        {/* Lot No */}
        <div className="px-3 flex space-x-5">
          <div className="mb-5 w-1/2">
            <label
              htmlFor="lot"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              LOT No.
            </label>
            <input
              type="text"
              autoComplete="off"
              id="lot"
              name="lot"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="LOT No."
              value={state.lot}
              onChange={handleChange}
              disabled={state.in_out === "IN-EXT" || state.in_out === "OUT-EXT"}
            />
          </div>

          {/* DN No.*/}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="dn"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              DN No.
            </label>
            <input
              type="text"
              autoComplete="off"
              id="dn"
              name="dn"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="DN No."
              value={state.dn}
              onChange={handleChange}
              disabled={state.in_out === "IN-INT" || state.in_out === "OUT-INT"}
            />
          </div>

          {/* PO NO. */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="po"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              PO No.
            </label>
            <input
              type="text"
              autoComplete="off"
              name="po"
              id="po"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="PO No."
              value={state.po}
              onChange={handleChange}
              disabled={state.in_out === "IN-INT" || state.in_out === "OUT-INT"}
            />
          </div>
          {/* MO No.*/}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="mo"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              MO No.
            </label>
            <input
              type="text"
              name="mo"
              id="mo"
              autoComplete="off"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="MO No."
              value={state.mo}
              onChange={handleChange}
              disabled={state.in_out === "IN-EXT" || state.in_out === "OUT-EXT"}
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
export default InputInventory;
