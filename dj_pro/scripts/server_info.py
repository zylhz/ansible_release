import psutil
import datetime
import sys
import requests
import json
import socket
import fcntl
import struct
# because of not having Domain Name Resolution and using virtual Domain,
# do not forget to add domain and ip to /etc/hosts


class Serverinfo(object):

    def __init__(self):
        self.base_url = 'http://gj.com/servers/'
        self.post_api = self.base_url + 'base_info'
        self._cpu = dict()
        self._memory = dict()
        self._disk = dict()
        self._netio = dict()
        self._use_time = dict()
        self._sys_process_set = dict()
        self._sys_process = dict()
        self.cpu_info = self._cpu_info()
        self.memory_info = self._memory_info()
        self.disk_info = self._disk_info()
        self.netio_info = self._netio_info()
        self.use_time_info = self._use_time_info()
        services = ['nginx', 'uwsgi', 'cron', 'postfix',
                    'vsftpd', 'postgres', 'salt-minion', 'salt-master']
        self.sys_process_info = self._sys_process_info(services)
        self.sys_process_detail = self._sys_process_detail(services)

    def get_ip_address(self, ifname):
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        return socket.inet_ntoa(fcntl.ioctl(
                                s.fileno(), 0x8915,
                                struct.pack('256s', ifname[:15])
                                )[20:24])

    def __getattr__(self, method):
        return 'no this attribute!'

    def send_data(self):
        try:
            eth0 = self.get_ip_address('eth0')
        except:
            eth0 = None
        try:
            eth1 = self.get_ip_address('eth1')
        except:
            eth1 = 'not exist'
        hostname = socket.gethostname()
        base_info = {
            'eth0': str(eth0),
            'eth1': str(eth1),
            'hostname': str(hostname),
            'cpu_info': str(self.cpu_info),
            'memory_info': str(self.memory_info),
            'disk_info': str(self.disk_info),
            'netio_info': str(self.netio_info),
            'use_time_info': str(self.use_time_info),
            'sys_process_info': str(self.sys_process_info)
            }
        seturl = [self.post_api, base_info]
        data = json.dumps(seturl[1])
        headers = {'content-type': 'application/json'}
        try:
            updateurl = seturl[0] + '/' + eth1
            r = requests.put(updateurl, data=data, headers=headers)
            if r.status_code not in range(200, 208):
                raise
            print json.dumps(
                seturl[1]) + "has been updated to " + updateurl
        except:
            r = requests.post(seturl[0], data=data, headers=headers)
            try:
                if r.status_code not in range(200, 208):
                    raise
                else:
                    print json.dumps(
                        seturl[1]) + " has been posted to " + seturl[0]
            except:
                print json.dumps(
                    seturl[1]) + " was not posted to " + seturl[0]

    def _cpu_info(self):
        num = 0
        for k, i in enumerate(psutil.cpu_times(percpu=True)):
            k = str(k)
            self._cpu['cpu-' + k] = dict()
            self._cpu['cpu-' + k]['usertime'] = str(i.user)
            self._cpu['cpu-' + k]['systime'] = str(i.system)
            self._cpu['cpu-' + k]['idle'] = str(i.idle)
            num = num + 1
        self._cpu['cpu_num'] = num
        return self._cpu

    def _memory_info(self):
        memory_get = psutil.virtual_memory()
        swap_get = psutil.swap_memory()
        self._memory['mem'] = dict()
        self._memory['swap'] = dict()
        self._memory['mem']['total'] = str(memory_get.total/1024/1024)
        self._memory['mem']['used'] = str(memory_get.used/1024/1024)
        self._memory['mem']['free'] = str(memory_get.free/1024/1024)
        self._memory['mem']['used_percent'] = str(memory_get.percent)
        self._memory['swap']['total'] = str(swap_get.total/1024/1024)
        self._memory['swap']['used'] = str(swap_get.used/1024/1024)
        self._memory['swap']['free'] = str(swap_get.free/1024/1024)
        self._memory['swap']['used_percent'] = str(swap_get.percent)
        return self._memory

    def _disk_info(self):
        disk_get = [(i.mountpoint, psutil.disk_usage(i.mountpoint))
                    for i in psutil.disk_partitions()]
        for n, (i, j) in enumerate(disk_get):
            n = str(n)
            mount = 'mountpoint' + n
            self._disk[mount] = dict()
            self._disk[mount]['mountpoint'] = str(i)
            self._disk[mount]['total'] = str(j.total/1024/1024)
            self._disk[mount]['used'] = str(j.used/1024/1024)
            self._disk[mount]['free'] = str(j.free/1024/1024)
            self._disk[mount]['percent'] = str(j.percent)
        return self._disk

    def _netio_info(self):
        netio_get = psutil.net_io_counters()
        self._netio['bytes_sent'] = str(netio_get.bytes_sent)
        self._netio['bytes_recv'] = str(netio_get.bytes_recv)
        self._netio['packets_sent'] = str(netio_get.packets_sent)
        self._netio['packets_recv'] = str(netio_get.packets_recv)
        return self._netio

    def _use_time_info(self):
        self._use_time['count_user'] = str(len(psutil.users()))
        self._use_time['start_time'] = str(
            datetime.datetime.fromtimestamp(
                psutil.boot_time()).strftime(
                    "%Y-%m-%d %H:%M:%S"))
        return self._use_time

    def _sys_process_info(self, services):
        res = psutil.get_process_list()
        for x in services:
            container = []
            for i in res:
                if i.name() == x:
                    container.append(i.pid)
            self._sys_process_set[x] = str(container)
        return self._sys_process_set

    def _sys_process_detail(self, services):
        sys_process_get = psutil.pids()
        for n in sys_process_get:
            try:
                proc = psutil.Process(n)
            except:
                pass
            process_nu = str(n)
            self._sys_process[process_nu] = dict()
            if proc.name() not in services:
                pass
                del self._sys_process[process_nu]
            else:
                self._sys_process[process_nu]['exe_dir'] = proc.exe()
                self._sys_process[process_nu]['name'] = proc.name()
                self._sys_process[process_nu]['dir'] = proc.cwd()
                self._sys_process[process_nu]['status'] = proc.status()
                self._sys_process[process_nu]['create_time'] = datetime.\
                    datetime.fromtimestamp(
                        proc.create_time()).strftime(
                            "%Y-%m-%d %H:%M:%S")
                self._sys_process[process_nu]['memory_percent'] = proc.\
                    memory_percent()
        return self._sys_process

if __name__ == '__main__':
    svr = Serverinfo()
    svr.send_data()
    # print svr.cpu_info
    # print svr.memory_info
    # print svr.disk_info
    # print svr.netio_info
    # print svr.use_time_info
    # print svr.sys_process_info
