import os,sys,json
reload(sys)
sys.setdefaultencoding("utf-8")
class rest_json(object):
    def __init__(self, file ='',getjson='',jsonfile='',do_not_use_pp=[],jsonlist=[]):
        self._file = file
        self._getjson = getjson
        self._jsonfile = jsonfile
        self._do_not_use_pp = do_not_use_pp
        self.rest_get = self._rest_show()
        self._jsonlist = jsonlist

    def _rest_show(self):
        return self._getjson

    def _common_begin(self):
        jsonbook = self._jsonfile
        jsonlen = len(self._do_not_use_pp)-1
        return jsonbook,jsonlen

    def rest_save(self,value):
        jsonbook,jsonlen = self._common_begin()
        for i,j in enumerate(self._do_not_use_pp):
            if jsonlen == i:
                jsonbook[j] = value
            else:
                jsonbook = jsonbook[j]
        jsondump = json.dumps(self._jsonfile,encoding="utf-8",ensure_ascii=False,indent=6,sort_keys=True)
        with open(self._file,'w') as f1:
            f1.write(jsondump)
        modify_key = self._do_not_use_pp[-1]
        self._do_not_use_pp = []
        if isinstance(jsonbook[modify_key],int):
            return 'modify:{"%s" : %i}  ==>  {"%s" : %i}'%(modify_key,self._getjson,modify_key,jsonbook[modify_key])
        return 'modify:{"%s" : "%s"}  ==>  {"%s" : "%s"}'%(modify_key,self._getjson,modify_key,jsonbook[modify_key])

    def rest_del(self):
        jsonbook,jsonlen = self._common_begin()
        del_list=[(i,j) for i,j in zip(self._do_not_use_pp,self._jsonlist)]
        del_length = len(del_list[-2][1].keys())
        if del_length == 1:
            modify_val = ''
        else:
            del_list[-2][1].pop(del_list[-1][0])
            modify_val = del_list[-2][1]
        for i,j in enumerate(self._do_not_use_pp):
            if jsonlen == i+1:
                jsonbook[j] = modify_val
                break
            else:
                jsonbook = jsonbook[j]
        jsondump = json.dumps(self._jsonfile,encoding="utf-8",ensure_ascii=False,indent=6,sort_keys=True)
        with open(self._file,'w') as f1:
            f1.write(jsondump)
        del_key = self._do_not_use_pp[-1]
        if isinstance(del_list[-1][1],int):
            return 'delete: {"%s" : %i}'%(del_key,del_list[-1][1])
        return 'delete: {"%s" : "%s"}'%(del_key,del_list[-1][1])

    def rest_add(self,**kwargs):
        jsonbook,jsonlen = self._common_begin()
        add_list = [(i,j) for i,j in zip(self._do_not_use_pp,self._jsonlist)]
        add_key = [' '.join(i.split('__')) for i in kwargs.keys()]
        add_value = kwargs.values()
        migrate_add = zip(add_key,add_value)
        for i,j in enumerate(self._do_not_use_pp):
            if jsonlen == i:
                jsonbook = jsonbook[j]
                for a,b in migrate_add:
                    jsonbook[str(a)] = str(b)
            else:
                jsonbook = jsonbook[j]
        jsondump = json.dumps(self._jsonfile,encoding="utf-8",ensure_ascii=False,indent=6,sort_keys=True)
        with open(self._file,'w') as f1:
            f1.write(jsondump)
        modify_key = self._do_not_use_pp[-1]
        self._do_not_use_pp = []
        comment = []
        for a,b,c in [(i,j,isinstance(add_value,int)) for i,j in migrate_add]:
            if c:
                comment.append('add: {"%s" : %i}'%(a,b))
            else:
                comment.append('add: {"%s" : "%s"}'%(a,b))
        return '\n'.join(comment)

    def __getattr__(self, load):
        load = ' '.join(load.split('__'))
        try:
            if self._getjson == '':
                raise
        except:
            self._do_not_use_pp = []
            self._jsonlist = []
            self._jsonfile = self._jsonload(self._file)
            self._getjson = self._jsonfile[load]
            self._do_not_use_pp.append(load)
            self._jsonlist.append(self._getjson)
        else:
            self._getjson = self._getjson[load]
            self._do_not_use_pp.append(load)
            self._jsonlist.append(self._getjson)
        return rest_json(getjson = self._getjson,jsonfile = self._jsonfile,file=self._file,do_not_use_pp = self._do_not_use_pp,jsonlist = self._jsonlist)

    def _jsonload(self,file):
        with open(file,'r') as f:
            jsonfile = json.load(f,encoding="utf-8")
        return jsonfile


