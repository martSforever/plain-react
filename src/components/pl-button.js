import React from 'react';

export default class PlButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <button>
                {this.props.label}
            </button>
        );
    }
}