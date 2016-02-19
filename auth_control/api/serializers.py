from rest_framework import serializers
from .models import *

class MemberSerializer(serializers.ModelSerializer):

    class Meta:
        model = Member
        fields = ('id', 'user', 'group_id', 'permit_pro')


class FamilySerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(source='*',read_only=True)

    class Meta:
        model = Family
        fields = ('id', 'group', 'group_name', 'permit_pro')
