import { useState } from "react";
import "./todos.css";
import { MdOutlineAddBox } from "react-icons/md";
import { IoMdCheckboxOutline } from "react-icons/io";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import type { Todo } from "../../types/todo";


const Todos: React.FC = () => {

    const [todos, setTodos] = useState<Todo[]>([
        {todoId: 1, content: "Dette er en todo", isCompleted: false},
        {todoId: 2, content: "Dette er en ferdig todo", isCompleted: true},
        {todoId: 1, content: "Dette er en todo", isCompleted: false},
        {todoId: 2, content: "Dette er en ferdig todo", isCompleted: true},
        {todoId: 1, content: "Dette er en todo", isCompleted: false},
        {todoId: 2, content: "Dette er en ferdig todo", isCompleted: true},
        {todoId: 1, content: "Dette er en todo", isCompleted: false},
        {todoId: 2, content: "Dette er en ferdig todo", isCompleted: true},
        {todoId: 1, content: "Dette er en todo", isCompleted: false},
        {todoId: 2, content: "Dette er en ferdig todo", isCompleted: true},
        {todoId: 1, content: "Dette er en todo", isCompleted: false},
        {todoId: 2, content: "Dette er en ferdig todo", isCompleted: true},
        {todoId: 1, content: "Dette er en todo", isCompleted: false},
        {todoId: 2, content: "Dette er en ferdig todo", isCompleted: true},
    ]);

    const handleTodoCompleted = (todoToUpdate: Todo) => {
        setTodos(prevTodos => 
            prevTodos.map(todo => 
                todo.todoId === todoToUpdate.todoId
                ? {...todo, isCompleted: !todo.isCompleted}
                : todo
            )
        );
    };

    return(
        <div className="todos">
            <div className="todos-header">
                <p>Gjøremål</p>
                <div className="todos-create">
                    <input className="todos-input" />
                    <MdOutlineAddBox />
                </div>
            </div>
            <div className="todos-entries">
                {todos && todos.map(todo => (
                    <div className="todo-entry">
                        <div className="todo-entry-checkbox" onClick={() => handleTodoCompleted(todo)}>
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