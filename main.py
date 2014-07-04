#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import os

import webapp2
import urllib
import jinja2
import json

from google.appengine.ext import webapp
from sessions import BaseHandler
from sessions import user_required
from models import *

from google.appengine.ext import blobstore
from google.appengine.ext.webapp import blobstore_handlers
upload_url = blobstore.create_upload_url('/upload')

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__) + '/templates'),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)


class MainPage(BaseHandler):
    def get(self):
        template_values = {}
        template = JINJA_ENVIRONMENT.get_template('landing.html')
        self.response.write(template.render(template_values))


class DashboardPage(BaseHandler):
    @user_required
    def get(self):
        tempplate_values = {"url":upload_url, "username":self.user.name}
        template = JINJA_ENVIRONMENT.get_template('dashboard.html')
        self.response.write(template.render(tempplate_values))


class InterfazPage(BaseHandler):
    @user_required
    def get(self):
        if self.user.has_role('admin'):
            self.redirect_to(self.url_for('dashboard'))
        template_values = {"username":self.user.name}
        template = JINJA_ENVIRONMENT.get_template('interfaz.html')
        self.response.write(template.render(template_values))


class CategoriasPage(BaseHandler):
    def get(self):
        cat_json = []
        for c in Categoria.query():
            my_json = {"name": c.name}
            cat_json.append(my_json)

        obj = {"categorias": cat_json}
        self.response.out.write(json.dumps(obj))

    def post(self):
        jdata = json.loads(self.request.body)
        if jdata:
            categoria = Categoria(name=jdata['name'])
            categoria.put()
            self.response.out.write(json.dumps({"state": "OK"}))
        else:
            self.response.out.write(json.dumps({"state": "OK"}))


class ProductosPage(BaseHandler):
    def get(self):
        prod_json = []
        for p in Producto.query():
            my_json = {"name": p.name, "categoria": p.categoria.id()}
            prod_json.append(my_json)

        obj = {"productos": prod_json}
        self.response.out.write(json.dumps(obj))

    def post(self):
        jdata = json.loads(self.request.body)
        if jdata:
            #categoria = Categoria.query().filter(Categoria.name == jdata['categoria']['name']).get()
            if jdata['categoria']['name']:
                producto = Producto(name=jdata['name'], categoria=ndb.Key(Categoria, jdata['categoria']['name']))
                producto.put()
                self.response.out.write(json.dumps({"state": "OK"}))
            else:
                print("NO HAY")
                self.response.out.write(json.dumps({"state": "ERROR", "message": "No hay categoria"}))
        else:
            self.response.out.write(json.dumps({"state": "ERROR", "message": "No params"}))


class ArchivosPage(blobstore_handlers.BlobstoreUploadHandler):
    def get(self):
        arch_json = []
        for a in Archivo.query():
            if a.categoria and a.producto:
                my_json = {"name": a.name, "file": a.file, "categoria": a.categoria.id(), "producto": a.producto.id()}
            else:
                my_json = {"name": a.name, "file": a.file}
            arch_json.append(my_json)

        obj = {"Archivos": arch_json}
        self.response.out.write(json.dumps(obj))

    def post(self):
        print(self.request.body)
        archivo = Archivo()
        my_file = self.request.get('0').read()
        archivo.file = ndb.BlobKey(my_file)
        #jdata = json.loads(self.request.body)
        # print(jdata['file'])
        # upload_files = self.get_uploads('file')
        # print(len(upload_files))
        #
        #if jdata:
        #    archivo = Archivo()
        #    my_file = jdata['file']
        #    archivo.file = ndb.BlobKey(my_file)
        #    archivo.put()
        #     cat_key = ndb.Key(Categoria, jdata['categoria']['name'])
        #     prod_key = ndb.Key(Producto, jdata['producto']['name'])
        #     archivo = Archivo(name=jdata['name'], categoria=cat_key, producto=prod_key, type=jdata['type'],
        #                       size=jdata['size'])
        #     #archivo.put()
        #    self.response.out.write(json.dumps({"state": "OK"}))
        #else:
        #    self.response.out.write(json.dumps({"state": "ERROR"}))


class MainUploadImage(webapp2.RequestHandler):
    def get(self):
        upload_url = blobstore.create_upload_url('/upload')
        self.response.out.write('<html><body>')
        self.response.out.write('<form action="%s" method="POST" enctype="multipart/form-data">' % upload_url)
        self.response.out.write("""Upload File: <input type="file" name="file"><br> <input type="submit"
            name="submit" value="Submit"> </form></body></html>""")


class UploadHandler(blobstore_handlers.BlobstoreUploadHandler):
    def post(self):
        categoria_str = self.request.get('categoria')
        producto_str = self.request.get('producto')

        upload_files = self.get_uploads('file')  # 'file' is file upload field in the form
        blob_info = upload_files[0]
        data = blobstore.BlobInfo.get(blob_info.key())

        cat_key = ndb.Key(Categoria, categoria_str)
        prod_key = ndb.Key(Producto, producto_str)

        archivo = Archivo()
        archivo.file = str(blob_info.key())
        archivo.name = data.filename
        archivo.size = data.size
        archivo.type = data.content_type
        archivo.categoria = cat_key
        archivo.producto = prod_key
        archivo.put()
        self.redirect('/serve/%s' % blob_info.key())


class ServeHandler(blobstore_handlers.BlobstoreDownloadHandler):
    def get(self, resource):
        resource = str(urllib.unquote(resource))
        blob_info = blobstore.BlobInfo.get(resource)
        self.send_blob(blob_info)