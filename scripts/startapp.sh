DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

cd $DIR/../partjs
npm link
cd $DIR/../app
npm link partjs
export PORT=3001
npm start
read -t 3 -n 1