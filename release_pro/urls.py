from django.conf.urls import patterns, url, include

from rest_framework import routers
from api.api_setviews import *
from views import *

router = routers.SimpleRouter()
router.register(r'project_item_api', Project_ItemViewSet)
router.register(r'project_group_api', Project_GroupViewSet)
router.register(r'project_var_api', Project_VarViewSet)
router.register(r'process_reset_api', Process_ResetViewSet)
router.register(r'backup_api', BackupViewSet)
router.register(r'log_save_api', Log_SaveViewSet)



urlpatterns = [
        url(r'', include(router.urls)),
]

# deploy page
urlpatterns += [

        ################ route ###################
        url(r'^welcome_page', welcome_page),
        url(r'^pull_code', pull_code),
        url(r'^search_branch', search_branch),
        url(r'^release_code', release_code),
        url(r'^database_update', database_update),
        url(r'^process_reset', process_reset),
        url(r'^costume_operation', costume_operation),
        url(r'^log_view', log_view),

        ############### authority ################
        url(r'^auth_pro', auth_pro),

        ############### initial environment ################
        url(r'^init_env', init_env),

        ############### initial environment ################
        url(r'^upyun', upyun),

        ################ route ###################
        url(r'^mainpage/\d*', release_mainpage),
        # url(r'^ip_add_place', ip_add_place),
        # url(r'^ip_info_main', ip_info_main),
]
