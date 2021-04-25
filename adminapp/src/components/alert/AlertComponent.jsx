import React from 'react';
import { alertService } from "../../services/AlertService";
import AlertBox from './AlertBox';

class AlertComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { alerts: [] }
    }

    componentDidMount() {
        alertService.addListener((alerts) => this.setState({ alerts: alerts }));
        this.setState(alertService.alerts);
    }

    render() {
        if (this.state.alerts.length > 0) {
            return (
                <div className="fixed w-screen top-0 z-20">
                    <div className="flex justify-center">
                        <div className="space-y-6 p-12">
                            {this.state.alerts.map((alert, i) => (
                                <AlertBox type={alert.type} onClick={() => alertService.removeAlert(alert)}>
                                    {alert.message}
                                </AlertBox>
                            ))}
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return null;
        }
    }
}

export default AlertComponent;