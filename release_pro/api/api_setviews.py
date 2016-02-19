#!/usr/bin/env  python
# -*- coding: utf-8 -*-
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser,FileUploadParser

from rest_framework.decorators import detail_route, list_route

from .models import *
from .serializers import *
from script.git_extra import Git_Extra
from script.ansi_book import Ansi_Play
from script.upyun_extra import Upyun_Api


import sys

reload(sys)
sys.setdefaultencoding('utf-8')

from datetime import *
import sh
import os
import time
import re
import stat
import json
import subprocess

class Project_ItemViewSet(viewsets.ModelViewSet):

    serializer_class = Project_ItemSerializer
    queryset = Project_Item.objects.all()

    @list_route(methods=['get', 'post'])
    def branch_list(self, request, pk=None):
        ansi_dir, ansi_yml = request.DATA['pro_ansi_codedir'], request.DATA['pro_ansi_yml']
        ansi_release_yml = request.DATA['pro_ansi_release_yml']
        now_dir = ansi_release_yml.split('.')[0] + '_db'
        try:
            with open(now_dir + '/' + 'database.json','r') as f:
                para = json.loads(f.read())
                db_host = para['host']
                db_name = para['db_name']
        except:
            db_host = 'not'
            db_name = 'not'
        git = Git_Extra(ansi_dir)
        branches = git.search_branch()
        nowbranch = git.now_branch()
        return Response([branches, nowbranch, db_name, db_host])

    def one_common(self, request, pk=None, ansi='pro_ansi_yml', extra_vars={}, action='pull'):
        start_time = time.time()
        log_simple = []
        log_complex = []
        log_error = []
        log_name = ''
        try:
            ansi_yml = request.DATA[ansi]
            print ansi_yml
        except:
            ansi_yml = ansi
        try:
            excute = Ansi_Play(ansi_yml, extra_vars)
        except:
            excute = Ansi_Play(ansi_yml)
        report = excute.run()
        try:
            pro_name = request.DATA['pro_name']
        except:
            try:
                pro_name = request.DATA['pro_group_name']
            except:
                pro_name = request.DATA['name']
        log_simple.append(str(report[0]))
        try:
            log_complex.append(str(report[1].decode('ascii', 'ignore')))
        except:
            log_complex.append(unicode(report[1], errors='ignore'))
        self.file_log(str(report[1]), str(request.DATA['pro_group']), action)
        if str(''.join(report[2].split('\n'))) != '':
            log_name = pro_name + ' ' + ':' + ' ' + str(''.join(report[2].split('\n'))) + ' '
        else:
            log_name = ''
        end_time = time.time()
        cost_time = str(round(end_time - start_time, 2))
        for j in report[0]:
            if report[0][j]['failures'] >= 1 or report[0][j]['unreachable'] >= 1:
                log_name += pro_name + ' ' + j + ' ' + 'failed\n'
            if re.search('but failed', cost_time):
                pass
            else:
                if report[0][j]['failures'] >= 1 or report[0][j]['unreachable'] >= 1:
                    cost_time += ' but failed'
        log_error.append(str(''.join(log_name.split('\n'))))
        return Response(['\n'.join(log_simple), ''.join(''.join(log_complex).split('\\n')), cost_time, '\n'.join(log_error)])

    def multi_common(self, request, pk=None, ansi='pro_ansi_yml', action='pull'):
        start_time = time.time()
        log_simple = []
        log_complex = []
        log_error = []
        cost_time = {}
        log_name = ''
        for i in request.DATA:
            start_item_time = time.time()
            if action == 'process':
                ansi_yml = i['ansi']
            else:
                ansi_yml = i[ansi]
            try:
                extra_vars = {'version': i['version']}
                excute = Ansi_Play(ansi_yml, extra_vars)
            except:
                excute = Ansi_Play(ansi_yml)
            log = excute.run()
            log_simple.append(str(log[0]))
            try:
                log_complex.append(str(log[1].decode('ascii', 'ignore')))
            except:
                log_complex.append(unicode(log[1], errors='ignore'))
            self.file_log(str(log[1]), str(i['pro_group']), action)
            if str(''.join(log[2].split('\n'))) != '':
                try:
                    pro_name = i['pro_name']
                    log_error.append(pro_name + ':' + str(log[2]))
                except:
                    log_error.append(i['pro_group_name'] + ":" + str(log[2]))
            else:
                log_name = ''
            end_item_time = time.time()
            cost_time[i['pro_name']] = str(round(end_item_time - start_item_time, 2))
            print log[0]
            for j in log[0]:
                print j
                if log[0][j]['failures'] >= 1 or log[0][j]['unreachable'] >= 1:
                    log_name += i['pro_name'] + ' ' + j + ' failed\n'
                if re.search('but failed', cost_time[i['pro_name']]):
                    pass
                else:
                    print j
                    print log[0][j]['failures']
                    if log[0][j]['failures'] >= 1 or log[0][j]['unreachable'] >= 1:
                        cost_time[i['pro_name']] += ' but failed'
            log_error.append(str(log_name))
            print log_error
        end_time = time.time()
        cost_time['total'] = str(round(end_time - start_time, 2))
        return Response(['\n'.join(log_simple), ''.join(''.join(log_complex).split('\\n')), cost_time, '\n'.join(log_error) ])

    def common_search_yml(self, request, yml_dir):
        yml_set = []
        yml_name = sh.ls(yml_dir).split()
        for i in yml_name:
            yml_set.append({'name': i.split('.')[0], 'filename': yml_dir + i, 'pro_name': i.split('.')[0]})
        return Response(yml_set)

    def file_log(self, file_text, pro_name, action):
        log_time = '\n日期：' + str(datetime.today()) + '\n'
        with open('/data/ansible/complex_log/' + pro_name + '_' + action + '.log', 'a+') as f:
            f.write(log_time)
            f.write(file_text)
        return 'log add ok'

    @list_route(methods=['get', 'post'])
    def git_pull(self, request, pk=None):
        ansi = request.DATA['dir']
        newlist = Git_Extra(git_dir=ansi).pull()
        print newlist
        return Response({'report': 'ok'})

    @list_route(methods=['get', 'post'])
    def process_search_yml(self, request, pk=None):
        ansi = request.DATA['dir']
        return self.common_search_yml(request, yml_dir=ansi)

    @list_route(methods=['get', 'post'])
    def init_env_items(self, request, pk=None):
        init_book = request.DATA['init_book']
        with open(init_book, 'r') as f:
            items = [{'item': i.strip()} for i in f.readlines()]
        return Response(items)

    @list_route(methods=['get', 'post'])
    def single_env_install(self, request, pk=None):
        for i in request.DATA:
            print i
        ansi = request.DATA['separate_book']
        extra_vars = {"process": request.DATA['process_vars'], "myhost": request.DATA['myhost']}
        print extra_vars
        # return Response(extra_vars)
        return self.one_common(request, ansi=ansi, extra_vars=extra_vars, action='init_emv')

    @list_route(methods=['get', 'post'])
    def file_read(self, request, pk=None):
        try:
            pro_group, action = request.DATA['pro_group'], request.DATA['action']
            with open('/data/ansible/complex_log/' + pro_group + '_' + action + '.log', 'r') as f:
                complex_log = f.readlines()
        except:
            complex_log = 'not exists'
        return Response(['\n'.join(complex_log)])

    @list_route(methods=['get', 'post'])
    def pull_all(self, request, pk=None):
        return self.multi_common(request)

    @list_route(methods=['get', 'post'])
    def branch_release(self, request, pk=None):
        return self.one_common(request, ansi='pro_ansi_release_yml', action='release')

    @list_route(methods=['get', 'post'])
    def backup_release(self, request, pk=None):
        return self.one_common(request, ansi='pro_ansi_backup_yml', action='release')

    @list_route(methods=['get', 'post'])
    def branch_pull(self, request, pk=None):
        extra_vars = {"version": request.DATA['version']}
        return self.one_common(request, extra_vars=extra_vars)

    @list_route(methods=['get', 'post'])
    def release_all(self, request, pk=None):
        return self.multi_common(request, ansi='pro_ansi_release_yml', action='release')

    @list_route(methods=['get', 'post'])
    def backup_all(self, request, pk=None):
        return self.multi_common(request, ansi='pro_ansi_backup_yml', action='backup')

    @list_route(methods=['get', 'post'])
    def process_reset(self, request, pk=None):
        ansi = request.DATA['filename']
        return self.one_common(request, ansi=ansi, action='process')

    @list_route(methods=['get', 'post'])
    def temporary_command(self, request, pk=None):
        ansi = request.DATA['pro_ansi_release_yml']
        extra_vars = {"myhost": request.DATA['ip'],"command": request.DATA['command']}
        print request.DATA
        return self.one_common(request, ansi=ansi, extra_vars=extra_vars)

    @list_route(methods=['get', 'post'])
    def process_selected_reset(self, request, pk=None):
        return self.multi_common(request, action='process')

    @list_route(methods=['get', 'post'])
    def yml_exe(self, request, pk=None):
        ansi = request.DATA['yml_full_distination']
        # ip = request.DATA['pro_group_name']
        return self.one_common(request, ansi=ansi)

    @list_route(methods=['get', 'post'])
    def search_yml(self, request, pk=None):
        yml_dir_all = []
        yml_set = []
        yml_dir_list = request.DATA['pro_ansi_release_yml'].split('/')
	print yml_dir_list
        yml_dir_list.pop()
        yml_dir = '/'.join(yml_dir_list) + '/costume'
        yml_dir_all.append([yml_dir, request.DATA['pro_name']])
        print yml_dir_all
        for i,x in yml_dir_all:
            if os.path.exists(i):
                try:
                    files = sh.ls(i).split()
                except:
                    pass
                else:
                    for j in files:
                        print j
                        with open(i + '/' + j,'r') as f:
                            try:
                                explain = f.readlines()[0].strip().split(':')[1]
                            except:
                                explain = 'no explanation'
                            yml_set.append({'pro_name': x,
                                            'yml_name': j,
                                            'yml_full_distination': i + '/' + j,
                                            'yml_explain': explain})
        return Response(yml_set)

class Project_GroupViewSet(viewsets.ModelViewSet):

    serializer_class = Project_GroupSerializer
    queryset = Project_Group.objects.all()


class Project_VarViewSet(viewsets.ModelViewSet):

    serializer_class = Project_VarSerializer
    queryset = Project_Var.objects.all()

    def divide_math(self, usage, usage_mea, measure):
        if usage >= 1024:
            print usage
            usage = round(float(usage)/1024, 2)
            usage_mea = str(usage) + measure
        return usage, usage_mea

    def time_exchange(self, short_time):
        import time
        timeArray = time.localtime(short_time)
        styletime = time.strftime("%Y-%m-%d %H:%M:%S", timeArray)
        return styletime

    @list_route(methods=['get', 'post'])
    def upyun_get_info(self, request, pk=None):
        auth_para = request.DATA
        print auth_para
        data_all = {}
        while True:
            try:
                up = Upyun_Api(auth_para["space"], auth_para["username"], auth_para["password"])
                data_all["dir"] = up.getlist(auth_para["dir"])
                usage = up.usage()
                print up
                break
            except:
                pass
        usage_mea = str(usage) + 'B'
        for mea in ['KB', 'MB', 'GB']:
            usage, usage_mea = self.divide_math(usage, usage_mea, mea)
        data_all["usage"] = usage
        data_all["usage_mea"] = usage_mea
        for i in data_all["dir"]:
            i["time_style"] = self.time_exchange(float(i["time"]))
        return Response(data_all)

    @list_route(methods=['get', 'post'])
    def upyun_delete(self, request, pk=None):
        up_file = request.DATA['file_name']
        auth_para = request.DATA
        print up_file
        up = Upyun_Api(auth_para["space"], auth_para["username"], auth_para["password"])
        up.delete(up_file)
        return Response({'result': up_file + ' has been deleted'})

    @list_route(methods=['get', 'post'])
    def upyun_upload(self, request, pk=None):
        auth_para = request.DATA
        print auth_para
        up = Upyun_Api(auth_para["space"], auth_para["username"], auth_para["password"])
        filename = request.FILES['file']
        filenames = str(filename)
        print filenames
        up.put(auth_para["dir"] + '/' + filenames, filename)
        return Response({'result': filenames + 'upload'})

    @list_route(methods=['post'])
    def upyun_mkdir(self,request, *args, **kwargs):
        new_dir = request.DATA['new_dir']
        auth_para = request.DATA
        print new_dir
        up = Upyun_Api(auth_para["space"], auth_para["username"], auth_para["password"])
        up.mkdir(new_dir)
        return Response({'result': new_dir + ' has been created'})


class Process_ResetViewSet(viewsets.ModelViewSet):

    serializer_class = Process_ResetSerializer
    queryset = Process_Reset.objects.all()

    def one_detail(self, files):
        file_set = {}
        file_stat = os.stat(files)
        file_set['size'] = file_stat[stat.ST_SIZE]
        mode = file_stat[stat.ST_MODE]
        if stat.S_ISREG(mode):
            file_set['is_file'] = True
        else:
            file_set['is_file'] = False
        if os.access(files, os.R_OK):
            file_set['R_OK'] = True
        else:
            file_set['R_OK'] = False
        if os.access(files, os.W_OK):
            file_set['W_OK'] = True
        else:
            file_set['W_OK'] = False
        if os.access(files, os.X_OK):
            file_set['X_OK'] = True
        else:
            file_set['X_OK'] = False
        file_set['time'] = os.path.getmtime(files)
        x = time.localtime(file_set['time'])
        file_set['time_of_last_modification'] = time.strftime('%Y-%m-%d %H:%M:%S', x)
        file_set['name'] = files
        return file_set

    @list_route(methods=['get', 'post'])
    def search_dir(self, request, pk=None):
        print request.DATA
        vars_dir = request.DATA['dir_list'].split('.')[0]
        print vars_dir
        try:
            filelist = [[i,time.ctime(os.path.getmtime(vars_dir + '/' + i))]
                    for i in os.listdir(vars_dir)]
        except:
            filelist = []
        return Response(filelist)

    @list_route(methods=['post'])
    def list_dir(self,request):
        detail_set = self.common_list_dir(request)
        return Response(detail_set)

    def common_list_dir(self,request):
        detail_set = {}
        now_dir = request.DATA['dir']
        all_dir = request.DATA['all_dir']
        detail_set[all_dir] = []
        now_dir = now_dir + '_db'
        if os.path.exists(now_dir + '/db_bak'):
            pass
        else:
            sh.mkdir('-p', now_dir)
            db_bak = now_dir + '/db_bak'
            sh.mkdir('-p', db_bak)
        detail_set['full_dir'] = now_dir
        for i in os.listdir(now_dir):
            full_dir = now_dir + '/' + i
            if i == 'database.json' or i == 'db_bak':
                continue
            else:
                detail_set[all_dir].append(self.one_detail(full_dir))
        return detail_set

    @list_route(methods=['post'])
    def delete_file(self,request, *args, **kwargs):
        detail_set = {}
        file_name = request.DATA['delete_file']
        print file_name
        sh.rm('-r', file_name)
	request.DATA['dir'] = request.DATA['dir'].split('_db')[0]
        detail_set = self.common_list_dir(request)
        return Response(detail_set)

    @list_route(methods=['post'])
    def read_before(self,request, *args, **kwargs):
        detail_set = {}
        file_name = request.DATA['dir']
        with open(file_name ,'r') as f:
            if request.DATA['num'] == 'all':
                detail_set['text'] = ''.join(f.readlines())
            else:
                num = int(request.DATA['num'])
                detail_set['text'] = ''.join(f.readlines()[0:num])
        return Response(detail_set)

    @list_route(methods=['post'])
    def read_after(self,request, *args, **kwargs):
        detail_set = {}
        file_name = request.DATA['dir']
        num = - int(request.DATA['num'])
        with open(file_name ,'r') as f:
            detail_set['text'] = ''.join(f.readlines()[num:-1])
        return Response(detail_set)

    @list_route(methods=['post'])
    def db_find_drop(self,request, *args, **kwargs):
        detail_set = {}
        file_name = request.DATA['now_name']
        detail_set['text'] = ''
        with open(file_name, 'r') as f:
            for i in f.readlines():
                if re.search('drop', i, re.IGNORECASE):
                    detail_set['text'] += i
        return Response(detail_set)

    @list_route(methods=['post'])
    def execute_sql(self,request, *args, **kwargs):
        detail_set = {}
        detail_set['text'] = ''
        now_dir = request.DATA['now_dir']
        now_dir = now_dir + '_db'
        try:
            a = open(now_dir + '/' + 'database.json','r')
        except:
            detail_set['text'] = '无数据库配置文件'
        try:
            with open(now_dir + '/' + 'database.json','r') as f:
                para = json.loads(f.read())
            db_host = para['host']
            db_user = para['user']
            db_name = para['db_name']
            db_pw = para['password']
            output = subprocess.Popen('mysql -h{0} -u{1} {2} -p{3} < {4}'.format(
                            db_host, db_user,
                            db_name, db_pw,
                            request.DATA['dir']), shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            out, err = output.communicate()
            if err:
                detail_set['text'] = '执行可能遇到问题: ' + err
            else:
                detail_set['text'] = '执行成功: ' + out
        except:
            detail_set['text'] = '执行失败'
        detail_set['dir'] = request.DATA['dir']
        return Response(detail_set)

    @list_route(methods=['post'])
    def backup_db(self,request, *args, **kwargs):
        detail_set = {}
        detail_set['text'] = ''
        now_dir = request.DATA['now_dir']
        db_start = now_dir.split('/').pop()
        before_bak = subprocess.Popen('ls -lrt --block-size=k {0} | grep -v "^$" | tail -1'.format(now_dir + '/db_bak/')
                                    , shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        before_out, before_err = before_bak.communicate()
        if before_err:
            before_out = '读取错误'
        try:
            before_out_size = before_out.split()[4]
            before_out_file = before_out.split()[8]
        except:
            before_out_size = before_out.split()[1]
            before_out_file = '无文件'
        try:
            a = open(now_dir + '/' + 'database.json','r')
        except:
            detail_set['text'] = '无数据库配置文件'
        try:
            with open(now_dir + '/' + 'database.json','r') as f:
                para = json.loads(f.read())
                print para
            db_host = para['host']
            db_user = para['user']
            db_name = para['db_name']
            db_pw = para['password']
            output = subprocess.Popen('mysqldump -h{0} -u{1} {2} -p{3} > {4}'.format(
                            db_host, db_user,
                            db_name, db_pw,
                            now_dir + '/db_bak/' + db_start + '_' + time.strftime("%Y_%m_%d_%H_%M_%S", time.localtime()) + '.sql' ), shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            out, err = output.communicate()
            print out
            if err:
                detail_set['text'] = '备份可能遇到问题: ' + err
            else:
                detail_set['text'] = '备份执行成功: ' + out
        except:
            detail_set['text'] = '执行失败'
        after_bak = subprocess.Popen('ls -lrt --block-size=k {0} | grep -v "^$" | tail -1'.format(now_dir + '/db_bak/')
                            , shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        after_out, after_err = after_bak.communicate()
        if after_err:
            after_out = '读取错误'
        try:
            after_out_size = after_out.split()[4]
            after_out_file = after_out.split()[8]
        except:
            after_out_size = after_out.split()[1]
        diff_size = int(after_out_size.replace('K', '')) - int(before_out_size.replace('K', ''))
        detail_set['before_out_size'] = before_out_size
        detail_set['after_out_size'] = after_out_size
        detail_set['diff_size'] = diff_size
        detail_set['after_out_file'] = after_out_file
        detail_set['before_out_file'] = before_out_file
        return Response(detail_set)

class BackupViewSet(viewsets.ModelViewSet):

    serializer_class = BackupSerializer
    queryset = Backup.objects.all()
    parser_classes = (FileUploadParser, FormParser,)

    @list_route(methods=['get', 'post'])
    def sql_upload(self, request, pk=None):
        vars_file = request.DATA['datadir']
        vars_dir = vars_file.split('.')[0] + '_db'
        if not os.path.exists(vars_dir):
            os.makedirs(vars_dir)
        print vars_dir
        filename = request.FILES['file']
        filenames = str(filename)
        destination = open(vars_dir + '/' + filenames, 'wb+')
        for chunk in filename.chunks():
            destination.write(chunk)
        destination.close()
        return Response({'result': 'upload ok'})


class Log_SaveViewSet(viewsets.ModelViewSet):

    serializer_class = Log_SaveSerializer
    queryset = Log_Save.objects.all()

