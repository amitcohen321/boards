import React from "react"
import {NavLink} from "react-router-dom"
import classes from "./NavBar.module.css"
import logo from "../../assets/boards_logo.png"
import "../../style/fonts.scss"

const NavBar = props => {
	return (
		<div className={classes.NavBar}>
			<NavLink to='/'>
				<div className={classes.Logo}>
					<img src={logo} alt='boards-logo' />
				</div>
			</NavLink>
			<ul className='navitems-font'>
				{props.authData.token ? (
					<li>
						<NavLink to='/boards'>My Boards</NavLink>
					</li>
				) : null}

				<li>
					<NavLink to='/create'>Create</NavLink>
				</li>
				{props.authData.token ? (
					<li>
						<NavLink to='/logout'>Logout</NavLink>
					</li>
				) : (
					<li>
						<NavLink to='/auth'>Signup/Login</NavLink>
					</li>
				)}
			</ul>
		</div>
	)
}

export default NavBar
