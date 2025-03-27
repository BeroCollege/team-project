import Image from "next/image";


export default function NavBtn({ btnName, icon, colorVar, blackText }) {
    // console.log(blackText);
    
    return (
        <a href="#">
            <div className="nav-btn" style={{ backgroundColor: colorVar }}>
                <Image src={icon} alt={btnName} />
                <p style={{ color: blackText ? "black" : undefined }}>{btnName}</p>
            </div>
        </a>
    )
}