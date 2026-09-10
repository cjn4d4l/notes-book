from django.db import models

# Create your models here.
class User(models.Model):
	username = models.CharField(max_length=255)
	password = models.CharField(max_length=255)
	isActive = models.BooleanField(default=False)

	def __str__(self):
		return f"{self.username} {self.password}"

class Notes(models.Model):
	title = models.CharField(max_length=255)
	content = models.TextField()
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	date = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f"{self.title} - {self.content} - {self.user} - {self.date}"
