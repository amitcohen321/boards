import React from "react"
import "./TasksList.scss"

const TasksList = props => {
	let tasks = props.tasks.map(task => {
		const buttonLeft =
			!task.isEdit && (props.listrole === "binprogress" || props.listrole === "cdone") ? (
				<i className='material-icons' onClick={() => props.moveTaskHandler(task.id, "left")}>
					keyboard_arrow_left
				</i>
			) : null

		const buttonRight =
			!task.isEdit && (props.listrole === "binprogress" || props.listrole === "abacklog") ? (
				<i className='material-icons' onClick={() => props.moveTaskHandler(task.id, "right")}>
					keyboard_arrow_right
				</i>
			) : null

		const taskUtils = task.isEdit ? null : (
			<div>
				<i onClick={() => props.taskDeleteHandler(props.listrole, task.id)} className='material-icons'>
					delete
				</i>
				<i onClick={() => props.taskEditHandler(props.listrole, task.id)} className='material-icons'>
					edit
				</i>
			</div>
		)

		const taskContent = task.isEdit ? (
			<div>
				<input type='text' onChange={props.listTextChangedHandler} />
				<button onClick={() => props.taskEditApprove(props.listrole, task.id)}>OK</button>
			</div>
		) : (
			<div>
				<div>{task.text}</div>
			</div>
		)

		return (
			<div key={task.id} className='Task'>
				{buttonLeft}
				{taskContent}
				{buttonRight}
				{taskUtils}
			</div>
		)
	})

	let listIcon = ""
	switch (props.listrole) {
		case "abacklog" || "backlog": {
			listIcon = "event_note"
			break
		}
		case "binprogress" || "inprogress": {
			listIcon = "directions_run"
			break
		}
		case "cdone" || "done": {
			listIcon = "check_box"
			break
		}
		default:
			console.log(props.listrole)
			listIcon = ""
	}

	return (
		<div className='List tasks-list'>
			<h6 className='ListTitle'>
				<b> {props.listTitle}</b>{" "}
			</h6>{" "}
			<i className='material-icons list-icon'>{listIcon}</i>
			<input className='task-input' type='text' onChange={props.listTextChangedHandler} placeholder='Add task...' />
			{/* value={props.input} should be appended in 1 line up to cleat add task input after adding task */}
			<button className='btn-floating btn-small waves-effect waves-light green' disabled={!props.input}>
				<i className='material-icons add-task-circle' onClick={props.addTaskHandler}>
					add_circle
				</i>
			</button>
			<div className='TasksList'>{tasks}</div>
		</div>
	)
}

export default TasksList
