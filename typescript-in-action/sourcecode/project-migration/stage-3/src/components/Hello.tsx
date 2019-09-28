import React, { Component } from 'react';

interface Props {
    name: string;
    firstName?: string;
    lastName?: string;
}
interface State {
    count: number
}

class Hello extends Component<Props, State> {
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

export default Hello;
