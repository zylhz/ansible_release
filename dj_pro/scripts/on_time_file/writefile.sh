#!/bin/bash
num=1
while true
do
        echo -e "$num $num" >> writefile.txt
        sleep 1
        if [[ $num == 1000 ]];then
                echo end
                break
        fi
        num=$(($num+1)) 
done
