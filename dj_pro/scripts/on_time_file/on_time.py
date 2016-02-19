#!/usr/bin/python
# -*- coding: UTF-8 -*-
import psycopg2
import linecache
import time
import logging
import logging.config


class Common_mark_job(object):

    logging.config.fileConfig("logging.conf")
    logger = logging.getLogger("NonDevMod")    # have DevMod(generate debug,info), NonDevMod(generate info) and
                                               # root(generate error)

    def __init__(self, filename, first_mark_line=1):
        self.filename = filename
        self.first_mark_line = first_mark_line

    def check_line_exist(self, line_no):
        if linecache.getline(self.filename, line_no) == '':
            linecache.clearcache()
            return False
        else:
            linecache.clearcache()
            return True

    def first_mark(self):
        for i in [100, 10, 1]:
            check_line = self.first_mark_line + i
            if self.check_line_exist(check_line) == True:
                next_end_mark = check_line
                break
        return next_end_mark

    def end_mark_line(self, n, get_mark):
        test_line = get_mark + 1
        while True:
            if self.check_line_exist(test_line) == False:
                time.sleep(2)
                linecache.updatecache(self.filename)
                self.logger.info('wait file to change')
            else:
                break
        for i in reversed(range(1,n)):
            tmp_line = get_mark + i
            self.logger.debug(
                    'tmp_line:' + str(tmp_line))
            self.logger.debug(
                    self.check_line_exist(tmp_line))
            if self.check_line_exist(tmp_line) == True:
                break
        return tmp_line

    def file_action(self, start_no, end_no):
        pass

    def first_deal(self):
        next_mark = self.first_mark()
        get_mark = self.first_mark_line
        self.file_action(get_mark, next_mark)
        return next_mark

    def roop_deal(self, get_mark, n=10):
        next_mark = self.end_mark_line(n, get_mark)
        self.file_action(get_mark, next_mark)
        return next_mark

    def main(self):
        get_mark = self.first_deal()
        self.logger.debug('get_first_mark: '+ str(get_mark))
        while True:
            get_mark = self.roop_deal(get_mark)


class Insert_test_job(Common_mark_job):

    def file_action(self, start_no, end_no):
        self.logger.info(
                'start_no: %i,end_no: %i' %(start_no, end_no))
        self.database(start_no, end_no)

    def database(self, start_no, end_no):
        connpara = "dbname=test user=postgres host=db"
        conn = psycopg2.connect(connpara)
        curs = conn.cursor()
        for i in range(start_no, end_no):
            linecache.clearcache()
            try:
                a, b = linecache.getline(
                        self.filename, i).strip().split()
                curs.execute("insert into test values(%s, %s)",(a, b))
            except:
                self.logger.error("can't insert line %s in %s"% (
                                i, self.filename))
                pass
        conn.commit()
        curs.close()
        conn.close()


Insert_test_job('writefile.txt').main()
