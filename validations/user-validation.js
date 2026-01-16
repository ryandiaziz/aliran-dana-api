import Joi from 'joi';

// Skema untuk membuat pengguna baru
const createUserSchema = Joi.object({
    username: Joi.string().trim().min(3).max(30).required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(), // tlds: { allow: false } untuk mengizinkan email tanpa domain TLD valid (misal: "test@localhost")
    password: Joi.string().min(6).required(), // Anda bisa menambahkan aturan kompleksitas lebih lanjut di sini
});

// Skema untuk login pengguna
const loginUserSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
});

// Skema untuk memperbarui pengguna (semua opsional)
const updateUserSchema = Joi.object({
    username: Joi.string().trim().min(3).max(30).optional(),
    email: Joi.string().email({ tlds: { allow: false } }).optional(),
    password: Joi.string().min(6).optional(),
});

export {
    createUserSchema,
    loginUserSchema,
    updateUserSchema,
};