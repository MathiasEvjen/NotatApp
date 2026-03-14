import type { Todo } from "../../types/todo";
import { IoMdCheckboxOutline } from "react-icons/io";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { LuTrash2 } from "react-icons/lu";

interface TodoItemProps {
    todo: Todo;
    handleTodoCompleted: (todo: Todo) => void;
    handleDeleteTodo: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, handleTodoCompleted, handleDeleteTodo }) => {
    return(
        <div  
            className="todo-entry" 
        >
            <div className="todo-content" onClick={() => handleTodoCompleted(todo)}>
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
            <LuTrash2 className="todo-delete" onClick={() => handleDeleteTodo(todo)} />
        </div>
    );
};

export default TodoItem;