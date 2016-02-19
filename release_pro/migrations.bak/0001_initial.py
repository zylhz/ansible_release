# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Backup',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('back_name', models.CharField(max_length=40)),
                ('back_dir', models.CharField(max_length=40)),
                ('back_time', models.DateField(auto_now_add=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Log_Save',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('username', models.CharField(max_length=20, blank=True)),
                ('log_complex', models.CharField(max_length=3000, blank=True)),
                ('log_type', models.CharField(max_length=300, blank=True)),
                ('log_time', models.DateField(auto_now_add=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Process_Reset',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('process_name', models.CharField(max_length=30)),
                ('process_script', models.CharField(max_length=100)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Project_Group',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('pro_group_name', models.CharField(max_length=30)),
                ('pro_ansi_process_directory_reset_yml', models.CharField(max_length=100, blank=True)),
                ('pro_group_created_time', models.DateField(auto_now_add=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Project_Item',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('pro_name', models.CharField(max_length=100)),
                ('pro_ansi_codedir', models.CharField(max_length=100)),
                ('pro_ansi_yml', models.CharField(max_length=100)),
                ('pro_ansi_release_yml', models.CharField(max_length=100)),
                ('pro_ansi_backup_yml', models.CharField(max_length=100, blank=True)),
                ('pro_created_time', models.DateField(auto_now_add=True)),
                ('pro_group', models.ForeignKey(related_name=b'project_item', to='release_pro.Project_Group')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Project_Var',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('pro_version', models.CharField(max_length=30)),
                ('pro_name', models.ForeignKey(related_name=b'project_var', to='release_pro.Project_Item')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='process_reset',
            name='pro_name',
            field=models.ForeignKey(related_name=b'process_reset', to='release_pro.Project_Item'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='log_save',
            name='pro_group',
            field=models.ForeignKey(related_name=b'log_save', to='release_pro.Project_Group'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='backup',
            name='pro_para',
            field=models.ForeignKey(related_name=b'backup', to='release_pro.Project_Var'),
            preserve_default=True,
        ),
    ]
