import re,ast
list1='''
var retModelList = [            {
                thumbnail_filename: "2731405437S.JPG",
                viewed_times: "53",
                category_name: "\xe6\x96\x87\xe5\x85\xb7",
                modelid: "201410063364029",
                member_id: "873",
                model_name: "double ten day pen rest",}]
'''

def formweb_json(lists):
    x = []
    pattern = r'.*'+':'+'.*'
    for i in re.findall(pattern,list1,re.S)[0].split('= ')[1].split('\n'):
        try:
            x.append("\'"+i.split(':')[0].strip()+"\'"+":"+i.split(':')[1])
        except:
            x.append(i)
    listname = re.search(r'var .* =',list1).group(0).split('=')[0].split('var ')[1].strip()
    key = [item for item in ast.literal_eval(''.join(x))][0]
    result = ast.literal_eval("{\'"+listname+"\'"+":"+str(key)+'}')
    return result

a = formweb_json(list1)
print a['retModelList']['category_name']
