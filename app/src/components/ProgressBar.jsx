import React from "react";

class ProgressDataStore {
    constructor() {
        this.progressListeners = [];
        this.progress = 0;
        this.inProgress = false;
        this.maxProgress = null;
    }

    setProgress(progress) {
        this.progress = progress;
        this.broadcastProgress();
    }

    broadcastProgress() {
        this.progressListeners.forEach((listener) =>
            listener(this.progress)
        );
    }

    addListener(listener) {
        this.progressListeners.push(listener);
    }

    removeListener(listener) {
        const index = this.progressListeners.indexOf(listener);
        if (index === -1) {
            return;
        }
        this.progressListeners.splice(index, 1, null);
    }

    stopProgress() {
        this.inProgress = false;
        this.progress = 0;
        this.broadcastProgress();
    }
}

const progressManager = new ProgressDataStore();

class ProgressBar extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { progress: 0 };
        progressManager.addListener((progress) =>
            this.setState({ progress: progress * 100 })
        );
    }

    render() {
        const transition = this.state.progress === 0 ? "" : "transition-all"
        return (
            <div
                className={`${transition} duration-50 fixed h-2 bg-gradient-to-r from-ternary-500 via-primary-500 to-secondary-500 top-0 left-0 z-10`}
                style={{ width: `${this.state.progress}%` }}
            ></div>
        );
    }
}

export default ProgressBar;
export { progressManager };
