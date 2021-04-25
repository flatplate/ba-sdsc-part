import React from "react";

class Button extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        // This is done to avoid the css optimizations done by tailwind later on
        const borderColorString =
            this.props.color === "primary"
                ? "border-primary-600"
                : this.props.color === "secondary"
                ? "border-secondary-600"
                : this.props.color === "ternary"
                ? "border-ternary-600"
                : "border-primary-600";
        const hoverBorderColorString =
            this.props.color === "primary"
                ? "hover:border-primary-500"
                : this.props.color === "secondary"
                ? "hover:border-secondary-500"
                : this.props.color === "ternary"
                ? "hover:border-ternary-500"
                : "hover:border-primary-500";
        const backgroundColorString = this.props.outline
            ? "bg-white"
            : this.props.color === "primary"
            ? "bg-primary-600"
            : this.props.color === "secondary"
            ? "bg-secondary-600"
            : this.props.color === "ternary"
            ? "bg-ternary-600"
            : "bg-primary-600";
        const backgroundHoverString = this.props.outline
            ? "hover:bg-white"
            : this.props.color === "primary"
            ? "hover:bg-primary-500"
            : this.props.color === "secondary"
            ? "hover:bg-secondary-500"
            : this.props.color === "ternary"
            ? "hover:bg-ternary-500"
            : "hover:bg-primary-500";
        const textColorString = this.props.outline
            ? this.props.color === "primary"
                ? "text-primary-600"
                : this.props.color === "secondary"
                ? "text-secondary-600"
                : this.props.color === "ternary"
                ? "text-ternary-600"
                : "text-primary-600"
            : "text-white";
        const textHoverString = this.props.outline
            ? this.props.color === "primary"
                ? "hover:text-primary-500"
                : this.props.color === "secondary"
                ? "hover:text-secondary-500"
                : this.props.color === "ternary"
                ? "hover:text-ternary-500"
                : "hover:text-primary-500"
            : "hover:text-white";

        let textSize = this.props.textSize || "text-lg";

        let classes = [
            "rounded-full",
            "border",
            borderColorString,
            hoverBorderColorString,
            backgroundColorString,
            textColorString,
            backgroundHoverString,
            textHoverString,
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
        !this.props.disabled && classes.push("cursor-pointer");

        // Compare with undefined since the leftlabel can be 0
        return (
            <div
                className={classes.join(" ")}
                {...this.props}
                onClick={() => !this.props.disabled && this.props.onClick && this.props.onClick()}
            >
                {this.props.leftLabel !== undefined && (
                    <span className="float-left pr-2 text-sm font-bold align-middle">{this.props.leftLabel}</span>
                )}
                <span className="w-full text-center">{this.props.children}</span>
            </div>
        );
    }
}

export default Button;
