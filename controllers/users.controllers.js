import { pool } from "../db/db.js";
import { getSalt, hashPassword } from "../utils/hash.js";
import { createHash } from "crypto";
import dotenv from 'dotenv';
dotenv.config();

// GET /users — Muestra todos los usuarios con la contraseña hasheada
export const getUsers = (req, res) => {
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
            res.status(500).json({ msg: error, users: [] });
            return;
        }

        const hashedUsers = results.map(user => {
            const password = user.password || "";
            const hash = createHash("sha256").update(password).digest("hex");

            return {
                ...user,
                password: hash
            };
        });

        res.status(200).json({ msg: "OK", users: hashedUsers });
    });
};

// GET /users/:id — Obtiene un usuario por ID
export const getUser = (req, res) => {
    const id = req.params.id;
    pool.execute('SELECT * FROM users WHERE id = ?', [id], (error, results) => {
        if (error) {
            res.status(500).json({ msg: error, users: [] });
            return;
        }
        res.status(200).json({ msg: "OK", user: results });
    });
};

// POST /users — Crea un nuevo usuario y guarda contraseña con salt + hash
export const postUser = (req, res) => {
    const { name, username, password, age } = req.body;
    const salt = getSalt();
    const hash = hashPassword(password, salt);
    const hashedPassword = salt + hash;

    pool.query(
        "INSERT INTO users (name, username, password, age) VALUES (?, ?, ?, ?)",
        [name, username, hashedPassword, age],
        (error, results) => {
            if (error) {
                res.status(500).json({ msg: error });
                return;
            }
            res.status(201).json({ msg: "Usuario creado" });
        }
    );
};

// PUT /users/:id — Actualiza un usuario con nueva contraseña (salt + hash)
export const putUser = (req, res) => {
    const { name, username, password, age } = req.body;
    const salt = getSalt();
    const hash = hashPassword(password, salt);
    const hashedPassword = salt + hash;

    pool.execute(
        'UPDATE users SET name = ?, username = ?, password = ?, age = ? WHERE id = ?',
        [name, username, hashedPassword, age, req.params.id],
        (error, results) => {
            if (error) {
                res.status(500).json({ msg: error, users: [] });
                return;
            }
            res.status(200).json({ msg: "OK", user: results });
        }
    );
};

// DELETE /users/:id — Elimina un usuario
export const deleteUser = (req, res) => {
    pool.execute(
        'DELETE FROM users WHERE id = ?',
        [req.params.id],
        (error, results) => {
            if (error) {
                res.status(500).json({ msg: error, users: [] });
                return;
            }
            res.status(200).json({ msg: "OK", user: results });
        }
    );
};

// POST /login — Verifica login comparando el hash generado con el guardado
export const login = (req, res) => {
    const { username, password } = req.body;
    pool.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (error, results) => {
            if (error || results.length === 0) {
                res.status(401).json({ msg: "Credenciales incorrectas" });
                return;
            }

            const user = results[0];
            const stored = user.password;
            const saltSize = parseInt(process.env.SALT_SIZE) || 10;
            const salt = stored.substring(0, saltSize);
            const hash = stored.substring(saltSize);
            const hashAttempt = hashPassword(password, salt);

            if (hash === hashAttempt) {
                res.status(200).json({ msg: "Login exitoso" });
            } else {
                res.status(401).json({ msg: "Credenciales incorrectas" });
            }
        }
    );
};
