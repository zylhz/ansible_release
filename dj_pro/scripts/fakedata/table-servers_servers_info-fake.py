from faker import Factory
from random import randint
import psycopg2

fake = Factory.create()

def form_data():
    eth0 = fake.ipv4()
    eth1 = fake.ipv4()
    name = fake.domain_name()
    cpu_info = "{'cpu-0': {'idle': %s, 'usertime': %s, 'systime': %s},\
            'cpu_num': %s}"\
            %(str(randint(0,100)), str(randint(0,100)),
                 str(randint(0,100)), str(randint(0,8)))

    memory_info = "{'mem': {'used_percent': %s, 'total': %s, 'free': %s, 'used': %s},\
            'swap': {'used_percent': %s, 'total': %s, 'free': %s, 'used': %s}}"\
        %(str(randint(0,100)), str(randint(0,100)),\
                str(randint(0,100)), str(randint(0,100)),\
                    str(randint(0,100)), str(randint(0,100)),\
                        str(randint(0,100)), str(randint(0,100)))

    disk_info = "{'mountpoint0': {'mountpoint': '/', 'total': %s,'percent': %s, 'free': %s, 'used': %s},\
            'mountpoint1': {'mountpoint': '/boot', 'total': %s, 'percent': %s, 'free': %s, 'used': %s}}"\
        %(str(randint(1000,10000)), str(randint(1000,10000)),
                str(randint(1000,10000)), str(randint(1000,10000)),
                    str(randint(1000,10000)), str(randint(1000,10000)),
                        str(randint(1000,10000)), str(randint(1000,10000)))

    netio_info = "{'packets_sent': %s, 'bytes_sent': %s,\
            'packets_recv': %s, 'bytes_recv': %s}"\
            %(str(randint(1000,10000)), str(randint(1000,10000)),
                    str(randint(1000,10000)), str(randint(1000,10000)))

    use_time_info = "{'start_time': %s, 'count_user': %s}"\
        %("'"+str(fake.date_time())+"'", str(randint(5,10)))

    sys_process_info = "{'postgres': '[1821, 2168, 2169, 2170, 2171, 4766]',\
            'vsftpd': '[2102]', 'postfix': '[]',\
            'cron': '[1757]', 'nginx': '[1809, 1811, 1812, 1813, 1814]'}"

    update_time = str(fake.iso8601())
    return (eth0, eth1, name, cpu_info,
            memory_info, disk_info,
            netio_info, use_time_info,
            sys_process_info, update_time)

connpara = "dbname=dj_pro user=postgres host=db"
conn = psycopg2.connect(connpara)
curs = conn.cursor()
for i in range(0,50):
    try:
        (eth0, eth1, name, cpu_info,
        memory_info, disk_info,
        netio_info, use_time_info,
        sys_process_info, update_time) = form_data()
        curs.execute("""
            insert into servers_servers_info values(
            %(eth0)s, %(eth1)s, %(name)s, %(cpu_info)s,
            %(memory_info)s, %(disk_info)s, %(netio_info)s, %(use_time_info)s,
            %(sys_process_info)s, %(update_time)s)
            """,
            {'eth0': eth0,'eth1': eth1,
            'name': name, 'cpu_info': cpu_info,
            'memory_info': memory_info, 'disk_info': disk_info,
            'netio_info': netio_info, 'use_time_info': use_time_info,
            'sys_process_info': sys_process_info, 'update_time': update_time
            })
        print eth1 + 'has been inserted'
    except:
        print eth1 + 'cant be inserted'

conn.commit()
curs.close()
conn.close()

