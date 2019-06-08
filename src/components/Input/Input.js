import React from "react"
import classes from "./Input.module.css"
import "../../style/fonts.scss"

const Input = props => {
	let input

	const createBoardFormInputClasses = [classes.Input, "placeholder-font"]
	let validationError = null
	if (props.input.validation) {
		if (!props.input.validation.isValid && props.input.validation.touched) {
			createBoardFormInputClasses.push(classes.InvalidInput)
			validationError = (
				<p className={classes.InputValidationErrorText}>
					Please enter a valid {props.input.id}
				</p>
			)
		}
	}

	switch (props.input.inputType) {
		case "email":
			input = (
				<input
					type='email'
					placeholder={props.input.placeholder}
					value={props.input.value}
					onChange={props.onTextChange}
					className='input placeholder-font'
				/>
			)
			break
		case "password":
			input = (
				<input
					type='password'
					placeholder={props.input.placeholder}
					value={props.input.value}
					onChange={props.onTextChange}
					className='input'
				/>
			)
			break
		case "text":
			input = (
				<input
					type='text'
					placeholder={props.input.placeholder}
					value={props.input.value}
					onChange={props.onTextChange}
					className={createBoardFormInputClasses.join(" ")}
				/>
			)
			break
		case "textarea":
			input = (
				<textarea
					rows='5'
					cols='50'
					placeholder={props.input.placeholder}
					value={props.input.value}
					onChange={props.onTextChange}
					className={createBoardFormInputClasses.join(" ")}
				/>
			)
			break
		case "select":
			input = (
				<select
					className={createBoardFormInputClasses.join(" ")}
					defaultValue='selected'
					onChange={props.onTextChange}>
					<option name='selected'>Choose priority...</option>
					{props.input.options.map(option => {
						return (
							<option key={option.value} value={option.value}>
								{option.displayValue}
							</option>
						)
					})}
				</select>
			)
			break
		default:
			input = <input type='text' placeholder={props.placeholder} value={props.key.value} />
	}

	return (
		<>
			<div className={classes.InputCont}>
				<label>{props.input.id.charAt(0).toUpperCase() + props.input.id.slice(1)}</label>
				{input}
				{validationError}
			</div>
		</>
	)
}

export default Input
