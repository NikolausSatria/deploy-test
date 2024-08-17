"use client";
import React, { useState, useEffect } from "react";
import RouteLayout from "../RouteLayout";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";
import { useSession } from "next-auth/react";

function InputInventory() {
  const optionProductDetail = ["IN-INT", "OUT-INT", "IN-EXT", "OUT-EXT"];
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

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

  useEffect(() => {
    if (id) {
      fetch(`/api/updateInventory?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          const inventoryData = data.inventory[0];
          const formattedDate = inventoryData.date_at.split("T")[0];
          setState({
            in_out: inventoryData.in_out || "",
            date_at: formattedDate || "",
            lot: inventoryData.lot || "",
            dn: inventoryData.dn || "",
            po: inventoryData.po || "",
            mo: inventoryData.mo || "",
            qty: inventoryData.qty || 0,
          });

          loadOption(inventoryData.product_id).then((options) => {
            const productOption = options.find(
              (option) => option.value === inventoryData.product_id
            );
            setSelectedProduct(productOption || null);
          });
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [id]);

  const loadOption = (inputValue) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/search?search_query=${encodeURIComponent(inputValue)}`;
    return fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((json) =>
        json.searchs.map((item) => ({
          label: `${item.id} | ${item.description}`,
          value: item.id,
        }))
      )
      .catch((error) => {
        console.error("Fetch operation problem:", error);
        return [];
      });
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedProduct(selectedOption);
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

    const method = id ? "PUT" : "POST";
    const url = id ? `${process.env.NEXT_PUBLIC_URL}/api/updateInventory?id=${id}` : `${process.env.NEXT_PUBLIC_URL}/api/inventory`;

    const postData = {
      method: method,
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
        qty: state.qty,
      }),
    };

    try {
      const res = await fetch(url, postData);
      if (res.ok) {
        router.push("/inventoryTransaction");
        toast.success("Data Successfully Input");
      } else {
        toast.error("Failed Input");
      }
    } catch (error) {
      toast.error("An error occurred while submitting");
    }
  };

  return (
    <RouteLayout>
      <div className="flex h-full w-auto p-5 flex-col bg-white text-left font-sans font-medium shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="font-medium text-4xl">INPUT INVENTORY</h1>
        </div>

        <div className="bg-white shadow-md rounded px-8 pt-4 pb-5 mb-4 flex flex-col my-2 border-2 border-blue-500">
          <div className="-mx-3 md:flex mb-6">
            <div className="md:w-full w-800px px-3 mb-6 md:mb-0">
              <label
                className="block tracking-wide text-grey-darker text-medium mb-4"
                htmlFor="product"
              >
                Product Name
              </label>
              <AsyncSelect
                cacheOptions
                loadOptions={loadOption}
                defaultOptions
                value={selectedProduct}
                onChange={handleSelectChange}
                components={makeAnimated()}
                isDisabled={!!id}
              />
            </div>
          </div>

          <div className="flex mb-5 space-x-5">
            <div className="w-1/2">
              <label
                htmlFor="quantity"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                placeholder="Enter Amount of Quantity"
                min="0"
                className="appearance-none rounded-md border border-[#545353] bg-white py-3 px-6 w-full text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={state.qty}
                onChange={(e) => setState({ ...state, qty: e.target.value })}
                required
              />
            </div>

            <div className="w-1/2">
              <label
                htmlFor="date"
                className="mb-2 block text-sm font-medium text-[#545353]"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                className="w-full appearance-none rounded-md border border-[#545353] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={state.date_at}
                onChange={(e) =>
                  setState({ ...state, date_at: e.target.value })
                }
              />
            </div>
          </div>

          <div className="-mx-3 md:flex mb-5">
            <div className="md:w-full px-3">
              <label
                className="block tracking-wide text-grey-darker text-medium mb-2"
                htmlFor="in_out"
              >
                Transaction Type
              </label>
              <select
                id="in_out"
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:shadow-outline"
                value={state.in_out}
                onChange={(e) => setState({ ...state, in_out: e.target.value })}
              >
                <option value="">Select Type</option>
                {optionProductDetail.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {state.in_out === "IN-EXT" || state.in_out === "OUT-EXT" ? (
            <>
              <div className="mb-5">
                <label
                  htmlFor="dn"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  DN No.
                </label>
                <input
                  type="text"
                  id="dn"
                  placeholder="Enter DN Number"
                  className="appearance-none rounded-md border border-[#545353] bg-white py-3 px-6 w-full text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  value={state.dn}
                  onChange={(e) => setState({ ...state, dn: e.target.value })}
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="po"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  PO No.
                </label>
                <input
                  type="text"
                  id="po"
                  placeholder="Enter PO Number"
                  className="appearance-none rounded-md border border-[#545353] bg-white py-3 px-6 w-full text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  value={state.po}
                  onChange={(e) => setState({ ...state, po: e.target.value })}
                />
              </div>
            </>
          ) : null}

          {state.in_out === "IN-INT" || state.in_out === "OUT-INT" ? (
            <div className="mb-5">
              <label
                htmlFor="mo"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                MO No.
              </label>
              <input
                type="text"
                id="mo"
                placeholder="Enter MO Number"
                className="appearance-none rounded-md border border-[#545353] bg-white py-3 px-6 w-full text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={state.mo}
                onChange={(e) => setState({ ...state, mo: e.target.value })}
              />
            </div>
          ) : null}

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => router.push("/inventoryTransaction")}
              className="bg-red-500 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              {id ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </RouteLayout>
  );
}

export default InputInventory;
