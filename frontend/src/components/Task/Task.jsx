import moment from 'moment';
import "./task.css";
import { useContext } from 'react';
import TaskContext from '../../context/TaskContext';
import DeleteIcon from '@mui/icons-material/Delete';
import { convertLength } from '@mui/material/styles/cssUtils';


function Task({ task, id, t_id }) {
    const { dispatch } = useContext(TaskContext);
    // console.log("base",process.env.REACT_APP_BASE_URL);
    const base = process.env.REACT_APP_BASE_URL|| "http://localhost:8000";
    const token = JSON.parse(localStorage.getItem("authToken"));
    console.log("ids",t_id ,task.id,task)
    
    const handleRemove = async (e) => {
        e.preventDefault();
        const taskId = t_id || task._id;

        if (!taskId) {
            console.error("No task ID found to delete");
            return;
        }

        await fetch(`${base}/api/task/removeTask`, {
            method: 'POST',
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: taskId }),
        });
        console.log("Sending task ID to backend:", t_id);
        dispatch({
            type: "REMOVE_TASK",
            id,
        });
        };


    const handleMarkDone = async(e) => {
        
        await fetch(`${base}/api/task/completeTask/${t_id}`, {
            method: 'GET',
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
        });
        dispatch({
            type: "MARK_DONE",
            id
        })
    }
    return (
        <div className='bg-slate-300 py-4 rounded-lg shadow-md flex items-center justify-center gap-2 mb-3'>
            <div className="mark-done">
                <input type="checkbox" className="checkbox" onChange={handleMarkDone} checked={task.completed} />
            </div>
            <div className="task-info text-slate-900 text-sm w-10/12">
                <h4 className="task-title text-lg capitalize">{task.title}</h4>
                <p className="task-description">{task.description}</p>
                <div className=' italic opacity-60'>
                    {
                        task?.createdAt ? (
                            <p>{moment(task.createdAt).fromNow()}</p>
                        ) : (
                            <p>just now</p>
                        )
                    }
                </div>
            </div>
            <div className="remove-task text-sm text-white">
                
                <DeleteIcon
                    style={{ fontSize: 30, cursor: "pointer" }}
                    size="large"
                    onClick={handleRemove}
                    className="remove-task-btn bg-blue-700 rounded-full border-2 shadow-2xl border-white p-1" />
            </div>
        </div>
    );
}

export default Task;