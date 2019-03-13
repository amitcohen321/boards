import React, {Component} from "react"
import {connect} from "react-redux"
import {Redirect} from "react-router-dom"
import * as actionCreators from "../../../store/actionCreators"

class Logout extends Component {
	componentDidMount() {
		this.props.Logout()
	}

	render() {
		return <Redirect to='/' />
	}
}

const mapDispatchToProps = dispatch => {
	return {
		Logout: () => {
			dispatch(actionCreators.logout())
		}
	}
}

export default connect(
	null,
	mapDispatchToProps
)(Logout)
