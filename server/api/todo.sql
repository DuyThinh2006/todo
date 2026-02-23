DROP TABLE IF EXISTS todo_items;

CREATE TABLE todo_items (
    id SERIAL PRIMARY KEY,
    item TEXT NOT NULL
);

INSERT INTO todo_items (item) VALUES
('Buy groceries'),
('Walk the dog'),
('Read a book');