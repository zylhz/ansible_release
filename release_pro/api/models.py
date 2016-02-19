#-*- conding = utf-8 -*-
from django.db import models
from django.contrib.auth.models import User

class Project_Group(models.Model):
    pro_group_name = models.CharField(max_length=30)
    pro_ansi_process_directory_reset_yml = models.CharField(max_length=100, blank=True)
    pro_group_created_time = models.DateField(auto_now_add=True)

    def __unicode__(self):
        return '%s' %(self.pro_group_name)


class Project_Item(models.Model):
    pro_group = models.ForeignKey(Project_Group, related_name='project_item')
    pro_name = models.CharField(max_length=100)
    pro_ansi_codedir = models.CharField(max_length=100)
    pro_ansi_yml = models.CharField(max_length=100)
    pro_ansi_release_yml = models.CharField(max_length=100)
    pro_ansi_backup_yml = models.CharField(max_length=100,blank=True)
    pro_created_time = models.DateField(auto_now_add=True)

    def __unicode__(self):
        return '%s' %(self.pro_name)


class Project_Var(models.Model):
    pro_name = models.ForeignKey(Project_Item, related_name='project_var')
    pro_version = models.CharField(max_length=30)

    def __unicode__(self):
        return '%s' %(self.pro_version)


class Process_Reset(models.Model):
    pro_name = models.ForeignKey(Project_Item, related_name='process_reset')
    process_name = models.CharField(max_length=30)
    process_script = models.CharField(max_length=100)

    def __unicode__(self):
        return '%s' %(self.process_name)


class Backup(models.Model):
    pro_para = models.ForeignKey(Project_Var, related_name='backup')
    back_name = models.CharField(max_length=40)
    back_dir = models.CharField(max_length=40)
    back_time = models.DateField(auto_now_add=True)

    def __unicode__(self):
        return '%s' %(back_name)

class Log_Save(models.Model):
    pro_group = models.ForeignKey(Project_Group, related_name='log_save')
    username = models.CharField(max_length=20, blank=True)
    log_complex = models.CharField(max_length=3000, blank=True)
    log_type = models.CharField(max_length=300, blank=True)
    log_time = models.DateField(auto_now_add=True)

    def __unicode__(self):
        return '%s'%(self.username)
