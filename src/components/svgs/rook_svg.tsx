import React from "react";

interface Props {
    isWhite: boolean
}

export const Rook: React.FC<Props> = (props) => {
    const {isWhite} = props;
    return <svg version="1.1" viewBox="0 0 512 512" className={isWhite ? "WhitePawn" : "BlackPawn"}>
        <g>
            <path d="M366.933,426.667h-1.075c5.896-7.356,9.609-16.358,9.609-25.6c0-16.051-6.468-35.908-13.952-58.914
			c-9.464-29.073-20.181-62.02-20.181-94.686c0-45.312,10.214-80.845,14.549-93.867h2.517c18.816,0,34.133-15.309,34.133-34.133
			V34.133C392.533,15.309,377.216,0,358.4,0h-25.6c-4.719,0-8.533,3.823-8.533,8.533v25.6h-34.133v-25.6
			c0-4.71-3.814-8.533-8.533-8.533h-51.2c-4.71,0-8.533,3.823-8.533,8.533v25.6h-34.133v-25.6c0-4.71-3.823-8.533-8.533-8.533h-25.6
			c-18.825,0-34.133,15.309-34.133,34.133v85.333c0,18.825,15.309,34.133,34.133,34.133h162.133c4.719,0,8.533-3.823,8.533-8.533
			c0-4.71-3.814-8.533-8.533-8.533H153.6c-9.412,0-17.067-7.654-17.067-17.067V34.133c0-9.412,7.654-17.067,17.067-17.067h17.067
			v25.6c0,4.71,3.823,8.533,8.533,8.533h51.2c4.71,0,8.533-3.823,8.533-8.533v-25.6h34.133v25.6c0,4.71,3.814,8.533,8.533,8.533
			h51.2c4.719,0,8.533-3.823,8.533-8.533v-25.6H358.4c9.421,0,17.067,7.654,17.067,17.067v85.333
			c0,9.412-7.646,17.067-17.067,17.067h-8.533c-3.482,0-6.622,2.125-7.927,5.359c-0.725,1.809-17.673,44.894-17.673,105.574
			c0,35.371,11.17,69.692,21.018,99.968c7.04,21.623,13.116,40.294,13.116,53.632c0,12.442-13.158,25.6-25.6,25.6H213.333
			c-4.71,0-8.533,3.823-8.533,8.533s3.823,8.533,8.533,8.533h153.6c12.442,0,25.6,13.158,25.6,25.6v25.6H119.467v-25.6
			c0-12.442,13.158-25.6,25.6-25.6H179.2c4.71,0,8.533-3.823,8.533-8.533s-3.823-8.533-8.533-8.533c-12.442,0-25.6-13.158-25.6-25.6
			c0-13.338,6.076-32.009,13.116-53.632c9.847-30.276,21.018-64.597,21.018-99.968c0-23.339-2.509-46.814-7.45-69.76
			c-0.998-4.617-5.564-7.526-10.138-6.545c-4.608,0.99-7.535,5.53-6.545,10.138c4.685,21.769,7.066,44.032,7.066,66.167
			c0,32.666-10.718,65.613-20.181,94.686c-7.484,23.006-13.952,42.863-13.952,58.914c0,9.233,3.678,18.253,9.566,25.6h-1.033
			c-21.931,0-42.667,20.736-42.667,42.667v34.133c0,4.71,3.823,8.533,8.533,8.533h290.133c4.719,0,8.533-3.823,8.533-8.533v-34.133
			C409.6,447.403,388.864,426.667,366.933,426.667z"/>
        </g>
    </svg>
}