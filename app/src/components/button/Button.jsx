import React from "react";

class Button extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let color = this.props.color || "primary";
        let backgroundColor = this.props.outline ? "white" : color;
        let textColor = this.props.outline ? color : "white";
        let defaultColorIntensity = this.props.disabled ? "-800" : "-400"
        let hoverColorIntensity = this.props.disabled ? "-800" : "-500"

        let classes = [
            "rounded-full",
            "border",
            "border-" + color + defaultColorIntensity,
            "hover:border-" + color + hoverColorIntensity,
            "bg-" + backgroundColor + defaultColorIntensity,
            "text-" + textColor + (this.props.outline ? defaultColorIntensity : ""),
            "hover:bg-" + backgroundColor + hoverColorIntensity,
            "hover:text-" + textColor + (this.props.outline ? hoverColorIntensity : ""),
            "px-4",
            "py-1",
            "inline-block",
            "xl:text-lg text-md",
            "transition-all",
            "transition-300",
            "select-none",
            "align-middle",
            "items-center",
            "content-center",
            "flex",
        ];

        !this.props.disabled && classes.push("cursor-pointer")

        // Compare with undefined since the leftlabel can be 0
        return (
            <div className={classes.join(" ")} {...this.props} onClick={() => !this.props.disabled && this.props.onClick && this.props.onClick()}>
                {this.props.leftLabel !== undefined && (<span className="float-left pr-2 text-sm font-bold align-middle">{this.props.leftLabel}</span>)}
                <span className="w-full text-center">
                    {this.props.children}
                </span>
            </div>
        );
    }
}

export default Button;
