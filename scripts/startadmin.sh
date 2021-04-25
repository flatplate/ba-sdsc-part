DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd $DIR/../partjs
npm link
cd $DIR/../adminapp
npm link partjs
npm start -y
read -t 3 -n 1