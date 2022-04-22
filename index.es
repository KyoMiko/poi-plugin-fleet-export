import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'
export const windowMode = false;
export const render = {}
export const reactClass = connect(state => ({
    fleets: state.info.fleets,
    ships: state.info.ships,
    equips: state.info.equips
}))(class view extends Component {
    exportNoro6 = () => {
        console.log(window);
    }

    exportJervis = () => {
        console.log(this.props.fleet);
    }

    render() {
        return (
            <div>
                <Button onClick={this.exportNoro6}>
                    export noro6
                </Button>
                <Button onClick={this.exportJervis}>
                    export jervis
                </Button>
            </div>
        )
    }
})