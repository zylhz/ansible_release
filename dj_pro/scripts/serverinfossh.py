def _check_alive(self):
    keepa = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    keepa.settimeout(self.timeout)
    try:
        keepa.connect(self.ipset)
        self.alive = True
        return [self.alive,'Server is ok!']
    except:
        self.alive = False
        return [self.alive,'Server was down!']
