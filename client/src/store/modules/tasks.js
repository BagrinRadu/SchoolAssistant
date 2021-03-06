const {
    TASKS_URL
} = require("../../utils/constants").URLS;

export default {
    state: {
        tasks: [],
    },

    getters: {
        tasks(state) {
            return state.tasks;
        }
    },

    mutations: {
        updateTasks: (state, tasks) => (state.tasks = tasks),
    },

    actions: {
        /**
         * Get tasks from DB
         * @param {*} param0 
         */
        getTasksFromDB({
            commit
        }) {

            return fetch(TASKS_URL, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('access-token')
                    },
                    mode: "cors"
                })
                .then(res => res.json())
                .then(res => {

                    if (res.success) {

                        commit("updateTasks", res.tasks);
                        return res.tasks;
                    }
                    return [];
                })
                .catch(err => {
                    console.log(err);
                    return [];
                });
        },

        /**
         * Add task to DB
         * @param {*} param0 
         * @param {*} task 
         */
        addTask({
            dispatch
        }, task) {

            return fetch("http://localhost:5000/tasks", {
                    method: "POST",
                    mode: "cors",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": 'Bearer ' + localStorage.getItem('access-token')
                    },
                    body: JSON.stringify(task)
                })
                .then(res => res.json())
                .then(res => {

                    dispatch("getTasksFromDB");
                    return res.success;
                })
                .catch(err => {

                    console.log(err);
                    return false;
                })
        },

        /**
         * Updates task by id in DB
         * @param {*} param0 
         * @param {*} payload 
         */
        updateTask({
            dispatch
        }, payload) {

            return fetch("http://localhost:5000/tasks/" + payload.taskId, {
                    method: "PUT",
                    mode: "cors",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": 'Bearer ' + localStorage.getItem('access-token')
                    },
                    body: JSON.stringify(payload.data)
                })
                .then(res => res.json())
                .then((res) => {
                    dispatch("getTasksFromDB");
                    return res.success;
                })
                .catch(err => {
                    console.log(err);
                    return false;
                });
        },

        /**
         * Delete task by id in DB
         * @param {*} param0 
         * @param {*} taskId 
         */
        deleteTask({
            dispatch
        }, taskId) {

            return fetch("http://localhost:5000/tasks/" + taskId, {
                    method: "DELETE",
                    mode: "cors",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": 'Bearer ' + localStorage.getItem('access-token')
                    }
                })
                .then((res) => {

                    dispatch("getTasksFromDB");
                    return res.status === 204;
                })
                .catch(err => {
                    console.log(err);
                    return false;
                });
        }
    }
};