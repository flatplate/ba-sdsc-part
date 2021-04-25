DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd $DIR/../backend
source venv/Scripts/activate
cd part
export FLASK_APP=app.py
flask run
read -t 3 -n 1