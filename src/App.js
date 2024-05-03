import logo from './logo.svg';
import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import './App.css';

function App() {
  const [ user, setUser ] = useState({});
  const [ todos, setTodos ] = useState([]);
  const [ newTodo, setNewTodo ] = useState({ title: '', description: '' });

  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwtDecode(response.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
  
    fetch('https://cc-backend-nodejs-heroku.onrender.com/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userObject),
    })
    .then(response => response.json())
    .then(data => console.log('User saved:', data))
    .catch((error) => console.error('Error:', error));
  }

  function handleSignOut(event) {
    setUser({});
    document.getElementById("signInDiv").hidden = false;
  }

  function createTodo() {
    fetch('https://cc-backend-nodejs-heroku.onrender.com/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...newTodo, email: user.email }),
    })
    .then(response => response.json())
    .then(data => {
      setTodos([...todos, data]);
      setNewTodo({ title: '', description: '' });
    })
    .catch((error) => console.error('Error:', error));
  }

  function deleteTodo(todoId) {
    fetch(`https://cc-backend-nodejs-heroku.onrender.com/todos/${todoId}`, {
      method: 'DELETE',
    })
    .then(() => {
      setTodos(todos.filter(todo => todo._id !== todoId));
    })
    .catch((error) => console.error('Error:', error));
  }

  useEffect(() => {
    /*global google */
    google.accounts.id.initialize({
      client_id: "862355106856-4ot0kcap3r33btdkk1ivojtjklgahv89.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });
    
    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large"}
    );

    // Fetch random image and set as background
    fetch('https://picsum.photos/1920/1080/?random')
      .then(response => {
        document.body.style.backgroundImage = `url(${response.url})`;
      });
 }, []);

 useEffect(() => {
    if (Object.keys(user).length !== 0) {
      fetch('https://cc-backend-nodejs-heroku.onrender.com/todos/' + user.email)
        .then(response => response.json())
        .then(data => setTodos(data));
    }
  }, [user]);

  return (
    <>
      <header className="header">
        <h1>Cloud Computing Evaluation</h1>
      </header>
      <div className="App">
        <div id="signInDiv"></div>
        { user &&
          <div className="user-info">
            <img src={user.picture}  className="user-image" />
            <h3 className="user-name">{user.name}</h3>
            <p className="user-email">{user.email}</p>
          </div>
        }
        { Object.keys(user).length !== 0 &&
          <>
            <input
              type="text"
              value={newTodo.title}
              onChange={e => setNewTodo({ ...newTodo, title: e.target.value })}
              placeholder="New todo title"
            />
            <input
              type="text"
              value={newTodo.description}
              onChange={e => setNewTodo({ ...newTodo, description: e.target.value })}
              placeholder="New todo description"
            />
            <button onClick={createTodo}>Create Todo</button>
            {todos.map((todo, index) => (
              <div key={index} className="todo">
                <h3>{todo.title}</h3>
                <p>{todo.description}</p>
                <button onClick={() => deleteTodo(todo._id)}>Delete Todo</button>
              </div>
            ))}
            <button onClick={handleSignOut} className="signout-button">Sign Out</button>
          </>
        }
        <footer className="footer">Thank you... Made with ❤️ by Adwait,Om and Amogh</footer>
      </div>
    </>
  );
}

export default App;