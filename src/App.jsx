import { useEffect, useState } from 'react'
import {Label, Form, FormGroup, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import './App.css'

function TodoItem({item, index, handleDeleteTodoItem, handleEditTodoItem}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editValue, setEditValue] = useState(item);

  const saveEdit = (index, newValue) => {
    if (newValue.trim() !== '') {
      handleEditTodoItem(index, newValue);
      setIsOpen(false);
    }
  }
  
  return (
    <>
      <li>
        <span className="todo-text">{item}</span>
        <Button color="danger" onClick={() => handleDeleteTodoItem(index)}>Delete</Button>
        <Button color="primary" onClick={() => setIsOpen(true)}>Edit</Button>
      </li>
      <Modal isOpen={isOpen}>
        <ModalHeader toggle={() => setIsOpen(false)}>Edit To-Do Item</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="editTodo">To-Do Item</Label>
            <Input type="text" name="editTodo" id="editTodo" value={editValue} onKeyDown={(e) => { if (e.key === 'Enter') {
              saveEdit(index, editValue);
            }}} onChange={(e) => setEditValue(e.target.value)} />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => {
            saveEdit(index, editValue);
          }}>Save</Button>{' '}
          <Button color="secondary" onClick={() => {setIsOpen(false)}}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
function App() {
  const [todoItems, setTodoItems] = useState([]);

  useEffect(() => {
    loadTodoItems();
  }, []);

  function loadTodoItems() {
    fetch('https://duythinh-todo-backend.up.railway.app/todos')
      .then(response => response.json())
      .then(data => {
        const onlyItems = data.map(obj => obj.item);
        setTodoItems(onlyItems);
      })
      .catch(error => console.error('Error fetching to-do items:', error));
  }

  function handleAddTodoItem(event) {
    if (event.key === 'Enter' && event.target.value.trim() !== '') {
      event.preventDefault();
      const newItem = event.target.value;
      fetch(`https://duythinh-todo-backend.up.railway.app/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item: newItem }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Success:', data);
          loadTodoItems();
        })
        .catch((error) => {
          console.error('Error:', error);
        }
      );
      event.target.value = '';
    }
  }

  function handleDeleteTodoItem(index) {
    fetch(`https://duythinh-todo-backend.up.railway.app/todos/${index+1}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Deleted:', data);
        loadTodoItems();
      })
      .catch((error) => {
        console.error('Error deleting to-do item:', error);
      });
  }

  function handleEditTodoItem(index, newValue) {
    fetch(`https://duythinh-todo-backend.up.railway.app/todos/${index+1}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ item: newValue }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');   
   }
      return response.json();
    }).then((data) => {
      console.log('Success:', data);
      loadTodoItems();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  return (
    <>
      <Form className="App" onSubmit={(e) => e.preventDefault()}>
        <h1>To-do List</h1>
        <FormGroup>
          <Input type="text" name="todo" id="todo" placeholder="Enter a to-do item" onKeyDown={handleAddTodoItem} />
        </FormGroup>
      </Form>
      {todoItems.length > 0 && (
        <div className="todo-list">
          <h2>Your To-Do Items:</h2>
          <ul>
            {todoItems.map((item, index) => (
              <TodoItem key={index} item={item} index={index} 
              handleDeleteTodoItem={handleDeleteTodoItem} 
              handleEditTodoItem={handleEditTodoItem}/>
            ))}
          </ul>
        </div>
      )}
    </>
  );  
}
export default App;
