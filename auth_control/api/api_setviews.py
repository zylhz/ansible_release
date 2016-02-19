#!/usr/bin/env  python
# -*- coding: utf-8 -*-
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser,FileUploadParser

from rest_framework.decorators import detail_route, list_route

from .models import *
from .serializers import *


class MemberViewSet(viewsets.ModelViewSet):

    serializer_class = MemberSerializer
    queryset = Member.objects.all()


class FamilyViewSet(viewsets.ModelViewSet):

    serializer_class = FamilySerializer
    queryset = Family.objects.all()
