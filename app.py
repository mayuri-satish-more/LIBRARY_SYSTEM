from flask import Flask, jsonify, request, render_template
app = Flask(__name__)

# In-memory "database" to store books
books = {}
book_id_counter = 1

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/books', methods=['POST'])
def create_book():
    global book_id_counter
    data = request.json
    if not all(key in data for key in ("title", "author", "year")):
        return jsonify({"message": "Missing fields in request"}), 400
    book = {
        "id": book_id_counter,
        "title": data["title"],
        "author": data["author"],
        "year": data["year"]
    }
    books[book_id_counter] = book
    book_id_counter += 1
    return jsonify({"message": "Book created successfully", "book": book}), 201

@app.route('/api/books', methods=['GET'])
def get_books():
    return jsonify(list(books.values())), 200

@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    book = books.get(book_id)
    if not book:
        return jsonify({"message": "Book not found"}), 404
    return jsonify(book), 200

@app.route('/api/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    data = request.json
    book = books.get(book_id)
    if not book:
        return jsonify({"message": "Book not found"}), 404
    book.update({
        "title": data.get("title", book["title"]),
        "author": data.get("author", book["author"]),
        "year": data.get("year", book["year"])
    })
    return jsonify({"message": "Book updated successfully", "book": book}), 200

@app.route('/api/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    if book_id not in books:
        return jsonify({"message": "Book not found"}), 404
    del books[book_id]
    return jsonify({"message": "Book deleted successfully"}), 200

if __name__ == "__main__":
    app.run(debug=True)