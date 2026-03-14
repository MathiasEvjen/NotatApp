import { useEffect, useState } from "react";
import "./todos.css";
import { MdOutlineAddBox } from "react-icons/md";
import { IoMdCheckboxOutline } from "react-icons/io";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import type { Todo } from "../../types/todo";
import { createTodo, fetchTodos, updateTodo } from "../../api";


const Todos: React.FC = () => {

    const [newTodo, setNewTodo] = useState<string>("");

    const [todos, setTodos] = useState<Todo[]>([]);

    const handleTodoCompleted = async (todoToUpdate: Todo) => {
        todoToUpdate = {...todoToUpdate, isCompleted: !todoToUpdate.isCompleted};

        setTodos(prevTodos => 
            prevTodos.map(todo => 
                todo.todoId === todoToUpdate.todoId
                ? todoToUpdate
                : todo
            )
        );

        const updatedTodo = await updateTodo(todoToUpdate.todoId!, todoToUpdate);

        setTodos(prevTodos => 
            prevTodos.map(todo => 
                todo.todoId === updatedTodo.todoId
                ? updatedTodo
                : todo
            )
        )
    };

    const createAndSetTodo = async () => {
        const todo: Todo = {
            content: newTodo,
            isCompleted: false,
            tempId: crypto.randomUUID()
        };

        setNewTodo("");
        setTodos([...todos, todo]);

        const createdTodo = await createTodo(todo);

        setTodos([...todos, createdTodo]);
    };

    const fetchAndSetTodos = async () => {
        const fetchedTodos = await fetchTodos();

        setTodos(fetchedTodos);
    };

    useEffect(() => {
        fetchAndSetTodos();
    }, [])

    return(
        <div className="todos">
            <div className="todos-header">
                <p>Gjøremål</p>
                <div className="todos-create">
                    <input className="todos-input" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
                    <MdOutlineAddBox onClick={createAndSetTodo}/>
                </div>
            </div>
            <div className="todos-entries">
                {todos && todos.map(todo => (
                    <div 
                        key={todo.todoId ? todo.todoId : todo.tempId} 
                        className="todo-entry" 
                        onClick={() => handleTodoCompleted(todo)}
                    >
                        <div className="todo-entry-checkbox">
                            {todo.isCompleted 
                            ? (<IoMdCheckboxOutline />) 
                            : (<MdCheckBoxOutlineBlank />)}
                        </div>
                        <p>
                            {todo.isCompleted 
                            ? (<s>{todo.content}</s>)
                            : (<>{todo.content}</>)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default Todos;