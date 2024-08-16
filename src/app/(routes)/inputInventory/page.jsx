"use client";
import React, { useState, useEffect, Component } from "react";
import RouteLayout from "../RouteLayout";
import { useRouter, useSearchParams } from "next/navigation";
// import { useRouter } from "next/router";
import toast from "react-hot-toast";
import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";
// import { components } from "react-select-virtualized";
import { useSession } from "next-auth/react";


function InputInventory() {
  const optionProductDetail = ["IN-INT", "OUT-INT", "IN-EXT", "OUT-EXT"];
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // if (!session || !session.user) {
  //   router.push("/");
  // }
  console.log(session);

  useEffect(() => {
    if (id) {
      // Fetch data dari API berdasarkan ID
      fetch(`/api/updateInventory?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          // Pastikan respons API sesuai dengan struktur
          // console.log(data.inventory);
          const inventoryData = data.inventory[0];
          const formattedDate = inventoryData.date_at.split("T")[0];
          setState({
            in_out: inventoryData.in_out || null,
            date_at: formattedDate || null,
            lot: inventoryData.lot || null,
            dn: inventoryData.dn || null,
            po: inventoryData.po || null,
            mo: inventoryData.mo || null,
            qty: inventoryData.qty || 0,
          });

          // console.log(inventoryData.product_id);
          loadOption(inventoryData.product_id).then((options) => {
            const productOption = options.find(
              (option) => option.value === inventoryData.product_id
            );
            if (productOption) {
              setSelectedProduct(productOption);
            } else {
              console.log(
                "Product not found for ID:",
                inventoryData.product_id
              );
            }
          });
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [id]);

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

  // search inventory
  const animatedComponent = makeAnimated();

  const loadOption = (inputValue) => {
    const apiUrl = `${
      process.env.NEXT_PUBLIC_URL
    }/api/search?search_query=${encodeURIComponent(inputValue)}`;
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
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };

  const handleSelectChange = (event) => {
    // setSelectedState(event.target.value)
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
    console.log(selectedProduct);

    const isFormValid = validateForm();
    if (!isFormValid) return;

    if (!session) {
      toast.error("Please login!.");
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
    
    // `${process.env.NEXT_PUBLIC_URL}/api/inventory`,
    const res = await fetch(
      url,
      postData
    );
    if (res?.ok) {
      router.push("/inventoryTransaction");
      toast.success("Data Successfully Input");
    } else {
      toast.error("Failed Input");
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
      <div className="flex h-full w-auto p-5 flex-col bg-white text-left font-sans font-medium shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="font-medium text-4xl">INPUT INVENTORY</h1>
        </div>

        {/** form input container */}
        <div className="bg-white shadow-md rounded px-8 pt-4 pb-5 mb-4 flex flex-col my-2 border-2 border-blue-500">
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
                onChange={setSelectedProduct}
                // components={{ ...animatedComponent, ...components }}
                components={{ ...animatedComponent, ...Component }}
                isDisabled={!!id}
              />
            </div>
          </div>

          <div className="flex mb-5 space-x-5">
            {/*Quantity Container */}
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
                onChange={(e) =>
                  setState({ ...state, date_at: e.target.value })
                }
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

                  {optionProductDetail.map((optionProduct) => {
                    return (
                      <option key={optionProduct} value={optionProduct}>
                        {optionProduct}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>

          <div className="px-3 flex space-x-5">
            {/* Lot No */}
            <div className="mb-5 w-1/2">
              <label
                htmlFor="neckType"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                LOT No.
              </label>
              <input
                type="text"
                autoComplete="off"
                id="neckType"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="LOT No."
                value={state.lot}
                onChange={(e) => setState({ ...state, lot: e.target.value })}
                required
              />
            </div>
            {/* DN No.*/}
            <div className="mb-5 w-1/2">
              <label
                htmlFor="material"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                DN No.
              </label>
              <input
                type="text"
                autoComplete="off"
                disabled={
                  state.in_out === "IN-INT" || state.in_out === "OUT-INT"
                }
                id="material"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="DN No."
                required={
                  state.in_out === "INT-EXT" || state.in_out === "OUT-EXT"
                }
                value={state.dn}
                onChange={(e) => setState({ ...state, dn: e.target.value })}
              />
            </div>
          </div>
          <div className="px-3 flex space-x-5">
            {/* PO NO. */}
            <div className="mb-5 w-1/2">
              <label
                htmlFor="Weight"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                PO No.
              </label>
              <input
                //   type="number"
                autoComplete="off"
                disabled={
                  state.in_out === "IN-INT" || state.in_out === "OUT-INT"
                }
                id="Weight"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="PO No."
                required={
                  state.in_out === "INT-EXT" || state.in_out === "OUT-EXT"
                }
                value={state.po}
                onChange={(e) => setState({ ...state, po: e.target.value })}
              />
            </div>
            {/* MO No.*/}
            <div className="mb-5 w-1/2">
              <label
                htmlFor="productMaterial"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                MO No.
              </label>
              <input
                id="productMaterial"
                autoComplete="off"
                disabled={
                  state.in_out === "IN-EXT" || state.in_out === "OUT-EXT"
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="MO No."
                required={
                  state.in_out === "IN-INT" || state.in_out === "OUT-INT"
                }
                value={state.mo}
                onChange={(e) => setState({ ...state, mo: e.target.value })}
              />
            </div>
          </div>
          {/* Submit button */}
          <a href="">
            <button
              type="button"
              className="text-white h-[50px] mt-5 bg-blue-700 hover:bg-blue-600 outline-none focus:font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb- w-full"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </a>
        </div>
      </div>
    </RouteLayout>
  );
}

export default InputInventory;
