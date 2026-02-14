# API Documentation

Base URL: `http://localhost:3000`

## Authentication

Authentication is done via JWT Token in the `Authorization` header.
Format: `Authorization: Bearer <token>`

## Response Format

### Success Response

```json
{
    "metaData": {
        "status": true,
        "message": "Success message"
    },
    "response": {
        "data": { ... }
    }
}
```

### Error Response

```json
{
  "metaData": {
    "status": false,
    "message": "Error message"
  },
  "response": null
}
```

---

## Users

### Login

`POST /users/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil mendapatkan data user"
  },
  "response": {
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Register User

`POST /users`

**Request Body:**

```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123"
}
```

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil menambahkan data user"
  },
  "response": {
    "data": {
      "user_id": 2,
      "username": "newuser",
      "email": "newuser@example.com"
    }
  }
}
```

### Get All Users

`GET /users`
_Requires Auth_

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil mendapatkan data user"
  },
  "response": {
    "data": [
      {
        "user_id": 1,
        "username": "ryan",
        "email": "ryan@example.com"
      },
      {
        "user_id": 2,
        "username": "newuser",
        "email": "newuser@example.com"
      }
    ]
  }
}
```

### Get One User

`GET /users/:id`
_Requires Auth_

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil mendapatkan user"
  },
  "response": {
    "data": {
      "user_id": 1,
      "username": "ryan",
      "email": "ryan@example.com"
    }
  }
}
```

### Update User

`PUT /users/:id`
_Requires Auth_

**Request Body:**

```json
{
  "username": "updateduser", // Optional
  "email": "updated@example.com", // Optional
  "password": "newpassword" // Optional
}
```

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil memperbarui data user"
  },
  "response": {
    "data": {
      "user_id": 1,
      "username": "updateduser",
      "email": "updated@example.com"
    }
  }
}
```

### Delete User

`DELETE /users/:id`
_Requires Auth_

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil menghapus data user"
  },
  "response": {
    "data": {
      "rowCount": 1
    }
  }
}
```

---

## Accounts

### Get All Accounts

`GET /accounts`
_Requires Auth_

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil mendapatkan data user"
  },
  "response": {
    "data": {
      "total": 2500000,
      "accounts": [
        {
          "account_id": 1,
          "account_name": "BCA",
          "account_balance": 1000000
        },
        {
          "account_id": 2,
          "account_name": "Cash",
          "account_balance": 1500000
        }
      ]
    }
  }
}
```

### Get One Account

`GET /accounts/:id`
_Requires Auth_

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil mendapatkan account"
  },
  "response": {
    "data": {
      "account_id": 1,
      "account_name": "BCA",
      "account_balance": 1000000
    }
  }
}
```

### Create Account

`POST /accounts`
_Requires Auth_

**Request Body:**

```json
{
  "account_name": "BCA",
  "account_balance": 1000000
}
```

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil menambahkan data account"
  },
  "response": {
    "data": {
      "account_id": 3,
      "account_name": "BCA",
      "account_balance": 1000000,
      "user_id": 1
    }
  }
}
```

### Update Account

`PUT /accounts`
_Requires Auth_

**Request Body:**

```json
{
  "account_id": 1,
  "account_name": "BCA Updated",
  "account_balance": 1500000
}
```

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil memperbarui data account"
  },
  "response": {
    "data": {
      "account_id": 1,
      "account_name": "BCA Updated",
      "account_balance": 1500000
    }
  }
}
```

### Delete Account

`DELETE /accounts/:id`
_Requires Auth_

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil menghapus data account"
  },
  "response": {
    "data": {
      "rowCount": 1
    }
  }
}
```

---

## Categories

### Get All Categories

`GET /categories`
_Requires Auth_

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil mendapatkan data category"
  },
  "response": {
    "data": [
      {
        "category_id": 1,
        "category_name": "Food",
        "category_type": "expense"
      },
      {
        "category_id": 2,
        "category_name": "Salary",
        "category_type": "income"
      }
    ]
  }
}
```

### Get One Category

`GET /categories/:id`
_Requires Auth_

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil mendapatkan category"
  },
  "response": {
    "data": {
      "category_id": 1,
      "category_name": "Food",
      "category_type": "expense"
    }
  }
}
```

### Create Category

`POST /categories`
_Requires Auth_

**Request Body:**

```json
{
  "category_name": "Food",
  "category_type": "expense" // 'income' or 'expense'
}
```

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil menambahkan data category"
  },
  "response": {
    "data": {
      "category_id": 3,
      "category_name": "Food",
      "category_type": "expense",
      "user_id": 1
    }
  }
}
```

### Update Category

`PUT /categories`
_Requires Auth_

**Request Body:**

```json
{
  "category_id": 1,
  "category_name": "Food & Beverage",
  "category_type": "expense"
}
```

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil memperbarui data category"
  },
  "response": {
    "data": {
      "category_id": 1,
      "category_name": "Food & Beverage",
      "category_type": "expense"
    }
  }
}
```

### Delete Category

`DELETE /categories/:id`
_Requires Auth_

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil menghapus data category"
  },
  "response": {
    "data": {
      "rowCount": 1
    }
  }
}
```

---

## Transactions

### Get All Transactions

`GET /transactions`
_Requires Auth_

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil mendapatkan data transaksi"
  },
  "response": {
    "data": [
      {
        "transaction_id": 1,
        "transaction_amount": 50000,
        "transaction_type": "expense",
        "transaction_note": "Lunch",
        "transaction_date": "2023-10-27T00:00:00.000Z",
        "account": {
          "account_id": 1,
          "account_name": "Cash"
        },
        "category": {
          "category_id": 1,
          "category_name": "Food"
        }
      }
    ]
  }
}
```

### Get One Transaction

`GET /transactions/:id`
_Requires Auth_

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil mendapatkan transaksi"
  },
  "response": {
    "data": {
      "transaction_id": 1,
      "transaction_amount": 50000,
      "transaction_type": "expense",
      "transaction_note": "Lunch",
      "transaction_date": "2023-10-27T00:00:00.000Z",
      "category_id": 1,
      "account_id": 1,
      "user_id": 1
    }
  }
}
```

### Create Transaction

`POST /transactions`
_Requires Auth_

**Request Body:**

```json
{
  "transaction_note": "Lunch",
  "transaction_amount": 50000,
  "transaction_type": "expense", // 'income', 'expense', or 'transfer'
  "transaction_date": "2023-10-27",
  "category_id": 1,
  "account_id": 1,
  "destination_account_id": 2 // Required if transaction_type is 'transfer'
}
```

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil menambahkan data transaksi"
  },
  "response": {
    "data": {
      "transaction_id": 2,
      "message": "Transaction created successfully"
    }
  }
}
```

### Update Transaction

`PUT /transactions/:id`
_Requires Auth_

**Request Body:**
Same as Create Transaction.

**Response Example:**

```json
{
    "metaData": {
        "status": true,
        "message": "Berhasil memperbarui data transaksi"
    },
    "response": {
        "data": {
            "transaction_id": 1,
            "transaction_note": "Lunch Updated",
            ...
        }
    }
}
```

### Delete Transaction

`DELETE /transactions/:id`
_Requires Auth_

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil menghapus data transaksi"
  },
  "response": {
    "data": {
      "rowCount": 1
    }
  }
}
```

### Filter Transactions

`POST /transactions/filter`
_Requires Auth_

**Request Body:**

```json
{
  "user_id": 1,
  "account_id": 1, // Optional
  "category_id": 1, // Optional
  "transaction_note": "Lunch", // Optional
  "transaction_type": "expense", // Optional
  "transaction_date_from": "2023-10-01",
  "transaction_date_to": "2023-10-31" // Optional
}
```

**Response Example:**

```json
{
    "metaData": {
        "status": true,
        "message": "Berhasil mendapatkan data transaksi"
    },
    "response": {
        "data": {
            "count": {
                "expense": 50000,
                "income": 0,
                "total": -50000
            },
            "transactions": [
                {
                    "transaction_id": 1,
                    "transaction_amount": 50000,
                    ...
                }
            ]
        }
    }
}
```

### Get Category Summary

`GET /transactions/summary/category`
_Requires Auth_

**Query Parameters:**

- `start_date`: YYYY-MM-DD
- `end_date`: YYYY-MM-DD
- `type`: 'income' or 'expense' (default: 'expense')

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil mendapatkan ringkasan kategori"
  },
  "response": {
    "data": [
      {
        "category_id": 1,
        "category_name": "Food",
        "total_amount": 150000,
        "percentage": 30.5
      },
      {
        "category_id": 2,
        "category_name": "Transport",
        "total_amount": 50000,
        "percentage": 10.2
      }
    ]
  }
}
```

### Get Monthly Trend

`GET /transactions/summary/trend`
_Requires Auth_

**Query Parameters:**

- `year`: YYYY (default: current year)

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil mendapatkan tren bulanan"
  },
  "response": {
    "data": [
      {
        "month": 1,
        "income": 5000000,
        "expense": 3000000
      },
      {
        "month": 2,
        "income": 5000000,
        "expense": 2500000
      }
    ]
  }
}
```

---

## Transfers

### Get All Transfers

`GET /transfers`
_Requires Auth_

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil mendapatkan data transfer"
  },
  "response": {
    "data": [
      {
        "transfer_id": 1,
        "source_account_id": 1,
        "destination_account_id": 2,
        "amount": 500000,
        "transaction_date": "2023-10-27T00:00:00.000Z",
        "note": "Savings"
      }
    ]
  }
}
```

### Create Transfer

`POST /transfers`
_Requires Auth_

**Request Body:**

```json
{
  "source_account_id": 1,
  "destination_account_id": 2,
  "amount": 50000,
  "admin_fee": 0, // Optional, default 0
  "note": "Transfer to savings", // Optional
  "transaction_date": "2023-10-27",
  "category_id": 3 // Transfer category ID
}
```

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil melakukan transfer"
  },
  "response": {
    "data": {
      "transfer_id": 1,
      "amount": 50000,
      "message": "Transfer successful"
    }
  }
}
```

---

## App Settings

### Get App Settings

`GET /app_settings`

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil mendapatkan pengaturan aplikasi"
  },
  "response": {
    "data": {
      "app_name": "Aliran Dana",
      "maintenance_mode": false,
      "max_users": 100,
      "is_registration_open": true
    }
  }
}
```

### Update App Settings

`PUT /app_settings`
_Requires Auth_

**Request Body:**
Object containing settings to update, e.g.:

```json
{
  "app_name": "Aliran Dana",
  "maintenance_mode": false
}
```

**Response Example:**

```json
{
  "metaData": {
    "status": true,
    "message": "Berhasil memperbarui pengaturan"
  },
  "response": {
    "data": {
      "app_name": "Aliran Dana",
      "maintenance_mode": false
    }
  }
}
```
