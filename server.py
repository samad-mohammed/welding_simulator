
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

# Convert the bytes to a string for use in Flask
secret_key_str = str(secret_key)

app = Flask(__name__)
app.config['SECRET_KEY'] = secret_key_str  # Replace 'your_secret_key_here' with an actual secret key

CORS(app)
bcrypt = Bcrypt(app)
c=0
# Configure MySQL connection
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Samad@123'
app.config['MYSQL_DB'] = 'weld'
app.config['MYSQL_PORT'] = 3306

mysql = MySQL(app)

UPLOAD_FOLDER = 'public\\uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

app.config['SESSION_COOKIE_SECURE'] = True  # Set to True if using HTTPS
app.config['SESSION_TYPE'] = 'filesystem'  # Or use another storage method

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

#-----------------    LOGIN and REGISTER    ---------------------------
    
# #to store the registration details from frontend
# @app.route('/register', methods=['POST'])
# def register_user():
#     try:
#         # Extract data from the request body
#         data = request.get_json()

#         # Assuming the data contains necessary fields for registration
#         myName = data.get('myName')
#         myArmyId = data.get('myArmyId')
#         myBatchNo = data.get('myBatchNo')
#         mySetPassword = data.get('mySetPassword')
#         myConfirmPassword = data.get('myConfirmPassword')

#         # Validate input (you might want to add more validation)
#         if not all([myName, myArmyId, myBatchNo, mySetPassword, myConfirmPassword]):
#             return jsonify({'error': 'All fields are required'}), 400

#         if mySetPassword != myConfirmPassword:
#             return jsonify({'error': 'Passwords do not match'}), 400
        
#         mySetPassword = bcrypt.generate_password_hash(mySetPassword)

#         # Insert user data into the 'users' table
#         cursor = mysql.connection.cursor()
#         query = 'INSERT INTO student_table (myName, myArmyId, myBatchNo, mySetPassword) VALUES (%s, %s, %s, %s)'
#         values = (myName, myArmyId, myBatchNo, mySetPassword)
#         cursor.execute(query, values)
#         mysql.connection.commit()
#         cursor.close()
#         print("Successfully registered")
#         return jsonify({'message': 'Registration successful'}), 200

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        my_name = data.get('myName')
        my_army_id = data.get('myArmyId')
        my_batch_no = data.get('myBatchNo')
        my_set_password = data.get('mySetPassword')

        # Hash the password before storing it
        hashed_password = bcrypt.generate_password_hash(my_set_password).decode('utf-8')

        with mysql.connection.cursor() as cursor:
            # Check if the army ID is already registered
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
        print(f"Error during registration: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

# -------------- ADMIN registration -------------------- 
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
        myConfirmPassword = data.get('confirmPassword')

        # Validate input (you might want to add more validation)
        if not all([myName, myArmyId, myBatchNo, mySetPassword, myConfirmPassword]):
            return jsonify({'error': 'All fields are required'}), 400

        if mySetPassword != myConfirmPassword:
            return jsonify({'error': 'Passwords do not match'}), 400
        
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

@app.route('/login', methods=['POST'])
def login(): 
    data = request.get_json()
    userid = data.get('myArmyId')
    password = data.get('mySetPassword')

    # print()
    # print(password)
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM student_table WHERE myArmyId = %s", (userid,))
    user = cursor.fetchone()

    if user and bcrypt.check_password_hash(user[4], password):
        return jsonify({'message': 'Login successful','name': user[1]})
    else:
        return jsonify({'message': 'Login failed'})



@app.route('/admin', methods=['POST'])
def admin_login(): 
    data = request.get_json()
    # print(data)
    userid = data.get('armyId')
    password = data.get('setPassword')
    # print(userid)
    # print()
    # print(password)
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM admin_table WHERE armyId = %s", (userid,))
    user = cursor.fetchone()
    # print(user)
    if user and bcrypt.check_password_hash(user[4], password):
        print(user)
        return jsonify({'message': 'Login successful','name': user[0]})
    else:
        print(user)
        return jsonify({'message': 'Login failed'}),404

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
        print(f"Error uploading file: {e}")
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
# # Assuming you have a route like this to get the blob data for a file
# @app.route('/get-file/<file_id>', methods=['GET'])
# def get_file(file_id):
#     cursor = mysql.connection.cursor()
#     cursor.execute("SELECT file_data FROM uploads_table WHERE id = %s", (file_id,))
#     result = cursor.fetchone()

#     if result:
#         file_data = result[0]

#         # Create a temporary file to store the blob data
#         temp_file = tempfile.NamedTemporaryFile(delete=False)
#         temp_file.write(file_data)
#         temp_file.close()

#         # Send the file to the client
#         return send_file(temp_file.name, as_attachment=True, download_name=f'file_{file_id}.pdf')
#     else:
#         return jsonify({'message': 'File not found'}), 404

# ------- Receiving image and armyID from AR/VR team( testing code ) ---------

# Check if the user is logged in and handle image upload
# Check if the user is logged in and handle image upload
@app.route('/upload_image', methods=['POST'])
def upload_image():
    # Check if the 'file' key exists in the request
    # print(request.files)
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'})

    uploaded_file = request.files['file']

    if uploaded_file.filename == '':
        return jsonify({'message': 'No selected file'})

    # Check if the file type is allowed
    if uploaded_file and allowed_file(uploaded_file.filename):
        # Extract myArmyId from FormData
        my_army_id = request.form.get('myArmyId')

        # Generate a unique filename for the uploaded file
        filename = f"{my_army_id}_{datetime.now().strftime('%M%H%S_%m-%d')}.jpg"
        
        # Save the file to the specified upload folder
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        # file_path = path.replace('public\\',"")
        print(file_path)
        uploaded_file.save(file_path)

        # Save the file path to the database
        cursor = mysql.connection.cursor()
        # cursor.execute("INSERT INTO student_image_table (myArmyId, image_path, created_at) VALUES (%s, %s, %s)",
        #                (my_army_id, file_path, datetime.now()))
        cursor.execute("INSERT INTO student_image_table (myArmyId, image_path, created_at) VALUES (%s, %s, %s)",
            (my_army_id, file_path.replace("public\\", ''), datetime.now()))

        mysql.connection.commit()
        cursor.close()

        return jsonify({'message': 'Image uploaded successfully', 'myArmyId': my_army_id})
    else:
        return jsonify({'message': 'Invalid file type'})
    

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/get_image_paths', methods=['GET'])
def get_image_paths():
    my_army_id = request.args.get('myArmyId')

    cursor = mysql.connection.cursor()
    cursor.execute("""
        SELECT s.myArmyId, s.myName, i.image_path, i.created_at
        FROM student_table s
        LEFT JOIN student_image_table i ON s.myArmyId = i.myArmyId
        WHERE s.myArmyId = %s
    """, (my_army_id,))
    
    results = cursor.fetchall()
    cursor.close()

    # Create a list of dictionaries with the required data
    data_list = [{'myArmyId': result[0], 'myName': result[1], 'imagePath': result[2], 'created_at':result[3]} for result in results]

    return jsonify({'dataList': data_list})


# from flask import request

@app.route('/get_all_student_activity', methods=['GET'])
def get_all_student_activity():
    try:
        # Retrieve the 'name' query parameter from the request
        search_name = request.args.get('name', '')

        cursor = mysql.connection.cursor()

        # Adjusted SQL query to filter by name if provided
        query = """
            SELECT s.myArmyId, s.myName, i.image_path, i.created_at
            FROM student_image_table i
            JOIN student_table s ON i.myArmyId = s.myArmyId
            WHERE s.myName LIKE %s
        """
        
        cursor.execute(query, ('%' + search_name + '%',))

        results = cursor.fetchall()
        cursor.close()

        # Create a list of dictionaries with the required data
        data_list = [{'myArmyId': result[0], 'myName': result[1], 'imagePath': result[2], 'created_at': result[3]} for result in results]

        return jsonify({'dataList': data_list})

    except Exception as e:
        return jsonify({'error': str(e)})


@app.route('/get_total_students', methods=['GET'])
def get_total_students():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT COUNT(DISTINCT myArmyId) FROM student_table")
        result = cursor.fetchone()
        total_students = result[0] if result else 0
        cursor.close()

        return jsonify({'totalStudents': total_students})

    except Exception as e:
        return jsonify({'error': str(e)})

""" this is working fine but the army Id is the problem

@app.route('/upload', methods=['POST'])
def upload_image():
    try:
        # army_id = session['myArmyId']
        # print(army_id)
        print(request.files)
        # Check if the post request has the file part
        if 'image' not in request.files:
            print("file is missing")
            return {'error': 'Missing file or myArmyId'}, 400

        image_file = request.files['image']

        # If the user does not select a file, the browser may submit an empty file without a filename
        if image_file.filename == '':
            print("No file selected")
            return {'error': 'No selected file'}, 400

        # Generate a unique filename for the image using armyId, date, and month
        timestamp = datetime.now().strftime("%m%d")
        image_filename = f"{timestamp}.jpg"
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)

        # Save the image to the UPLOAD_FOLDER
        image_file.save(image_path)

        # Save the image details to the images_table
        save_image_details_to_database(0, image_path)

        return {'message': 'Image uploaded successfully', 'image_path': image_path}, 201
    except Exception as e:
        return {'error': str(e)}, 500


def save_image_details_to_database(army_id, image_path):
    try:
        connection = mysql.connection
        cursor = connection.cursor()

        # Insert the image details into the images_table
        query = "INSERT INTO student_image_table (myArmyId, image_path) VALUES (%s, %s)"
        cursor.execute(query, (army_id, image_path))

        connection.commit()
        cursor.close()
    except Exception as e:
        print(f"Error: {e}")

"""

#-------------------- Image and text receive from AR/VR ---------------------------
# @app.route('/upload_image', methods=['POST'])
# def upload_image():
#     try:
#         # Get the raw binary data from the request
#         image_data = request.data
#         # print(image_data)
#         # Check if data is empty
#         if not image_data:
#             print("Not an image, Check the image which has been sent")
#             return jsonify({"error": "No image data received"}), 400
        
#         image = Image.open(BytesIO(image_data))

#         # Generate a filename using timestamp
#         timestamp = datetime.now().strftime('%m%d')
#         filename = f'{timestamp}.png'
#         file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#         image.save(file_path)
#         print("Image received successfully")

#         return jsonify({"message": "Image uploaded successfully", "file_path": file_path}), 200

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# @app.route('/get_all_images', methods=['GET'])
# def get_all_images():
#     try:
#         # Get a list of all image filenames in the Uploads folder
#         image_files = [f for f in os.listdir(app.config['UPLOAD_FOLDER']) if f.endswith('.png')]

#         return jsonify({"images": image_files})

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500




#----------- Dashboard to show the welded images and student profile ----------

@app.route('/dashboard',methods=['POST','GET'])
def dashboard():
    if c==0:
        cursor = mysql.connection.cursor()
        cursor.execute('SELECT * FROM weld_data')
        data = cursor.fetchall()
        print(data)
        print(type(data))
        return jsonify(data)
    else :
        return jsonify({'message': 'Login failed'})

@app.route('/user/<armyId>', methods=['POST','GET'])
def get_user_data(armyId):
   try:
       cursor = mysql.connection.cursor()
       cursor.execute("SELECT * FROM weld_data WHERE army_id = %s", (armyId,))
       user_data = cursor.fetchall()
       column_names = [desc[0] for desc in cursor.description]
       cursor.close()

       if not user_data:
           return jsonify({'message': 'No data found for the specified armyId'}), 404

       # Convert each row into a dictionary
       user_data = [dict(zip(column_names, row)) for row in user_data]

       return jsonify({'user_data': user_data}), 200

   except Exception as e:
       return jsonify({"error": str(e)}), 500



#----------- Image and text receive from AR/VR team ----------
        

def push_score(value1,value2,value3):
    try:
        cursor = mysql.connection.cursor()
        query = "INSERT INTO score (val1,val2,val3) VALUES (%s, %s, %s)"
        values=[value1,value2,value3]
        cursor.execute(query, values)

        mysql.connection.commit()

        cursor.close()
        print("success")
        return jsonify({'message': 'Values pushed success'})
    except Exception as e:
        return jsonify({"error": str(e)}), 500\
    



#testing connection with arvr team
@app.route('/post_score', methods=['POST'])
def post_score():
    global value1,value2,value3
    try:
        received_data = request.data.decode('utf-8')  # Decode the received data as a UTF-8 string
        print("Samad successfully received data from ARVR: " + received_data)

        # Split the received string using comma as the delimiter
        values = received_data.split(',')
        
        if len(values) != 3:
            raise ValueError("Expected 3 values separated by commas")

        time1, score1,angle1,weld_type = values 
        value1, value2, value3 = values
        value1=value1[2:]
        value3=value3[:-2]

        print("Value 1:", value1)
        print("Value 2:", value2)
        print("Value 3:", value3)
        push_score(value1,value2,value3)
        result = {'result': received_data}
        return jsonify(result)
    except Exception as e:
        print("Not receiving score")
        print(str(e))
        return jsonify({'error': str(e)})
    

#-------------------------------------------------------------------------------

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000)