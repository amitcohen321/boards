import React, {Component} from "react"
import Input from "../../components/Input/Input"
import classes from "./Create.module.css"
import Spinner from "../../components/Spinner/Spinner"
import uniqid from "uniqid"
import "../../style/fonts.scss"

//REDUX
import {connect} from "react-redux"
import * as actionCreators from "../../store/actionCreators"

class Create extends Component {
	state = {
		CreateBoardForm: [
			{
				id: "name",
				inputType: "text",
				placeholder: "Insert board name...",
				value: "",
				validation: {
					required: true,
					isValid: false,
					touched: false
				}
			},
			{
				id: "description",
				inputType: "textarea",
				placeholder: "Insert description...",
				value: "",
				validation: {
					required: true,
					maxLength: 144,
					isValid: false,
					touched: false
				}
			},
			{
				id: "priority",
				inputType: "select",
				placeholder: "",
				value: "",
				defaultVal: "",
				options: [
					{value: "high", displayValue: "High"},
					{value: "medium", displayValue: "Medium"},
					{value: "low", displayValue: "Low"}
				],
				validation: {
					required: true,
					isDefaultValue: true,
					isValid: false,
					touched: false
				}
			}
		],
		isFormValid: false
	}

	checkValidity(value, rules) {
		let isValid = true

		if (rules.required) {
			isValid = value.trim() !== "" && isValid
		}
		if (rules.maxLength) {
			isValid = value.length <= rules.maxLength && isValid
		}
		if (rules.isDefaultValue) {
			isValid = value != "Choose priority" && isValid
		}

		return isValid
	}

	onTextChange = (event, id) => {
		const idx = this.state.CreateBoardForm.findIndex(element => element.id === id)
		const arr = [...this.state.CreateBoardForm]
		arr[idx].value = event.target.value
		arr[idx].validation.isValid = this.checkValidity(arr[idx].value, arr[idx].validation)
		arr[idx].validation.touched = true

		let isFormValid = false // TODO: fix logic to scaling logic
		// for (let input in this.CreateBoardForm) {
		// }
		if (
			this.state.CreateBoardForm[0].validation.isValid &&
			this.state.CreateBoardForm[1].validation.isValid &&
			this.state.CreateBoardForm[2].validation.isValid
		) {
			isFormValid = true
		} else {
			isFormValid = false
		}
		console.log(isFormValid)
		this.setState({CreateBoardForm: arr, isFormValid: isFormValid})
	}

	submitFormHandler = event => {
		event.preventDefault()

		if (!this.props.authData.token) {
			// not signed in
			this.props.needsRedirect("/create")
			this.props.history.push("/auth")
		} else {
			// signed in
			const board = {}
			for (let index in this.state.CreateBoardForm) {
				board[this.state.CreateBoardForm[index].id] = this.state.CreateBoardForm[index].value
			}
			board["id"] = uniqid()
			board["userId"] = this.props.authData.localId

			const boardData = {
				lists: {
					backlog: "Backlog",
					inprogress: "In Progress",
					done: "Done"
				},
				tasks: {
					abacklog: false,
					binprogress: false,
					cdone: false
				},
				inputs: {
					backlog: "",
					inprogress: "",
					done: ""
				}
			}

			this.props.onBoardSubmit(board, boardData, this.props.authData.token)
		}
	}

	render() {
		let formElements = this.state.CreateBoardForm.map((element, index) => {
			let descriptionLabelMessage = ""
			if (element.id === "description") {
				descriptionLabelMessage = "up to 144 characters long"
			}
			return (
				<div key={element.id}>
					<Input input={element} onTextChange={event => this.onTextChange(event, element.id)} />
					<p className={classes.DescriptionLabelMessage}>{descriptionLabelMessage}</p>
					<br />
					<br />
					<br />
				</div>
			)
		})

		if (this.props.loading) {
			return <Spinner />
		} else {
			return (
				<>
					<h1 className='headline'>Create New Board</h1>
					<form onSubmit={this.submitFormHandler} className={classes.Form}>
						{formElements}
						{this.props.authData.token ? (
							<input type='submit' value='Create' disabled={!this.state.isFormValid} />
						) : (
							<>
								<input type='submit' value='Sign Up' />
								<span>Creating a Board requires signup</span>
							</>
						)}
					</form>
				</>
			)
		}
	}
}

const mapStateToProps = state => {
	return {
		loading: state.loading,
		boardCreated: state.boardCreated,
		error: state.error,
		authData: state.auth,
		redirect: state.redirect
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onBoardSubmit: (board, boardData, token) => {
			dispatch(actionCreators.sendBoard(board, boardData, token))
		},
		needsRedirect: path => {
			dispatch(actionCreators.needsRedirect(path))
		}
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Create)
