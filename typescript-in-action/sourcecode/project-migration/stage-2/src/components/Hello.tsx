import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Hello extends Component {
    state = {
        count: 0
    }
    static defaultProps = {
        firstName: '',
        lastName: ''
    }
    render() {
        return (
            <>
                <p>你点击了 {this.state.count} 次</p>
                <button onClick={() => {this.setState({count: this.state.count + 1})}}>
                    Hello {this.props.name}
                </button>
            </>
        )
    }
}
Hello.propTypes = {
    name: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string
}

export default Hello;
