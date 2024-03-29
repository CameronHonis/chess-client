import React from "react";
// //@ts-ignore
// import blackBishopPng from "../../res/bb.png";
// //@ts-ignore
// import whiteBishopPng from "../../res/wb.png";

interface Props {
    isWhite: boolean
    onDragStart?: (ev: React.DragEvent<HTMLImageElement>) => void;
    onDragEnd?: (ev: React.DragEvent<HTMLImageElement>) => void;
    classNames?: string[];
}

export const Bishop: React.FC<Props> = (props) => {
    const {isWhite, classNames} = props;
    const finalClassNames = React.useMemo(() => {
        const rtn = ["Bishop"];
        if (classNames)
            rtn.push(...classNames);
        if (isWhite) {
            rtn.push("WhiteBishop");
        } else {
            rtn.push("BlackBishop");
        }
        return rtn;
    }, [isWhite, classNames])
    // return <svg version="1.1"
    //             viewBox="0 0 301.885 301.885" className={classNames.join(" ")}>
    //     <g>
    //         <path d="M228.942,248.455h-17.68l-19.825-122.46c0,0,0-0.065,0.065-0.065l9.165-20.865c4.225-8.255,3.055-18.265-3.055-26.13
    // 		l-31.785-40.82c6.305-6.565,8.515-15.6,5.59-23.595c-3.38-9.23-12.285-15.34-20.8-14.43c-9.555,0.13-18.005,6.63-20.28,15.535
    // 		c-2.6,7.54-0.195,16.25,5.98,22.23l-31.98,41.08c-6.11,7.865-7.28,17.875-3.055,26.13l9.165,20.865c0,0,0,0.065,0.065,0.065
    // 		l-19.825,122.46H72.942c-2.665,0-4.875,2.21-4.875,4.875v43.68c0,2.665,2.21,4.875,4.875,4.875h156
    // 		c2.665,0,4.875-2.21,4.875-4.875v-43.68C233.817,250.665,231.607,248.455,228.942,248.455z M139.502,18.68
    // 		c0.065-0.195,0.13-0.325,0.13-0.52c1.17-4.745,5.98-8.385,11.18-8.385c0.195,0,0.39,0,0.65-0.065
    // 		c4.16-0.52,8.905,2.99,10.725,8.06c1.495,4.03,0.455,8.71-2.535,12.48l-4.94-6.305c-0.91-1.17-2.34-1.885-3.835-1.885
    // 		s-2.925,0.715-3.835,1.885l-4.745,6.11C139.632,27,138.072,22.71,139.502,18.68z M110.122,100.97
    // 		c-0.065-0.065-0.065-0.195-0.13-0.26c-2.535-4.875-1.755-10.92,2.015-15.795l38.935-50.05l25.35,32.565l-12.74,21.71
    // 		c-1.365,2.34-0.585,5.33,1.755,6.695c0.78,0.455,1.625,0.65,2.47,0.65c1.69,0,3.315-0.845,4.225-2.405l10.79-18.395l7.15,9.165
    // 		c3.77,4.875,4.55,10.92,2.015,15.795c-0.065,0.065-0.065,0.195-0.13,0.26l-7.93,18.135h-65.78L110.122,100.97z M119.872,128.855
    // 		h62.14l19.37,119.665H100.437L119.872,128.855z M224.002,292.135H77.817v-33.93h16.9h129.285V292.135z"/>
    //     </g>
    // </svg>
    return <img
        onDragStart={props.onDragStart}
        onDragEnd={props.onDragEnd}
        className={finalClassNames.join(" ")}
        src={isWhite ? "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg"}
        alt={isWhite ? "white bishop" : "black bishop"}
    />;
}