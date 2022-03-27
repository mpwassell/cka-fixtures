##
## There are Django packages for doing this.
##

import django.db.utils
import csv

class CKAImport:

	@classmethod
	def import_data(self,data):

		print ("Importing data from file ", data)
		if self.objects.count() > 0:
			print ("Data already present")
			return

		with data as csvfile:
			reader = csv.reader(csvfile, delimiter=';', quotechar='"')
			for row in reader:
				data = self.from_csv(row)

				try:
					self.objects.create(**data)
					print ("Inserted")
				except django.db.utils.IntegrityError as e:
					print ("Not inserted")
					print (e)
