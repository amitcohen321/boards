import React, {Component} from "react"
import NavBar from "../../components/NavBar/NavBar"
import {Route, Switch, Redirect} from "react-router-dom"
import Boards from "../../containers/Boards/Boards"
import Create from "../../containers/Create/Create"
import HelloMessage from "../../components/HelloMessage/HelloMessage"
import PageNotFound from "../../components/PageNotFound/PageNotFound"
import Board from "../../containers/Board/Board"
import Auth from "../../containers/Auth/Auth"
import Logout from "../../containers/Auth/Logout/Logout"

import {connect} from "react-redux"
import * as actionCreators from "../../store/actionCreators"

class Main extends Component {
	componentDidMount() {
		this.props.checkAuthStatus()
	}

	render() {
		let routes
		if (this.props.authData.token) {
			routes = (
				<Switch>
					<Route path='/' exact component={HelloMessage} />
					<Route path='/create' exact component={Create} />
					<Route path='/boards' exact component={Boards} />
					<Route path='/logout' exact component={Logout} />
					<Route path='/boards/:boardId' component={Board} />
					<Route path='/auth' exact component={Auth} />
					<Route component={PageNotFound} />
				</Switch>
			)
		} else {
			routes = (
				<Switch>
					<Route path='/' exact component={HelloMessage} />
					<Route path='/auth' exact component={Auth} />
					<Route path='/create' exact component={Create} />
					<Redirect to='/auth' />
				</Switch>
			)
		}

		return (
			<>
				<NavBar authData={this.props.authData} />
				{routes}
			</>
		)
	}
}

const mapStateToProps = state => {
	return {
		authData: state.auth
	}
}

const mapDispatchToProps = dispatch => {
	return {checkAuthStatus: () => dispatch(actionCreators.checkAuthStatus())}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	null,
	{
		pure: false
	}
)(Main)
