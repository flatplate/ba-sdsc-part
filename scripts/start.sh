#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

mkdir $DIR/../logs

$DIR/startbackend.sh >> $DIR/../logs/backend.log &
$DIR/startadmin.sh >> $DIR/../logs/admin.log & 
$DIR/startapp.sh >> $DIR/../logs/app.log &