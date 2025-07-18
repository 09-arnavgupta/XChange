# Generated by Django 5.2.3 on 2025-07-06 07:48

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Listing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('expected_item', models.CharField(max_length=255)),
                ('cash_value', models.DecimalField(decimal_places=2, max_digits=10)),
                ('tags', models.TextField(blank=True)),
                ('location', models.CharField(blank=True, max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
