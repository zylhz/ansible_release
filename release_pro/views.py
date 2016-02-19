from django.shortcuts import render

from rest_framework.decorators import api_view


# Create your views here.
@api_view(['GET', 'POST'])
def release_mainpage(request):
    if request.method == 'GET':
        return render(request, 'release_mainpage.html')

@api_view(['GET', 'POST'])
def welcome_page(request):
    if request.method == 'GET':
        return render(request, 'welcome_page.html')

@api_view(['GET', 'POST'])
def pull_code(request):
    if request.method == 'GET':
        return render(request, 'pull_code.html')

@api_view(['GET', 'POST'])
def search_branch(request):
    if request.method == 'GET':
        return render(request, 'search_branch.html')

@api_view(['GET', 'POST'])
def release_code(request):
    if request.method == 'GET':
        return render(request, 'release_code.html')

@api_view(['GET', 'POST'])
def database_update(request):
    if request.method == 'GET':
        return render(request, 'database_update.html')

@api_view(['GET', 'POST'])
def process_reset(request):
    if request.method == 'GET':
        return render(request, 'process_reset.html')

@api_view(['GET', 'POST'])
def costume_operation(request):
    if request.method == 'GET':
        return render(request, 'costume_operation.html')

@api_view(['GET', 'POST'])
def log_view(request):
    if request.method == 'GET':
        return render(request, 'log_view.html')

@api_view(['GET', 'POST'])
def auth_pro(request):
    if request.method == 'GET':
        return render(request, 'auth_pro.html')

@api_view(['GET', 'POST'])
def init_env(request):
    if request.method == 'GET':
        return render(request, 'init_env.html')

@api_view(['GET', 'POST'])
def upyun(request):
    if request.method == 'GET':
        return render(request, 'upyun.html')
