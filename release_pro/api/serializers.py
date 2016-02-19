from rest_framework import serializers
from .models import *

class Project_ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project_Item
        fields = ('id', 'pro_group', 'pro_name', 'pro_ansi_codedir', 'pro_ansi_yml', 'pro_ansi_release_yml', 'pro_ansi_backup_yml', 'pro_created_time')


class Project_GroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project_Group
        fields = ('id', 'pro_group_name', 'pro_ansi_process_directory_reset_yml', 'pro_group_created_time')


class Project_VarSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project_Var
        fields = ('id', 'pro_name', 'pro_version')


class Process_ResetSerializer(serializers.ModelSerializer):

    class Meta:
        model = Process_Reset
        fields = ('id', 'pro_name', 'process_name', 'process_script')


class BackupSerializer(serializers.ModelSerializer):

    class Meta:
        model = Backup
        fields = ('id', 'pro_para', 'back_name', 'back_dir', 'back_time')


class Log_SaveSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='*',read_only=True)

    class Meta:
        model = Log_Save
        fields = ('id', 'pro_group', 'user', 'username', 'log_complex', 'log_type', 'log_time')
