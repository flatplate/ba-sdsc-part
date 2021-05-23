import {faDownload} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';

class ExportFloatingButton extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className='fixed right-0 bottom-0 p-16'>
                <a href={this.props.api.getExportCsvLink() }>
                    <div className='rounded-full bg-primary-600 cursor-pointer text-white hover:bg-primary-500 w-16 h-16 flex justify-center items-center text-3xl'>
                        <FontAwesomeIcon icon={faDownload} />
                    </div>
                </a>
            </div>
        );
    }
}

export default ExportFloatingButton;
