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

import jinja2
import webapp2

from sessions import BaseHandler
from sessions import user_required

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__) + '/templates'),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)


class MainPage(BaseHandler):
    @user_required
    def get(self):
        template_values = {}
        template = JINJA_ENVIRONMENT.get_template('interfaz.html')
        self.response.write(template.render(template_values))


class DashboardPage(BaseHandler):
    def get(self):
        tempplate_values = {}
        template = JINJA_ENVIRONMENT.get_template('dashboard.html')
        self.response.write(template.render(tempplate_values))
