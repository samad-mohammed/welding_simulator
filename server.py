
from flask import Flask, render_template, redirect, url_for, request, flash,  send_file,jsonify, session, make_response
from flask_mysqldb import MySQL
import os
from flask_cors import CORS
from werkzeug.utils import secure_filename
from flask_bcrypt import Bcrypt
from PIL import Image
from io import BytesIO
import uuid
from datetime import datetime

import os
import io
from flask import send_file
import tempfile

# Generate a random secret key
secret_key = os.urandom(24)

ip_data={}
score_data={}

# Convert the bytes to a string for use in Flask
secret_key_str = str(secret_key)
user_id=""

app = Flask(__name__)
app.config['SECRET_KEY'] = secret_key_str  # Replace 'your_secret_key_here' with an actual secret key

CORS(app)
bcrypt = Bcrypt(app)
c=0
# Configure MySQL connection
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'password'
app.config['MYSQL_DB'] = 'welding'
app.config['MYSQL_PORT'] = 3306

mysql = MySQL(app)

UPLOAD_FOLDER = 'public\\uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

app.config['SESSION_COOKIE_SECURE'] = True  # Set to True if using HTTPS
app.config['SESSION_TYPE'] = 'filesystem'  # Or use another storage method

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


global log
@app.route('/login', methods=['POST'])
def login(): 
    data = request.get_json()
    # print(data)
    userid = data.get('myArmyId')
    password = data.get('mySetPassword')
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM student_table WHERE myArmyId = %s", (userid,))
    user = cursor.fetchone()

    if user and bcrypt.check_password_hash(user[4], password):
        return jsonify({'message': 'Login successful','name': user[1]})
    else:
        return jsonify({'message': 'Login failed'})

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        my_name = data.get('myName')
        my_army_id = data.get('myArmyId')
        my_batch_no = data.get('myBatchNo')
        my_set_password = data.get('mySetPassword')
        hashed_password = bcrypt.generate_password_hash(my_set_password).decode('utf-8')

        with mysql.connection.cursor() as cursor:
            cursor.execute("SELECT * FROM student_table WHERE myArmyId = %s", (my_army_id,))
            existing_user = cursor.fetchone()

            if existing_user:
                return jsonify({'message': 'Army ID already exists'}), 400

            # Insert the new user into the database
            insert_query = "INSERT INTO student_table (myName, myArmyId, myBatchNo, mySetPassword) VALUES (%s, %s, %s, %s)"
            cursor.execute(insert_query, (my_name, my_army_id, my_batch_no, hashed_password))
            mysql.connection.commit()

        return jsonify({'message': 'Registration successful'}), 200

    except Exception as e:
        # print(f"Error during registration: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

# ------------------ ADMIN registration and login ---------------------------------------
    
@app.route('/adminregister', methods=['POST'])
def admin_register():
    try:
        # Extract data from the request body
        data = request.get_json()

        # Assuming the data contains necessary fields for registration
        myName = data.get('name')
        myArmyId = data.get('armyId')
        myBatchNo = data.get('batchNo')
        mySetPassword = data.get('setPassword')
        # myConfirmPassword = data.get('confirmPassword')

        # Validate input (you might want to add more validation)
        if not all([myName, myArmyId, myBatchNo, mySetPassword]):
            return jsonify({'error': 'All fields are required'}), 400

        mySetPassword = bcrypt.generate_password_hash(mySetPassword)

        # Insert user data into the 'users' table
        cursor = mysql.connection.cursor()
        query = 'INSERT INTO admin_table (name, armyId, batchNo, setPassword) VALUES (%s, %s, %s, %s)'
        values = (myName, myArmyId, myBatchNo, mySetPassword)
        cursor.execute(query, values)
        mysql.connection.commit()
        cursor.close()

        return jsonify({'message': 'Registration successful'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/admin', methods=['POST'])
def admin_login(): 
    data = request.get_json()
    # print(data)
    userid = data.get('armyId')
    password = data.get('setPassword')
    
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM admin_table WHERE armyId = %s", (userid,))
    user = cursor.fetchone()
    if user and bcrypt.check_password_hash(user[4], password):
        return jsonify({'message': 'Login successful','name': user[0]})
    else:
        return jsonify({'message': 'Login failed'}),404
    
# ------------------------------------------------------------------------------------------


@app.route('/game_login', methods=['POST'])
def game_login(): 
    global user_id,log,ip_data
    try:
        # Get the data sent from Unity
        data = request.json
        # Extract login and password from the JSON data
        user_ip=request.remote_addr
        login = data.get('Login')
        log = login
        password = data.get('Password')
        
        # Query the database for the user
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM student_table WHERE myArmyId = %s", (login,))
        user = cursor.fetchone()

        # Check if user exists and password is correct
        if user and bcrypt.check_password_hash(user[4], password):
            ip_data[user_ip]=user[2]
            # print("Success Login")
            user_id=user[2]
            return jsonify({'message': 'Login successful', 'name': user[1]}), 200
        else:
            # print("User not found")
            return jsonify({'message': 'Login failed'}), 401
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

#-----------------------------------------------------------------------------------------
    
#---------------------   Books uploads, view, delete   -------------------------------------


@app.route('/upload-file', methods=['POST'])
def upload_file():
    try:
       
        instructor_name = request.form.get('instructorName')
        book_name = request.form.get('bookName')

        if 'file' not in request.files:
            return jsonify(error="No file uploaded"), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify(error="No selected file"), 400

        if file:
            filename = secure_filename(file.filename)
            file_data = file.read()

            # Insert data into the database
            insert_query = "INSERT INTO uploads_table (filename, file_data, instructor_name, book_name) VALUES (%s, %s, %s, %s)"

            with mysql.connection.cursor() as cursor:
                values = (filename, file_data, instructor_name, book_name)
                cursor.execute(insert_query, values)
                mysql.connection.commit()
                cursor.close()

            return jsonify(message="File uploaded successfully"), 200

    except Exception as e:
        # print(f"Error uploading file: {e}")
        return jsonify(error="Internal Server Error"), 500


@app.route('/get-files', methods=['GET'])
def get_files():
    with mysql.connection.cursor() as cursor:
        cursor.execute("SELECT id,instructor_name,  book_name FROM uploads_table")
        files = cursor.fetchall()
        # print(files)
    file_list = [{'id': file[0],'instructor_name':file[1],'book_name': file[2], 'url': f'/view-file/{file[0]}'}
                 for file in files]

    return jsonify({'files': file_list})

@app.route('/delete-file/<file_id>', methods=['DELETE'])
def delete_file(file_id):
    try:
        with mysql.connection.cursor() as cursor:
            cursor.execute("DELETE FROM uploads_table WHERE id = %s", (file_id,))
            mysql.connection.commit()

        return jsonify({'message': 'File deleted successfully', 'success': True})
    except Exception as e:
        return jsonify({'message': f'Error deleting file: {str(e)}', 'success': False})


# Assuming you have a route like this to get the blob data for a file
@app.route('/get-file/<file_id>', methods=['GET'])
def get_file(file_id):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT file_data FROM uploads_table WHERE id = %s", (file_id,))
    result = cursor.fetchone()

    if result:
        file_data = result[0]

        # Create a BytesIO object to store the blob data
        bytes_io = BytesIO(file_data)

        # Create a response with appropriate content type and headers
        response = make_response(send_file(bytes_io, as_attachment=True, download_name=f'file_{file_id}'))
        response.headers['Content-Type'] = 'application/pdf'  # Modify content type based on your file type

        return response
    else:
        return jsonify({'message': 'File not found'}), 404

    
import base64
from PIL import Image
from io import BytesIO

import pytz
from datetime import datetime


@app.route('/upload_image', methods=['POST'])
def upload_image():
    global ip_data, score_data
    try:
        # Get the raw binary data from the request
        user_ip = request.remote_addr
        image_data = request.data
        
        if not image_data:
            return jsonify({"error": "No image data received"}), 400
        
        # Convert image data to binary format
        blob_data = BytesIO(image_data).read()

        


        # Generate a filename using timestamp
        user_id = ip_data.get(user_ip)
        timestamp = datetime.now(pytz.timezone('Asia/Kolkata')).strftime('%m-%d_%H-%M-%S')
        filename = f'{user_id}_{timestamp}.png'

        cursor = mysql.connection.cursor()
        cursor.execute("INSERT INTO students_result_table (myArmyId, image_blob, created_at, score) VALUES (%s, %s, %s, %s)",
            (user_id, blob_data, datetime.now(pytz.timezone('Asia/Kolkata')), score_data.get(user_ip)))
        mysql.connection.commit()
        cursor.close()

        print("************************** Image received successfully *****************************")

        return jsonify({"message": "Image uploaded successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred while processing the image: {str(e)}"}), 500

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/get_image_paths', methods=['GET'])
def get_image_paths():
    my_army_id = request.args.get('myArmyId')

    cursor = mysql.connection.cursor()
    cursor.execute("""
        SELECT s.myArmyId, s.myName, i.image_path, i.created_at,i.score
        FROM student_table s
        LEFT JOIN student_image_table i ON s.myArmyId = i.myArmyId
        WHERE s.myArmyId = %s
    """, (my_army_id,))
    
    results = cursor.fetchall()
    cursor.close()

    # Create a list of dictionaries with the required data
    data_list = [{'myArmyId': result[0], 'myName': result[1], 'imagePath': result[2], 'created_at':result[3],'score':result[4]} for result in results]

    return jsonify({'dataList': data_list})


# from flask import request
from datetime import datetime

@app.route('/get_latest_student_activity', methods=['GET'])
def get_latest_student_activity():
    try:
        search_name = request.args.get('name', '')

        cursor = mysql.connection.cursor()

        # SQL query to fetch the most recent date
        max_date_query = "SELECT MAX(created_at) FROM students_result_table"
        cursor.execute(max_date_query)
        latest_date = cursor.fetchone()[0].strftime('%Y-%m-%d')

        # SQL query to fetch results of the most recent date
        query = """
        SELECT s.myArmyId, s.myName, i.image_blob, i.created_at, i.score
        FROM students_result_table i
        JOIN student_table s ON i.myArmyId = s.myArmyId
        WHERE DATE(i.created_at) = %s and  s.myName LIKE %s
        ORDER BY i.score DESC
        """

        cursor.execute(query, (latest_date, '%' + search_name + '%'))


        results = cursor.fetchall()
        cursor.close()

        # Create a list of dictionaries with the required data
        data_list = []
        for result in results:
            # Convert the binary image data to base64
            image_base64 = base64.b64encode(result[2]).decode('utf-8')
            data = {
                'myArmyId': result[0],
                'myName': result[1],
                'imageData': image_base64,  # Include the base64 encoded image data
                'created_at': result[3],
                'score': result[4]
            }
            data_list.append(data)

        return jsonify({'dataList': data_list})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/get_all_student_activity', methods=['GET'])
def get_all_student_activity():
    try:
        # Retrieve the 'name' query parameter from the request
        search_name = request.args.get('name', '')

        cursor = mysql.connection.cursor()

        # Adjusted SQL query to filter by name if provided
        query = """
        SELECT s.myArmyId, s.myName, i.image_blob, i.created_at, i.score
        FROM students_result_table i
        JOIN student_table s ON i.myArmyId = s.myArmyId
        WHERE s.myName LIKE %s
        ORDER BY i.score DESC
        """
        
        cursor.execute(query, ('%' + search_name + '%',))

        results = cursor.fetchall()
        cursor.close()

        # Create a list of dictionaries with the required data
        data_list = []
        for result in results:
            # Convert the binary image data to base64
            image_base64 = base64.b64encode(result[2]).decode('utf-8')
            data = {
                'myArmyId': result[0],
                'myName': result[1],
                'imageData': image_base64,  # Include the base64 encoded image data
                'created_at': result[3],
                'score': result[4]
            }
            data_list.append(data)

        return jsonify({'dataList': data_list})

    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/get_total_students', methods=['GET'])
def get_total_students():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT COUNT(DISTINCT myArmyId) FROM students_result_table")
        result = cursor.fetchone()
        total_students = result[0] if result else 0
        cursor.close()

        return jsonify({'totalStudents': total_students})

    except Exception as e:
        return jsonify({'error': str(e)})


#----------- Image and text receive from AR/VR team ----------
        
#testing connection with arvr team
@app.route('/post_score', methods=['POST'])
def post_score():
    global value1,score_data
    try:
        user_ip=request.remote_addr
        received_data = request.data.decode('utf-8')  # Decode the received data as a UTF-8 string
        # print("Samad successfully received data from ARVR: " + received_data)
        score_data[user_ip]=int(received_data)
        # Split the received string using comma as the delimiter
        values = received_data

        
        result = {'result': values}
        return jsonify(result)
    except Exception as e:
        # print("Not receiving score")
        # print(str(e))
        return jsonify({'error': str(e)})
    

@app.route('/push',methods=["POST"])
def push():
    image=request.data
    id=0
    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO image (id,img) VALUES (%s, %s)", (id,image))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"messge":"done1"})

@app.route('/get',methods=["GET"])
def fetch():
    cursor = mysql.connection.cursor()
    
    cursor.execute("SELECT img FROM image WHERE id = %s", (1,))
    image_data = cursor.fetchone()

    cursor.close()
    

    if image_data:
        return send_file(io.BytesIO(image_data[0]), mimetype='image/jpeg')
    else:
        return 'Image not found', 404
#-------------------------------------------------------------------------------

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000,debug=True)