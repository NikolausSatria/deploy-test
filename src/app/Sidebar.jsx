"use client";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import LogoHakedo from "./Images/Hakedologo.png";
import {
  CollapsIcon,
} from "../icons";

import {
  MdSpaceDashboard,
  MdInput,
  MdInventory,
  MdLogout,
} from "react-icons/md";

import { GrDocumentUpload } from "react-icons/gr";
import { BsDatabaseFill } from "react-icons/bs";
import { signOut, useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { usePathname } from "next/navigation";


const Sidebar = () => {
  const pathname = usePathname();
  const [toggleCollapse, setToggleCollapse] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();
  const [isCollapsible, setIsCollapsible] = useState(false);

  const menuItems = [
    { id: 1, label: "Dashboard", icon: MdSpaceDashboard, link: "/dashboard" },
    { id: 2, label: "Input Inventory", icon: MdInput, link: "/inputInventory" },
    { id: 3, label: "Create DN", icon: GrDocumentUpload, link: "/deliveryNoteForm" },
    {
      id: 4,
      label: "Inventory Transaction",
      icon: MdInventory,
      link: "/inventoryTransaction",
    },
    {
      id: 5,
      label: "Database SKU",
      icon: BsDatabaseFill,
      link: "/databaseSKU",
    },
  ];

  if (pathname === "/download") return null;

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        signOut({ callbackUrl: 'http://88.222.242.224' });
      }
    });
  };

  const activeMenu = useMemo(
    () => menuItems.find((menu) => menu.link === router.pathname),
    [router.pathname]
  );

  //To measure size of the Navbar
  const wrapperClasses = classNames(
    "h-screen px-4 pt-8 pb-4 bg-light flex justify-between flex-col",
    {
      ["w-80"]: !toggleCollapse,
      ["w-20"]: toggleCollapse,
    }
  );

  const collapseIconClasses = classNames(
    "p-4 rounded bg-gray-100 absolute right-0 z-10",
    {
      "rotate-180": toggleCollapse,
    }
  );

  const getNavItemClasses = (menu) => {
    return classNames(
      "flex items-center cursor-pointer hover:bg-light-lighter rounded w-full overflow-hidden whitespace-nowrap",
      {
        ["bg-light-lighter"]: activeMenu && activeMenu.id === menu.id,
      }
    );
  };

  const onMouseOver = () => {
    setIsCollapsible(!isCollapsible);
  };

  const handleSidebarToggle = () => {
    setToggleCollapse(!toggleCollapse);
  };

  return (
    <div
      className={wrapperClasses}
      onMouseEnter={onMouseOver}
      onMouseLeave={onMouseOver}
      style={{ transition: "width 300ms cubic-bezier(0.2, 0, 0, 1) 0s" }}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center pl-1 gap-4">
            <Image height={80} width={80} src={LogoHakedo} alt="Logo Hakedo Putra Mandiri"></Image>
            <span
              className={classNames("mt-2 text-md font-medium text-text", {
                hidden: toggleCollapse,
              })}
            >
              Hakedo Putra Mandiri
            </span>
          </div>

          {isCollapsible && (
            <button
              className={collapseIconClasses}
              onClick={handleSidebarToggle}
            >
              <CollapsIcon />
            </button>
          )}
        </div>
        <div className="flex flex-col items-start mt-10">
          <div className="flex px-15 items-center w-full h-full">
            {session ? (
              <div className="text-md font-medium text-text-light">
                Welcome, {session.user.name}!
              </div> //
            ) : (
              <p>Please Login.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start mt-10">  
        {menuItems.map(({ icon: Icon, ...menu }, index) => { // Menambahkan index sebagai parameter  
          const classes = getNavItemClasses(menu);  
          return (  
            <div key={menu.id || index} className={classes}> {/* Menambahkan key di sini */}  
              <Link href={menu.link}>  
                <div className="flex py-4 px-3 items-center w-full h-full">  
                  <div style={{ width: "2.5rem" }}>  
                    <Icon />  
                  </div>  
                  {!toggleCollapse && (  
                    <span  
                      className={classNames(  
                        "text-md font-medium text-text-light"  
                      )}  
                    >  
                      {menu.label}  
                    </span>  
                  )}  
                </div>  
              </Link>  
            </div>  
          );  
        })}  
      </div> 
      </div>

      <button onClick={handleLogout}>
        <div className={`${getNavItemClasses({})} px-3 py-4`}>
          <div style={{ width: "2.5rem" }}>
            <MdLogout />
          </div>
          {!toggleCollapse && (
            <span className={classNames("text-md font-medium text-text-light")}>
              Logout
            </span>
          )}
        </div>
      </button>
    </div>
  );
};

export default Sidebar;
