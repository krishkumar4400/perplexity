# Perplexity

## Features

- Authentication
- chat with AI
- chat history
- message storage
- AI with internet research

## Database Design

### 1. User

- id
- username
- email
- password
- isVerified
- createdAt
- updatedAt

### 2. Chat

- id
- user
- title
- createdAt
- updatedAt

### 3. Message

- id
- chat
- content
- Role[user, AI]
=======
>>>>>>> fbc1e79b298b515cb1a21874d8dd193ffc3dc5f2
