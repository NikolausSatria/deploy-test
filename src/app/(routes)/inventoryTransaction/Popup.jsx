import React from 'react'
import {AiOutlineCloseCircle} from 'react-icons/ai';

function Popup(props) {
  return (props.trigger) ? (
    <div className='popUp bg-slate-50 border-4 border-blue-500 rounded-md h-[389px] w-[618px] fixed left-[35%] top-[30%]'>
        {/* IDate input form */}
            <div className='flex flex-col items-center justify-center'>
                          <div className='flex justify-between'>
                            <h1 className='p-2 text-xl font-semibold'>Select date of document</h1>
                            <button onClick={()=> props.setTrigger(false)} type='button' className='absolute right-[20px] top-2'>
                              <AiOutlineCloseCircle size={"30px"}/>
                            </button>
                          </div>
              
                        <div className="mb-5 p-9">
                        <label
                        htmlFor="date"
                        className="mb-3 block text-base font-medium text-[#545353]"
                        >
                        Date
                        </label>
                        <input
                        type="date"
                        name="date"
                        id="date"
                        className=" h-[50px] w-[530px] rounded-md border border-[#545353] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        />
                    </div>
                <button type="button" className="text-white h-[50px] w-[400px] mt-5 bg-blue-700 hover:bg-blue-600 outline-none focus:font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2">Download</button>
                {props.children}
            </div>
    </div>
  ) : "";
}

export default Popup