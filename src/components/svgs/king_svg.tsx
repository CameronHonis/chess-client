import React from "react";

interface Props {
    isWhite: boolean
}

export const King: React.FC<Props> = (props) => {
    const {isWhite} = props;
    return <svg version="1.1" viewBox="0 0 39.26 39.26" className={isWhite ? "WhitePawn" : "BlackPawn"}>
        <g>
            <path d="M28.103,32.97v-4.81h-2.271V15.557h2.271v-4.453V9.267V0.106l-4.832,3.488l-3.75-2.772L15.706,3.58L11.157,0v9.267v1.837
		v4.453h2.271V28.16h-2.271v4.81H8.284v6.29h22.691v-6.29H28.103z M13.156,4.121l2.496,1.964l3.853-2.784l3.75,2.771l2.849-2.055
		v5.088H13.157L13.156,4.121L13.156,4.121z M13.156,11.268h12.946v2.29H13.156V11.268z M23.831,15.558v12.525h-8.404V15.558H23.831z
		 M13.156,30.16h12.946v2.289H13.156V30.16z M28.976,37.26H10.284v-2.29h18.691V37.26z"/>
        </g>
    </svg>
}