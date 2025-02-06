# API DuckDuckGo - Back-End

This is the back-end of the DuckDuckGo search API project, built with **Node.js**, **Express**, and **TypeScript**.

## 🚀 Getting Started

### **1. Clone the Repository**

```sh
git clone https://github.com/wellboorati/duckduckgo-back-end.git
cd api-duckduckgo
```

### **2. Install Dependencies**

Make sure you have **Yarn** installed, then run:

```sh
yarn install
```

### **3. Set Up Environment Variables**

Create a `.env` file in the project root and configure it as needed:

```sh
PORT=3000
```

### **4. Run the Application Locally**

To start the development server with auto-reload:

```sh
yarn start:dev
```

To start the server:

```sh
yarn start
```

To start the production build:

```sh
yarn build
node dist/index.js
```

### **5. Running Tests**

Run unit and integration tests using Jest:

```sh
yarn test
```

### **6. Building the Project**

To compile TypeScript into JavaScript:

```sh
yarn build
```

This will generate the `dist/` folder with the compiled files.

## 📁 Project Structure

```
api-duckduckgo/
│-- src/
│   ├── controllers/    # Business logic for routes
│   ├── routes/         # API endpoints
│   ├── services/       # Utility functions
│   ├── index.ts        # Main entry point
│-- tests/              # Unit and integration tests
│-- .env                # Environment variables (not committed)
│-- package.json        # Dependencies and scripts
│-- tsconfig.json       # TypeScript configuration
│-- README.md           # Project documentation
```

## 📌 API Endpoints

| Method | Endpoint            | Description                 |
|--------|---------------------|-----------------------------|
| GET    | `/search?q=QUERY`   | Fetch search results        |
| GET    | `/history`          | Retrieve search history     |
| POST   | `/search`           | Search with request body    |
| POST   | `/clear-history`    | Clear search history        |

API Endpoints

1. Search DuckDuckGo

GET /search?q=your_query

Description: Perform a search on DuckDuckGo.

Query Parameters:

q (string, required): The search term.

Example:

curl -X GET "http://localhost:3000/search?q=example"

POST /search

Description: Perform a search on DuckDuckGo using a JSON body.

Request Body:

{ "query": "example" }

Example:

curl -X POST "http://localhost:3000/search" -H "Content-Type: application/json" -d '{"query":"example"}'

2. Get Search History

GET /search/history

Description: Retrieve the stored search history.

Example:

curl -X GET "http://localhost:3000/search/history"

3. Clear Search History

POST /search/clear-history

Description: Delete the stored search history.

Example:

curl -X POST "http://localhost:3000/search/clear-history"


## 💡 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Make your changes and commit (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request

## 📜 License

This project is licensed under the **MIT License**.

