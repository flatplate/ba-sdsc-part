import React from "react";

class Button extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let color = this.props.color || "primary";
        let backgroundColor = this.props.outline ? "white" : color;
        let textColor = this.props.outline ? color : "white";
        let textSize = this.props.textSize ? "text-" + this.props.textSize : "text-lg";

        let classes = [
            "rounded-full",
            "border",
            "border-" + color + "-600",
            "hover:border-" + color + "-500",
            "bg-" + backgroundColor + "-600",
            "text-" + textColor + (this.props.outline ? "-600" : ""),
            "hover:bg-" + backgroundColor + "-500",
            "hover:text-" + textColor + (this.props.outline ? "-500" : ""),
            "px-4",
            "py-1",
            "inline-block",
            "cursor-pointer",
            textSize,
            "transition-all",
            "transition-300",
            "select-none",
            "align-middle",
            "items-center",
            "content-center",
            "flex",
        ];

        return (
            <div className={classes.join(" ")} {...this.props}>
                {this.props.leftLabel !== undefined && (<span className="float-left pr-2 text-sm font-bold align-middle">{this.props.leftLabel}</span>)}
                <span className="w-full text-center">
                    {this.props.children}
                </span>
            </div>
        );
    }
}

export default Button;
