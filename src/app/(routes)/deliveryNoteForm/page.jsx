"use client";
import React, { useState, useEffect } from "react";
import RouteLayout from "../RouteLayout";
import AsyncSelect from "react-select/async";
import makeAnimated from "react-select/animated";
import { components } from "react-select";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

function deliveryNoteForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const employee_id = session?.user?.id;

  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    formList: [{ product_id: 0, qty: "" }],
    date_at: "",
    po: "",
    dn: "",
    so: "",
    phone_number: "",
    license_plate_no: "",
    customer_id: "",
    delivery_note: "",
    company_name: "",
    address: "",
    uom: "",
    employee_id: "",
    pic: "",
  });

  useEffect(() => {
    if (employee_id) {
      setState((prevState) => ({
        ...prevState,
        employee_id: employee_id,
      }));
    }
  }, [employee_id]);

  // search inventory
  const animatedComponent = makeAnimated();

  const loadOption = async (inputValue) => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_URL
        }/api/search?search_query=${encodeURIComponent(inputValue)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const json = await response.json();
      return json.searchs.map((item) => ({
        label: `${item.id} | ${item.description}`,
        value: item.id,
      }));
    } catch (error) {
      console.error("There has been a problem with fetch operation:", error);
    }
  };

  const addNewProduct = () => {
    setState((prevState) => ({
      ...prevState,
      formList: [...prevState.formList, { product_id: 0, qty: "" }],
    }));
  };

  const deleteProduct = (deletedIndex) => {
    const updateFormList = state.formList.filter(
      (_, index) => index !== deletedIndex
    );
    setState(() => ({
      ...state,
      formList: updateFormList,
    }));
  };

  const handleProductChange = (selectedOption, index) => {
    const newFormList = [...state.formList];
    newFormList[index] = {
      ...newFormList[index],
      product_id: selectedOption ? selectedOption.value : 0, // Simpan nilai id produk
      productName: selectedOption ? selectedOption.label : "", // Simpan label produk
    };
    setState((prevState) => ({
      ...prevState,
      formList: newFormList,
    }));
  };

  const handleQuantityChange = (e, index) => {
    const updatedFormList = state.formList.map((item, i) =>
      i === index ? { ...item, qty: e.target.value } : item
    );
    setState({ ...state, formList: updatedFormList });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tampilkan konfirmasi sebelum mengirim
    const result = await Swal.fire({
      title: "Confirmation",
      text: "Are you sure you want to submit this data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Submit!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/inputdn`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(state),
          }
        );

        const data = await response.json();
        console.log("Response data:", data); // Tambahkan log untuk memeriksa respons
        if (response.ok) {
          Swal.fire({
            title: "Data Saved",
            text: "Successfully save Delivery Note.",
            icon: "success",
            confirmButtonText: "Download File",
            confirmButtonColor: "#3085d6",
          }).then((result) => {
            if (result.isConfirmed) {
              const _dn_no = encodeURIComponent(state.dn);
              const _so_no = encodeURIComponent(state.so);
              const _date_at = encodeURIComponent(state.date_at);
              const _customer_id = encodeURIComponent(state.customer_id);
              const downloadUrl = `/download?delivery_note_no=${_dn_no}&so_no=${_so_no}&date_at=${_date_at}&customer_id=${_customer_id}`;
              window.open(downloadUrl, "_blank");
              
            } else {
              router.push(`/inventoryTransaction`);
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to Save Data: " + data.message,
            confirmButtonColor: "#3085d6", // Tampilkan pesan error dari server
          });
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error: " + error.message,
          confirmButtonColor: "#3085d6", // Tampilkan pesan error
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <RouteLayout>
      <div className="flex max-h-fit w-auto p-5 flex-col bg-white text-left font-sans font-medium shadow-md">
        <div className="flex justify-center text-center items-center">
          <h1 className="font-medium text-3xl p-5">CREATE DN</h1>
        </div>

        <div className="px-3 flex space-x-5">
          {/* SO Number*/}
          <div className="mb-5 w-full">
            <label
              htmlFor="POnumber"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              SO Number
            </label>
            <input
              type="number"
              id="POnumber"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="SO Number"
              required
              value={state.so}
              onChange={(e) => setState({ ...state, so: e.target.value })}
            />
          </div>
        </div>

        <div className="px-3 flex space-x-5"></div>
        {/**Add button */}
        <div className="px-3 flex justify-end">
          <button
            type="button"
            className="text-white h-[40px] mt-3 bg-blue-700 hover:bg-blue-600 outline-none focus:font-medium rounded-full text-sm px-5 py-2 text-center mr-2 mb-"
            onClick={addNewProduct}
          >
            Add Product
          </button>
        </div>

        {state.formList.map((item, index) => (
          <div className="px-3" key={item.id || index}>
            <div className="px-3 mt-5 flex space-x-5">
              <div className="mb-5 w-full">
                <label
                  htmlFor={`productName_${index}`}
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Product Name
                </label>
                <AsyncSelect
                  cacheOptions
                  loadOptions={loadOption}
                  defaultOptions
                  value={
                    state.formList[index].productName
                      ? {
                          label: state.formList[index].productName,
                          value: state.formList[index].product_id,
                        }
                      : null
                  }
                  // value={selectedProduct}
                  onChange={(selectedOption) =>
                    handleProductChange(selectedOption, index)
                  }
                  components={{ ...animatedComponent, ...components }}
                />
              </div>
            </div>
            <div className="px-3 flex space-x-5">
              <div className="mb-5 w-1/2">
                <label
                  htmlFor={`quantity_${index}`}
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id={`quantity_${index}`}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Enter Quantity"
                  value={item.qty}
                  onChange={(e) => handleQuantityChange(e, index)}
                  // onChange={(e) => handleInputChange(e, index, "qty")}
                  required
                />
              </div>

              {/* Uom Container*/}
              <div className="mb-5 w-1/2">
                <label
                  htmlFor="deliverynumber"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  UoM
                </label>
                <input
                  type="text"
                  id="customerID"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Enter UoM"
                  required
                  value={state.uom}
                  onChange={(e) => setState({ ...state, uom: e.target.value })}
                />
              </div>
            </div>
            {/** Delete button container */}
            <div className="flex px-3">
              <button
                type="button"
                className="text-white flex relative justify-between h-[40px] mt-3 bg-red-700 hover:bg-red-600 outline-none focus:font-medium rounded-full text-sm px-5 py-2 text-center mx-90 mr-2 mb-5"
                onClick={() => deleteProduct(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        <div className="px-3 flex space-x-5  mb-5 mt-5">
          <span className="w-full p-0.5  bg-blue-600"></span>
        </div>

        <div className="px-3 flex space-x-5">
          {/* Dare Section */}

          <div className="mb-5 w-1/2">
            <label
              htmlFor="datecontainer"
              className=" mb-2 block text-base font-medium text-[#545353]"
            >
              Date
            </label>
            <input
              type="date"
              name="date"
              id="datecontainer"
              className="w-full block rounded-md border  border-gray-300 bg-white py-1 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              value={state.date_at}
              onChange={(e) => setState({ ...state, date_at: e.target.value })}
            />
          </div>

          {/* Delivery Number container*/}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="deliverynumber"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Delivery Note Number
            </label>
            <input
              type="text"
              id="neckType"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="DN No."
              value={state.dn}
              onChange={(e) => setState({ ...state, dn: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="px-3 flex space-x-5"></div>

        <div className="px-3 flex space-x-5">
          {/* License Plate No container*/}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="deliveryNote"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              License Plate No
            </label>
            <input
              type="text"
              id="LicensePlate"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder=" Enter Lisance Plate Number"
              required
              value={state.license_plate_no}
              onChange={(e) =>
                setState({ ...state, license_plate_no: e.target.value })
              }
            />
          </div>

          {/* PO Number*/}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="POnumber"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              PO Number
            </label>
            <input
              type="text"
              id="POnumber"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter PO number"
              required
              value={state.po}
              onChange={(e) => setState({ ...state, po: e.target.value })}
            />
          </div>
        </div>

        <div className="px-3 flex space-x-5">
          {/* Customer ID Container*/}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="deliverynumber"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Customer ID
            </label>
            <input
              type="number"
              id="customerID"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter Customer ID"
              required
              value={state.customer_id}
              onChange={(e) =>
                setState({ ...state, customer_id: e.target.value })
              }
            />
          </div>
          {/* Delivery Note container */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="deliveryNote"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Customer Name
            </label>
            <input
              type="text"
              id="companyName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder=" Enter Company Name"
              required
              value={state.company_name}
              onChange={(e) =>
                setState({ ...state, company_name: e.target.value })
              }
            />
          </div>
        </div>

        <div className="px-3 flex space-x-5">
          <div className="mb-5 w-full">
            <label
              htmlFor="deliverynumber"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Delivery Note
            </label>
            <input
              type="text"
              id="customerID"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter Delivery Note"
              required
              value={state.delivery_note}
              onChange={(e) =>
                setState({ ...state, delivery_note: e.target.value })
              }
            />
          </div>
        </div>

        <div className="px-3 flex space-x-5">
          <div className="mb-5 w-full">
            <label
              htmlFor="deliverynumber"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Company Address
            </label>
            <input
              type="text"
              id="customerID"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter Company Address"
              required
              value={state.address}
              onChange={(e) => setState({ ...state, address: e.target.value })}
            />
          </div>
        </div>

        <div className="px-3 flex space-x-5">
          {/* Phone Number Container */}
          <div className="mb-5 w-1/2">
            <label
              htmlFor="Contactnumber"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Phone Number
            </label>
            <input
              type="number"
              id="Contactnumber"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter contact number"
              required
              value={state.phone_number}
              onChange={(e) =>
                setState({ ...state, phone_number: e.target.value })
              }
            />
          </div>
          {/* On behalf of container*/}
          <div className=" block mb-5 w-1/2">
            <label
              htmlFor="behalfPerson"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              PIC
            </label>
            <input
              type="text"
              id="behalfPerson"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="PIC"
              value={state.pic}
              onChange={(e) => setState({ ...state, pic: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="button"
          className="text-white h-[40px] mt-3 bg-blue-700 hover:bg-blue-600 outline-none focus:font-medium rounded-full text-sm px-5 py-2 text-center mr-2 mb- w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </RouteLayout>
  );
}

export default deliveryNoteForm;
