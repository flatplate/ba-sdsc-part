class AlertService {
    constructor() {
        this.alerts = [];
        this.listeners = [];
    }

    notify() {
        this.listeners.forEach((listener) => listener(this.alerts));
    }

    addAlert(type, message) {
        const alert = { type: type, message: message };
        this.alerts.push(alert);
        setTimeout(() => this.removeAlert(alert), 5000)
        this.notify();
    }

    removeAlert(alert) {
        this.alerts = this.alerts.filter(oldAlert => oldAlert !== alert);
        this.notify();
    }

    error(message) {
        this.addAlert("error", message);
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    removeListener(listener) {
        this.listeners = this.listeners.filter(
            (oldListener) => oldListener !== listener
        );
    }
}

const alertService = new AlertService();

export { alertService };
