import { useEffect, useState } from "react";
import "./todos.css";
import { MdOutlineAddBox } from "react-icons/md";
import { LuTrash2 } from "react-icons/lu";
import type { Todo } from "../../types/todo";
import { createTodo, deleteTodo, fetchTodos, updateTodo } from "../../api";
import TodoItem from "./TodoItem";


const Todos: React.FC = () => {

    const [newTodo, setNewTodo] = useState<string>("");

    const [todos, setTodos] = useState<Todo[]>([]);
    const [showFinishedTodos, setShowFinishedTodos] = useState<boolean>(false);

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

    const handleKeyDown = (event: any) => {
        if (event.key === "Enter") {
            createAndSetTodo();
        }
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

    const handleDeleteTodo = async (todoToDelete: Todo) => {
        setTodos(todos.filter(todo => todo.todoId !== todoToDelete.todoId));

        await deleteTodo(todoToDelete.todoId!);
    };

    const handleEmptyCompletedTodos = async () => {
        const completedTodos: Todo[] = todos.filter(todo => todo.isCompleted);
        setTodos(todos.filter(todo => !todo.isCompleted));

        completedTodos.forEach(async (todo) => {
            await deleteTodo(todo.todoId!);
        });
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
                <div className="todos-header-left">
                    <p>Gjøremål</p>
                    <div className="todos-header-switch">
                        <div 
                            className={`todos-header-switch-entry ${!showFinishedTodos ? "active" : ""}`}
                            onClick={() => setShowFinishedTodos(false)}
                        >
                            <p>Pågående</p>
                        </div>
                        <div 
                            className={`todos-header-switch-entry ${showFinishedTodos ? "active" : ""}`}
                            onClick={() => setShowFinishedTodos(true)}
                        >
                            <p>Fullførte</p>
                        </div>
                    </div>
                </div>
                <div className="todos-header-right">
                    {showFinishedTodos ? (
                        <div className="todo-empty-todos" onClick={handleEmptyCompletedTodos}>
                            <LuTrash2 />
                            <p>Tøm</p>
                        </div>
                    ) : ""}
                    <div className="todos-create">
                        <input 
                            className="todos-input" 
                            value={newTodo} 
                            onChange={(e) => setNewTodo(e.target.value)} 
                            onKeyDown={(e) => handleKeyDown(e)}
                            // maxLength={48}
                            placeholder="Opprett nytt gjøremål..."/>
                        <MdOutlineAddBox onClick={() => createAndSetTodo}/>
                    </div>
                </div>
            </div>
            <div className="todos-entries">
                {showFinishedTodos ? (
                    <>
                    {todos && todos
                    .filter(todo => todo.isCompleted)
                    .map(todo => (
                        <TodoItem 
                            key={todo.todoId ? todo.todoId : todo.tempId}
                            todo={todo} 
                            handleTodoCompleted={handleTodoCompleted} 
                            handleDeleteTodo={handleDeleteTodo} />
                    ))}
                    </>
                ) : (
                    <>
                    {todos && todos
                    .filter(todo => !todo.isCompleted)
                    .map(todo => (
                        <TodoItem 
                            key={todo.todoId ? todo.todoId : todo.tempId}
                            todo={todo} 
                            handleTodoCompleted={handleTodoCompleted} 
                            handleDeleteTodo={handleDeleteTodo} />
                    ))}
                    </>
                )}
                
            </div>
        </div>
    )
};

export default Todos;