import Image from "next/image";


export default function DashboardWidget({ headerName, icon, children, colorVar, blackText }) {
    return (
        <div className="dashboard-widget">
            <div className="header" style={{ backgroundColor: colorVar, color: blackText ? "black" : undefined }}>
                <Image src={icon} alt={headerName} />
                <p>{headerName}</p>
            </div>
            <div className="body">
                {children}
            </div>
        </div>
    );
}