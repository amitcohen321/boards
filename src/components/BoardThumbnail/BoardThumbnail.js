import React from "react"
import {Link} from "react-router-dom"

const BoardThumbnail = props => {
	const priorityColor = {
		low: "green",
		medium: "blue",
		high: "red"
	}

	return (
		<div className='Board'>
			<Link
				to={{
					pathname: `/boards/${props.board.id}`,
					state: {board: props.board}
				}}>
				<div className='info-wrapper'>
					<div className='priority-cont'>
						<span className={priorityColor[props.board.priority]}>
							{props.board.priority.charAt(0).toUpperCase() + props.board.priority.slice(1)}
						</span>
					</div>
					<h5>{props.board.name}</h5>
					<p>{props.board.description}</p>
				</div>
			</Link>
			<span
				className='icon-DeleteBoard'
				onClick={event => props.boardDeleteHandler(event, props.board.id)}>
				X
			</span>
		</div>
	)
}

export default BoardThumbnail
