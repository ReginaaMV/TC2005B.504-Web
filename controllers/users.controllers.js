import { pool } from "../db/db.js";

// Obtener todos los usuarios
export const getUsers = (req, res) => {
    pool.query("SELECT * FROM users", (error, results) => {
        if (error) {
            res.status(500).json({ msg: error.message, users: [] });
            return;
        }
        res.status(200).json({ msg: "ok", users: results });
    });
};

// Obtener un usuario por ID
export const getUser = (req, res) => {
    const id = req.params.id;
    pool.execute("SELECT * FROM users WHERE id = ?", [id], (error, results) => {
        if (error) {
            res.status(500).json({ msg: error.message, users: [] });
            return;
        }
        res.status(200).json({ msg: "ok", users: results });
    });
};

// Crear un nuevo usuario
export const postUser = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ msg: "Username and password are required" });
        return;
    }
    pool.execute(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, password],
        (error, results) => {
            if (error) {
                res.status(500).json({ msg: error.message });
                return;
            }
            res.status(201).json({ msg: "User created", userId: results.insertId });
        }
    );
};

// Actualizar un usuario
export const putUser = (req, res) => {
    const { name, username, password } = req.body;
    const id = req.params.id;
    if (!id || !name || !username || !password) {
        res.status(400).json({ msg: "All fields are required" });
        return;
    }
    pool.execute(
        "UPDATE users SET name = ?, username = ?, password = ? WHERE id = ?",
        [name, username, password, id],
        (error, results) => {
            if (error) {
                res.status(500).json({ msg: error.message });
                return;
            }
            res.status(200).json({ msg: "User updated", affectedRows: results.affectedRows });
        }
    );
};

// Eliminar un usuario
export const deleteUser = (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({ msg: "User ID is required" });
        return;
    }
    pool.execute(
        "DELETE FROM users WHERE id = ?",
        [id],
        (error, results) => {
            if (error) {
                res.status(500).json({ msg: error.message });
                return;
            }
            res.status(200).json({ msg: "User deleted", affectedRows: results.affectedRows });
        }
    );
};

// Login de usuario
export const login = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ msg: "Username and password are required" });
        return;
    }
    pool.execute(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password],
        (error, results) => {
            if (error) {
                res.status(500).json({ msg: error.message });
                return;
            }
            if (results.length === 0) {
                res.status(401).json({ msg: "Invalid credentials" });
                return;
            }
            res.status(200).json({ msg: "Login successful", user: results[0] });
        }
    );
};