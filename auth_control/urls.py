from django.conf.urls import patterns, url, include

from rest_framework import routers
from api.api_setviews import *
from views import *

router = routers.SimpleRouter()
router.register(r'member_api', MemberViewSet)
router.register(r'family_api', FamilyViewSet)


urlpatterns = [
        url(r'', include(router.urls)),
]

urlpatterns += [

]
