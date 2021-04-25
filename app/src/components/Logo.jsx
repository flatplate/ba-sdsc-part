import React from "react";
import SdscLogo from "../images/sdsc-logo.png";

class Logo extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="absolute top-0 left-0 p-8 py-4">
                <a href="https://www.sdsc-bw.de">
                    <img src={SdscLogo} className="w-72" />
                </a>
            </div>
        );
    }
}
export default Logo;
