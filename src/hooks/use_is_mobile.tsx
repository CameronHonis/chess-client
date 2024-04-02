import React from "react";
export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
    React.useEffect(() => {
        const onResize = () => {
            setIsMobile(window.innerWidth < 768);
        }
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    });

    return isMobile;
}