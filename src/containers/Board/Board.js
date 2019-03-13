import React, {Component} from "react"
import {Link} from "react-router-dom"
import "./Board.scss"
import TasksList from "../../components/TasksList/TasksList"
import axios from "axios"
import uniqid from "uniqid"

//REDUX
import {connect} from "react-redux"

class Board extends Component {
	constructor(props) {
		super(props)

		this.state.board = {
			id: this.props.match.params.boardId,
			name: this.props.location.state.board.name,
			description: this.props.location.state.board.description,
			priority: this.props.location.state.board.priority
		}
	}

	state = {
		board: {
			id: "",
			name: "",
			description: "",
			priority: ""
		},
		tasks: {
			backlog: [],
			inprogress: [],
			done: []
		},
		inputs: {
			backlog: "",
			inprogress: "",
			done: ""
		}
	}

	moveTaskHandler = (taskId, direction) => {
		let newTasks = {...this.state.tasks}
		const arr = Object.entries(newTasks)
		let found = false

		for (let i = 0; i < arr.length && found === false; i++) {
			for (let task of arr[i][1]) {
				let idx = 0
				if (task.id === taskId) {
					if (direction === "left") {
						arr[i - 1][1].push({...task})
						arr[i][1].splice(idx, 1)
						found = true
					} else if (direction === "right") {
						arr[i + 1][1].push({...task})
						arr[i][1].splice(idx, 1)
						found = true
					}
				}
				idx++
			}
		}

		newTasks = arr.reduce((accum, [k, v]) => {
			accum[k] = v
			return accum
		}, {})
		this.setState({tasks: newTasks})
		this.updateDatabase()
	}

	taskEditHandler = (listName, taskId) => {
		let newTasks = {...this.state.tasks}
		const task = newTasks[listName].find(task => {
			return task.id === taskId
		})
		task.isEdit = true

		this.setState({tasks: newTasks})
	}

	taskEditApprove = (listName, taskId) => {
		let newTasks = {...this.state.tasks}
		const task = newTasks[listName].find(task => {
			return task.id === taskId
		})
		task.text = this.state.inputs[listName]
		task.isEdit = false

		this.setState({tasks: newTasks})
		this.updateDatabase()
	}

	listTextChangedHandler = (listName, event) => {
		const obj = {...this.state.inputs}
		const text = event.target.value
		obj[listName] = text
		this.setState({inputs: obj})
	}

	addTaskHandler = listName => {
		if (this.state.inputs[listName] === "") {
			return
		}
		const id = uniqid()
		const obj = {...this.state.tasks}
		const inputs = {...this.state.inputs}
		inputs[listName] = ""
		obj[listName].push({id: id, text: this.state.inputs[listName]})
		this.setState({tasks: obj, inputs: inputs})
		this.updateDatabase()
	}

	taskDeleteHandler = (listName, taskId) => {
		const obj = {...this.state.tasks}
		const idx = obj[listName].findIndex(task => {
			return task.id === taskId
		})
		obj[listName].splice(idx, 1)
		this.setState({tasks: obj})
		this.updateDatabase()
	}

	updateDatabase() {
		const obj = {...this.state.tasks}
		for (let key in obj) {
			if (obj[key].length === 0) {
				obj[key] = false
			}
		}
		const boardData = {
			lists: this.props.lists,
			tasks: obj,
			inputs: this.state.inputs
		}
		axios
			.put("https://boards-d8b3b.firebaseio.com/boardData/" + this.state.board.id + ".json?auth=" + this.props.authData.token, boardData)
			.then(res => {})
			.catch(error => {})
	}

	componentDidMount() {
		const boardId = this.state.board.id
		axios
			.get("https://boards-d8b3b.firebaseio.com/boardData/" + boardId + ".json?auth=" + this.props.authData.token)
			.then(response => {
				for (let key in response.data.tasks) {
					if (response.data.tasks[key] === false) {
						response.data.tasks[key] = []
					}
				}
				this.setState({
					tasks: response.data.tasks,
					inputs: response.data.inputs
				})
			})
			.catch(error => console.log(error))
	}

	render() {
		const listsNames = {
			abacklog: "Backlog",
			binprogress: "In Progress",
			cdone: "Done"
		}

		const tasksListsArr = Object.entries(this.state.tasks).map(list => {
			return (
				<TasksList
					key={list[0]}
					listrole={list[0]}
					listTitle={listsNames[list[0]]}
					tasks={list[1]}
					input={this.state.inputs[list[0]]}
					listTextChangedHandler={event => this.listTextChangedHandler(list[0], event)}
					addTaskHandler={() => this.addTaskHandler(list[0])}
					taskDeleteHandler={this.taskDeleteHandler}
					moveTaskHandler={this.moveTaskHandler}
					taskEditHandler={this.taskEditHandler}
					taskEditApprove={this.taskEditApprove}
				/>
			)
		})

		return (
			<div>
				<Link to='/boards'>
					<div className='BackBtn'> BACK </div>
				</Link>
				<br />
				<div className='board-info-cont'>
					<h3>{this.state.board.name}</h3>
					<h6>{this.state.board.description}</h6>
					<span>Priority: {this.state.board.priority}</span>
				</div>
				<div className='TasksListsCont'>{tasksListsArr}</div>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		lists: state.lists,
		authData: state.auth
	}
}

export default connect(mapStateToProps)(Board)
