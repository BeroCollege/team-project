"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NavBtn({ btnName, icon, colorVar, blackText }) {
  const router = useRouter();

  const handleClick = () => {
    if (btnName === "Actions") {
      router.push("/?category=all");
    } else {
      // fallback (or you could route elsewhere later)
    }
  };

  return (
    <div
      className="nav-btn"
      onClick={handleClick}
      style={{ backgroundColor: colorVar, cursor: "pointer" }}
    >
      <Image src={icon} alt={btnName} />
      <p style={{ color: blackText ? "black" : undefined }}>{btnName}</p>
    </div>
  );
}
