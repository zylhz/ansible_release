#!/usr/bin/env
import os,time,copy,sys
os.environ['log_stdout'] = "1"
nowtime = time.localtime()

nowjson = {
"wday" : str(nowtime.tm_wday+1),
"hour" : str(nowtime.tm_hour),
"min" : str(nowtime.tm_min),
"sec" : str(nowtime.tm_sec)
}

if nowjson["wday"] == "7":
    nowjson["wday"] = "0"

def formattime(nowjson):
    if int(nowjson["min"]) >= 60:
        nowjson["min"] = str(int(nowjson["min"])-60)
        nowjson["hour"] = str(int(nowjson["hour"])+1)
    if int(nowjson["hour"]) >= 24:
        nowjson["hour"] = str(int(nowjson["hour"])-24)
    if len(nowjson["hour"]) != 2:
        nowjson["hour"] = "0"+ nowjson["hour"]
    if len(nowjson["min"]) != 2:
        nowjson["min"] = "0"+ nowjson["min"]
    return nowjson


def countrybattle(now):
    adjust_time=formattime(now)
    countrybattle_start = ('peer_countrybattle_starttime=\"{0}:{1}:{2}\"')\
                        .format(adjust_time["wday"],adjust_time["hour"],adjust_time["min"])
    return countrybattle_start

def kingcup(now):
    adjust_time=formattime(now)
    kingcup_start = ('king_officer_selectday={0} challengecup_king_cupbegintime=\"{1}:{2}\"')\
                        .format(adjust_time["wday"],adjust_time["hour"],adjust_time["min"])
    return kingcup_start


def arena(now):
    adjust_time1 = formattime(now)
    adjust_time2 = copy.copy(adjust_time1)
    adjust_time2['min'] = str(int(adjust_time2['min']) + 20)
    adjust_time2 = formattime(adjust_time2)
    adjust_time3 = copy.copy(adjust_time2)
    adjust_time3['min'] = str(int(adjust_time3['min']) + 15)
    adjust_time3 = formattime(adjust_time3)
    arena_start = ('challengecup_arena_cupbegintime=\"{0}:{1},{2}:{3},{4}:{5}\" challengecup_arena_cuptimeplan=\"3,2,1,1,1,1,1\"')\
                        .format(adjust_time1["hour"],adjust_time1["min"],adjust_time2["hour"],adjust_time2["min"],adjust_time3["hour"],adjust_time3["min"])
    return arena_start

def generate_command(args,nowjson):
    activities = []
    for i in args:
 #       print i
        activities.append(i.split(",")[1])
    activities_command = ''
    start_command = ''
    start_list = []
    if len(activities) == 1:
        start_list.append(globals()[activities[0].strip()](nowjson))
        start_command = ' '.join(start_list)
        return start_command
    else:
        start_list.append(globals()[activities[0].strip()](nowjson))
        activities.pop(0)
        for i in activities:
            nowjson["min"] = str(int(nowjson["min"]) + 30)
            nowjson = formattime(nowjson)
            start_list.append(globals()[i.strip()](nowjson))
        start_command = ' '.join(start_list)
        return start_command

def start_game_args(args):
    start_commands = generate_command(args,nowjson)
    print start_commands
    return start_commands

#start_game_args([u'lyingdragon, countrybattle,223.202.35.165', u'lyingdragon, kingcup,223.202.35.165', u'lyingdragon, arena,223.202.35.165'])
