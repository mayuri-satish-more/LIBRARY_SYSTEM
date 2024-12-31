const API_URL = "/api/books";

// Fetch and display all books
async function fetchBooks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch books");
        }
        const books = await response.json();
        const booksList = document.getElementById("books");
        booksList.innerHTML = "";

        books.forEach(book => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${book.title} by ${book.author} (${book.year})
                <button onclick="deleteBook(${book.id})">Delete</button>
            `;
            booksList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching books:", error);
        alert("Failed to load books. Please try again later.");
    }
}

// Add a new book
async function addBook() {
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const year = document.getElementById("year").value.trim();

    if (!title || !author || !year) {
        alert("Please fill in all fields!");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, author, year })
        });

        if (!response.ok) {
            throw new Error("Failed to add book");
        }

        // Clear input fields
        document.getElementById("title").value = "";
        document.getElementById("author").value = "";
        document.getElementById("year").value = "";

        fetchBooks(); // Refresh the books list
    } catch (error) {
        console.error("Error adding book:", error);
        alert("Failed to add book. Please try again.");
    }
}

// Delete a book
async function deleteBook(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) {
            throw new Error("Failed to delete book");
        }
        fetchBooks(); // Refresh the books list
    } catch (error) {
        console.error("Error deleting book:", error);
        alert("Failed to delete book. Please try again.");
    }
}

// Load books on page load
document.addEventListener("DOMContentLoaded", fetchBooks);
