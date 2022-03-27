import json

from django.contrib.auth.decorators import permission_required
from django.contrib.auth import authenticate, login,logout
from django.http import HttpResponse,HttpResponseRedirect
from django.template import RequestContext, loader
from django.contrib.contenttypes.models import ContentType

from cka.models import Player

import logging
logger = logging.getLogger("cka")

def table(request,table_name, field=None, value=None):
	logger.debug("table: query {0} {1} {2}".format(table_name,field,value))

	ctype = ContentType.objects.get(app_label="cka", model=table_name)
	model_class = ctype.model_class()

	if field and value:
		a_filter = { field : value}
		records = model_class.objects.filter(**a_filter)
	else:
		records = model_class.objects.all()

	data_records = []
	for p in records:
		data_records.append( {'name' : p.name} )

	response_data = { "data" : data_records }
  
	return HttpResponse(json.dumps(response_data), content_type="application/json")
	