import React, {Component} from "react"
import Input from "../../components/Input/Input"
import {connect} from "react-redux"
import * as actionCreators from "../../store/actionCreators"
import Spinner from "../../components/Spinner/Spinner"
import {Redirect} from "react-router-dom"
import "./Auth.scss"

class Auth extends Component {
	state = {
		LoginForm: [
			{
				id: "email",
				inputType: "email",
				placeholder: "Insert Email...",
				value: ""
			},
			{
				id: "password",
				inputType: "password",
				placeholder: "Insert Password...",
				value: ""
			}
		],
		isSignup: false
	}

	onTextChange = (event, id) => {
		const idx = this.state.LoginForm.findIndex(element => element.id === id)
		const arr = [...this.state.LoginForm]
		arr[idx].value = event.target.value
		this.setState({LoginForm: arr})
	}

	submitFormHandler = event => {
		event.preventDefault()
		const email = this.state.LoginForm[this.state.LoginForm.findIndex(inputItem => inputItem.id === "email")].value
		const password = this.state.LoginForm[this.state.LoginForm.findIndex(inputItem => inputItem.id === "password")]
			.value

		this.props.onLoginSubmit(email, password, this.state.isSignup)
	}

	changeAuthMethod = () => {
		this.setState({isSignup: !this.state.isSignup})
	}

	render() {
		let formElements = this.state.LoginForm.map((element, index) => {
			return <Input key={element.id} input={element} onTextChange={event => this.onTextChange(event, element.id)} />
		})

		let redirectTo = ""
		if (this.props.redirect.needsRedirect) {
			redirectTo = this.props.redirect.redirectTo
			// might be an issue here in the future with the state still set on redirectTo: /create and not changing going forward
		} else {
			redirectTo = "/"
		}

		return (
			<>
				{this.props.authData.token ? (
					<>
						<Redirect to={redirectTo} />
					</>
				) : null}
				{this.props.loading ? (
					<Spinner />
				) : (
					<>
						{!this.state.isSignup ? (
							<>
								<input
									type='button'
									value='Go to Signup >'
									className='change-tosignup-btn waves-effect waves-light btn'
									onClick={this.changeAuthMethod}
								/>
								<br />
								<h3>Sign In</h3>
							</>
						) : (
							<>
								<input
									type='button'
									value='Go to Signin >'
									className='change-tosignin-btn waves-effect waves-light btn'
									onClick={this.changeAuthMethod}
								/>
								<br />
								<h3>Sign Up</h3>
							</>
						)}
						<form onSubmit={this.submitFormHandler} className='login-form'>
							{formElements}
							<input type='submit' value='SUBMIT' />
						</form>
					</>
				)}

				{this.props.authData.token ? <h3>User Created</h3> : null}

				{/* {this.props.error ? } */}
			</>
		)
	}
}

const mapStateToProps = state => {
	return {
		loading: state.loading,
		authData: state.auth,
		redirect: state.redirect
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onLoginSubmit: (email, password, authType) => {
			dispatch(actionCreators.auth(email, password, authType))
		},
		initializeRedirect: () => {
			dispatch(actionCreators.initializeRedirect())
		}
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Auth)
