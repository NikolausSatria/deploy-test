"use client";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import LogoHakedo from "./logoimages/logoHakedo.png";

import {
  ArticleIcon,
  CollapsIcon,
  HomeIcon,
  LogoIcon,
  LogoutIcon,
  UsersIcon,
  VideosIcon,
} from "../icons";

import {
  MdSpaceDashboard,
  MdInput,
  MdInventory,
  MdOutlineHistory,
  MdLogout,
} from "react-icons/md";

import { GrDocumentUpload } from "react-icons/gr";
import { BsDatabaseFill } from "react-icons/bs";
import { GoSidebarCollapse } from "react-icons/go";
import { signIn, signOut, useSession } from "next-auth/react";
import Swal from "sweetalert2";



const menuItems = [
  { id: 1, label: "Dashboard", icon: MdSpaceDashboard, link: "/dashboard" },
  { id: 2, label: "Input Inventory", icon: MdInput, link: "/inputInventory" },
  { id: 3, label: "Create DN", icon: GrDocumentUpload, link: "/DNsection" },
  {
    id: 4,
    label: "Inventory Transaction",
    icon: MdInventory,
    link: "/inventoryTransaction",
  },
  { id: 5, label: "Database SKU", icon: BsDatabaseFill, link: "/databaseSKU" },
];

const handleLogout = async () => {
  Swal.fire({
    title: "Logout",
    text: "Are you sure?",
    confirmButtonText: "Logout",
    confirmButtonColor: '#d33',
    showCancelButton: true,
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      signOut({ redirect: false });
    } else {
    }
  });
};

const Sidebar = () => {
  const [toggleCollapse, setToggleCollapse] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);

  const router = useRouter();
  //For logout
  const [buttonPopup, setButtonPopup] = useState(false);

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
    "p-4 rounded bg-gray-100 absolute right-0",
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

  const { data: session } = useSession();

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
            <Image height={80} width={80} src={LogoHakedo}></Image>
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

        <div className="flex flex-col items-start mt-20">
          {menuItems.map(({ icon: Icon, ...menu }) => {
            const classes = getNavItemClasses(menu);
            return (
              <div className={classes}>
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
