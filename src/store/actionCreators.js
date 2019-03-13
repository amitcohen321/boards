import * as actionTypes from "./actionTypes"
import axios from "axios"

// SEND BOARD ACTION CREATORS
export const sendBoardStart = () => {
	return {
		type: actionTypes.SEND_BOARD_START
	}
}

export const sendBoardSuccess = (id, boardData) => {
	return {
		type: actionTypes.SEND_BOARD_SUCCESS,
		boardId: id,
		boardData: boardData
	}
}

export const sendBoardFail = error => {
	return {
		type: actionTypes.SEND_BOARD_FAIL,
		error: error
	}
}

export const sendBoard = (board, boardData, token) => {
	return dispatch => {
		dispatch(sendBoardStart())
		axios
			.put("https://boards-d8b3b.firebaseio.com/boards/" + board["id"] + ".json?auth=" + token, board)
			.then(res => {
				axios
					.put("https://boards-d8b3b.firebaseio.com/boardData/" + board["id"] + ".json?auth=" + token, boardData)
					.then(res => {
						dispatch(sendBoardSuccess(board.id, boardData))
					})
					.catch(error => {
						console.log(error)
						dispatch(sendBoardFail(error))
					})
			})
			.catch(error => {
				console.log(error)
				dispatch(sendBoardFail(error))
			})
	}
}

// FETCH BOARDS ACTION CREATORS
export const fetchBoardsStart = () => {
	return {
		type: actionTypes.FETCH_BOARDS_START
	}
}

export const fetchBoardsSuccess = fetchedBoards => {
	return {
		type: actionTypes.FETCH_BOARDS_SUCCESS,
		fetchedBoards: fetchedBoards
	}
}

export const fetchBoardsFail = error => {
	return {
		type: actionTypes.FETCH_BOARDS_FAIL,
		error: error
	}
}

export const fetchBoards = (token, userId) => {
	return dispatch => {
		dispatch(fetchBoardsStart())
		const queryParams = "auth=" + token + '&orderBy="userId"' + "&equalTo=" + '"' + userId + '"'
		axios
			.get("https://boards-d8b3b.firebaseio.com/boards.json?" + queryParams)
			.then(response => {
				const fetchedBoards = []
				for (var key in response.data) {
					fetchedBoards.push(response.data[key])
				}
				dispatch(fetchBoardsSuccess(fetchedBoards))
			})
			.catch(error => {
				console.log(error)
				dispatch(fetchBoardsFail(error))
			})
	}
}

// DELETE BOARD ACTION CREATORS
export const deleteBoardSuccess = id => {
	return {
		type: actionTypes.DELETE_BOARD_SUCCESS,
		deletedBoardId: id
	}
}

export const deleteBoardFail = error => {
	return {
		type: actionTypes.DELETE_BOARD_FAIL,
		error: error
	}
}

export const deleteBoard = (id, token) => {
	return dispatch => {
		// dispatch(fetchBoardsStart())
		axios
			.delete("https://boards-d8b3b.firebaseio.com/boards/" + id + ".json?auth=" + token)
			.then(res => {
				console.log("board" + id + " deleted from firebase boards table")
				axios
					.delete("https://boards-d8b3b.firebaseio.com/boardData/" + id + ".json?auth=" + token)
					.then(res => {
						console.log("board" + id + " deleted from firebase boardData table")
						dispatch(deleteBoardSuccess(id))
					})
					.catch(error => {
						console.log(error)
						dispatch(deleteBoardFail(error))
					})
			})
			.catch(error => {
				console.log(error)
				dispatch(deleteBoardFail(error))
			})
	}
}

// AUTH ACTION CREATORS
export const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	}
}

export const authSuccess = authData => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		authData: authData
	}
}

export const authFail = error => {
	return {
		type: actionTypes.AUTH_FAIL,
		error: error
	}
}

export const auth = (email, password, authType) => {
	return dispatch => {
		dispatch(authStart())
		const credentials = {
			email: email,
			password: password,
			returnSecureToken: true
		}

		let endpoint = ""
		authType === true
			? (endpoint =
					"https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyAqKr3Kx0RoZWfYNOCs8CG8Rs5H92cBRdE")
			: (endpoint =
					"https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyAqKr3Kx0RoZWfYNOCs8CG8Rs5H92cBRdE")

		axios
			.post(endpoint, credentials)
			.then(res => {
				console.log(res)
				// set token in localstorage
				localStorage.setItem("token", res.data.idToken)
				localStorage.setItem("expirationDate", new Date(new Date().getTime() + res.data.expiresIn * 1000))
				localStorage.setItem("userId", res.data.localId)

				// set token in store
				dispatch(authSuccess(res.data))
			})
			.catch(error => {
				dispatch(authFail(error))
			})
	}
}

export const checkAuthStatus = () => {
	return dispatch => {
		const token = localStorage.getItem("token")
		if (!token) {
			dispatch(logout())
		} else {
			const expirationDate = new Date(localStorage.getItem("expirationDate"))
			const curDate = new Date()
			if (expirationDate <= curDate) {
				dispatch(logout())
			} else {
				const authData = {
					idToken: token,
					localId: localStorage.getItem("userId"),
					expirationDate: localStorage.getItem("expirationDate")
				}
				dispatch(authSuccess(authData))
			}
		}

		return {
			type: actionTypes.CHECK_AUTH_STATUS
		}
	}
}

export const logout = () => {
	localStorage.removeItem("token")
	localStorage.removeItem("expirationDate")
	localStorage.removeItem("userId")

	return {
		type: actionTypes.AUTH_LOGOUT
	}
}

export const needsRedirect = path => {
	return {
		type: actionTypes.NEEDS_REDIRECT,
		path: path
	}
}

export const initializeRedirect = () => {
	return {
		type: actionTypes.INITIALIZE_REDIRECT
	}
}
