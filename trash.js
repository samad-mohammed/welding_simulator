
// @app.route('/upload-file', methods=['POST'])
// def upload_file():
//     try:
//         instructor_name = request.form.get('instructorName')
//         book_name = request.form.get('bookName')

//         if 'file' not in request.files:
//             return jsonify(error="No file uploaded"), 400

//         file = request.files['file']

//         if file.filename == '':
//             return jsonify(error="No selected file"), 400

//         if file:
//             filename = secure_filename(file.filename)
//             file_data = file.read()

//             # Insert data into the database
//             insert_query = "INSERT INTO uploads_table (filename, file_data, instructor_name, book_name) VALUES (%s, %s, %s, %s)"

//             with mysql.connection.cursor() as cursor:
//                 values = (filename, file_data, instructor_name, book_name)
//                 cursor.execute(insert_query, values)
//                 mysql.connection.commit()
//                 cursor.close()

//             return jsonify(message="File uploaded successfully"), 200

//     except Exception as e:
//         print(f"Error uploading file: {e}")
//         return jsonify(error="Internal Server Error"), 500

