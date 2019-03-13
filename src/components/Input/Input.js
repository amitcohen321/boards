import React from "react"
import classes from "./Input.module.css"
import "../../style/fonts.scss"

const Input = props => {
	let input

	switch (props.input.inputType) {
		case "email":
			input = (
				<input
					className='placeholder-font'
					type='email'
					placeholder={props.input.placeholder}
					value={props.input.value}
					onChange={props.onTextChange}
					className='input'
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
					className='placeholder-font'
					type='text'
					placeholder={props.input.placeholder}
					value={props.input.value}
					onChange={props.onTextChange}
					className='input'
				/>
			)
			break
		case "textarea":
			input = (
				<textarea
					className='placeholder-font'
					rows='5'
					cols='50'
					placeholder={props.input.placeholder}
					value={props.input.value}
					onChange={props.onTextChange}
					className='input'
				/>
			)
			break
		case "select":
			input = (
				<select defaultValue='selected' onChange={props.onTextChange}>
					<option name='selected'>Choose priority</option>
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
			</div>
		</>
	)
}

export default Input
