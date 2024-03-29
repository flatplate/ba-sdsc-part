import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

const config = {
    minScrollForTransparent: 1,
    maxWidthForResponsiveMenu: 1024,
};

class NavBar extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.api = this.props.api;
        this.state = { atTop: true, small: false, menuOpened: false };
        this.toggleMenu = this.toggleMenu.bind(this);
        this.updateScrollLocation = this.updateScrollLocation.bind(this);
        this.resizeListener = this.resizeListener.bind(this);
    }

    componentDidMount() {
        this.updateScrollLocation();
        window.addEventListener("resize", this.resizeListener);
        window.addEventListener("scroll", this.updateScrollLocation);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeListener);
        window.removeEventListener("scroll", this.updateScrollLocation);
    }

    updateScrollLocation() {
        const position = window.pageYOffset;
        this.state.atTop = position < config.minScrollForTransparent;
        this.setState({});
    }

    resizeListener() {
        this.state.small = window.innerWidth < config.maxWidthForResponsiveMenu;
        this.setState({});
    }

    toggleMenu() {
        this.state.menuOpened = !this.state.menuOpened;
        this.setState({});
    }

    render() {
        return (
            <nav
                className={
                    "flex w-full fixed items-center z-10 transition-all duration-500 top-0 justify-between flex-wrap bg-primary-600 " +
                    (!this.state.atTop
                        ? " bg-opacity-50 p-2 text-white"
                        : " p-6 shadow-md text-white")
                }
            >
                <Link to="/">
                    <div
                        className={
                            "flex items-center flex-no-shrink mr-6 "
                        }
                    >
                        <span className="font-semibold text-xl tracking-tight">SDSC PART</span>
                    </div>
                </Link>
                <div className="block lg:hidden">
                    <button
                        className="flex items-center px-3 py-2 border rounded text-teal-lighter border-teal-light hover:text-primary-300 hover:border-white"
                        onClick={this.toggleMenu}
                    >
                        <svg className="h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <title>Menu</title>
                            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                        </svg>
                    </button>
                </div>
                <div
                    className={
                        "w-full block flex-grow transition-all duration-500 overflow-hidden lg:h-auto lg:space-x-6 lg:flex lg:items-center lg:w-auto" +
                        (this.state.menuOpened ? " h-40" : " h-0")
                    }
                >
                    <div className="text-sm lg:flex-grow">
                        <Link
                            to="/responses"
                            className={
                                "block mt-4 lg:inline-block lg:mt-0 ml-4 hover:text-gray-200 font-bold transition-all duration-200"
                            }
                        >
                            Responses
                        </Link>
                        <Link
                            to="/questions"
                            className={
                                "block mt-4 lg:inline-block lg:mt-0 ml-4 hover:text-gray-200 font-bold transition-all duration-200"
                            }
                        >
                            Questions
                        </Link>
                        <Link
                            to="/surveys"
                            className={
                                "block mt-4 lg:inline-block lg:mt-0 ml-4 hover:text-gray-200 font-bold transition-all duration-200"
                            }
                        >
                            Surveys
                        </Link>
                        <Link
                            to="/evaluation"
                            className={
                                "block mt-4 lg:inline-block lg:mt-0 ml-4 hover:text-gray-200 font-bold transition-all duration-200"
                            }
                        >
                            Evaluation
                        </Link>
                    </div>
                    <div className="space-x-6 flex items-center">
                        <div className="inline-block text-xl text-white cursor-pointer hover:text-gray-300">
                            <Link to="/settings/account">
                                <FontAwesomeIcon
                                    icon={faCog}
                                    className="transform hover:rotate-90 transition-all duration-300"
                                />
                            </Link>
                        </div>
                        <div
                            className="block mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:text-white cursor-pointer"
                            onClick={() => this.api.logout().then(() => window.location.reload())}
                        >
                            Logout
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavBar;
