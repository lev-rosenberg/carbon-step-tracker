"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./footer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faChartSimple,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  const pathname = usePathname();
  return (
    <nav className={styles.nav}>
      <Link
        className={`link ${pathname === "/home" ? "active" : ""}`}
        href="/home"
      >
        <FontAwesomeIcon icon={faHouse} />
      </Link>
      <Link
        className={`link ${pathname === "/add" ? "active" : ""}`}
        href="/add"
      >
        <FontAwesomeIcon icon={faPlus} />
      </Link>
      <Link
        className={`link ${pathname === "/stats" ? "active" : ""}`}
        href="/stats"
      >
        <FontAwesomeIcon icon={faChartSimple} />
      </Link>
    </nav>
  );
}
