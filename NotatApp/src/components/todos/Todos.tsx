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
        {todoId: 3, content: "Dette er en todo", isCompleted: false},
        {todoId: 4, content: "Dette er en ferdig todo", isCompleted: true},
        {todoId: 5, content: "Dette er en todo", isCompleted: false},
        {todoId: 6, content: "Dette er en ferdig todo", isCompleted: true},
        {todoId: 7, content: "Dette er en todo", isCompleted: false},
        {todoId: 8, content: "Dette er en ferdig todo", isCompleted: true},
        {todoId: 9, content: "Dette er en todo", isCompleted: false},
        {todoId: 10, content: "Dette er en ferdig todo", isCompleted: true},
        {todoId: 11, content: "Dette er en todo", isCompleted: false},
        {todoId: 12, content: "Dette er en ferdig todo", isCompleted: true},
        {todoId: 13, content: "Dette er en todo", isCompleted: false},
        {todoId: 14, content: "Dette er en ferdig todo", isCompleted: true},
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
                    <div key={todo.todoId} className="todo-entry" onClick={() => handleTodoCompleted(todo)}>
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