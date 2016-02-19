#-*- conding = utf-8 -*-
from django.db import models
from django.contrib.auth.models import Group, User


class Family(models.Model):
    group = models.OneToOneField('auth.Group', unique=True)
    permit_pro = models.CharField(max_length=50, blank=True)

    def __unicode__(self):
        return '%s' %(self.group)

class Member(models.Model):
    user = models.CharField(max_length=50, unique=True)
    group_id = models.CharField(max_length=50, blank=True)
    permit_pro = models.CharField(max_length=50, blank=True)

    def __unicode__(self):
        return '%s' %(self.user)

