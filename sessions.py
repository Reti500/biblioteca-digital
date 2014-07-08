import logging
import os.path
import webapp2
import json
import jinja2

from webapp2_extras import auth
from webapp2_extras import sessions
from google.appengine.api import mail

from webapp2_extras.auth import InvalidAuthIdError
from webapp2_extras.auth import InvalidPasswordError

from models import User

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__) + '/templates'),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)


def user_required(handler):
    """
      Decorator that checks if there's a user associated with the current session.
      Will also fail if there's no session present.
    """

    def check_login(self, *args, **kwargs):
        auth = self.auth
        if not auth.get_user_by_session():
            self.redirect(self.uri_for('main'), abort=True)
        else:
            return handler(self, *args, **kwargs)

    return check_login

def admin_required(handler):
    """
      Decorator that checks if there's a user associated with the current session.
      Will also fail if there's no session present.
    """

    def check_admin(self, *args, **kwargs):
        if self.user.has_role('admin') or self.user.email_address == "ricardo.gon.tell@gmail.com":
            return handler(self, *args, **kwargs)
        else:
            self.redirect(self.uri_for('interfaz'), abort=True)
    return check_admin

def send_mail(sender, subject, name, email, body, html):
    message = mail.EmailMessage(sender=sender, subject=subject)
    message.to = (":1 <:2>", name, email)
    message.body = body
    message.html = html
    message.send()

class BaseHandler(webapp2.RequestHandler):
    @webapp2.cached_property
    def auth(self):
        """Shortcut to access the auth instance as a property."""
        return auth.get_auth()

    @webapp2.cached_property
    def user_info(self):
        """Shortcut to access a subset of the user attributes that are stored
        in the session.

        The list of attributes to store in the session is specified in
          config['webapp2_extras.auth']['user_attributes'].
        :returns
          A dictionary with most user information
        """
        return self.auth.get_user_by_session()

    @webapp2.cached_property
    def user(self):
        """Shortcut to access the current logged in user.

        Unlike user_info, it fetches information from the persistence layer and
        returns an instance of the underlying model.

        :returns
          The instance of the user model associated to the logged in user.
        """
        u = self.user_info
        return self.user_model.get_by_id(u['user_id']) if u else None

    @webapp2.cached_property
    def user_model(self):
        """Returns the implementation of the user model.

        It is consistent with config['webapp2_extras.auth']['user_model'], if set.
        """
        return self.auth.store.user_model

    @webapp2.cached_property
    def session(self):
        """Shortcut to access the current session."""
        return self.session_store.get_session(backend="datastore")

    def render_template(self, view_filename, params=None):
        if not params:
            params = {}
        user = self.user_info
        params['user'] = user
        #path = os.path.join(os.path.dirname(__file__), 'templates', view_filename)
        template = JINJA_ENVIRONMENT.get_template(view_filename)
        self.response.out.write(template.render(params))

    def display_message(self, message):
        """Utility function to display a template with a simple message."""
        params = {
            'message': message
        }
        self.response.out.write(json.dumps(params))
        #self.render_template('message.html', params)

    # this is needed for webapp2 sessions to work
    def dispatch(self):
        # Get a session store for this request.
        self.session_store = sessions.get_store(request=self.request)

        try:
            # Dispatch the request.
            webapp2.RequestHandler.dispatch(self)
        finally:
            # Save all sessions.
            self.session_store.save_sessions(self.response)


class SignupHandler(BaseHandler):
    def get(self):
        usuarios = []
        us = User.query()
        for u in us:
            rol = 'admin' if u.has_role('admin') else 'user'
            new_json = {"username":u.auth_ids[0], "email": u.email_address, "rol": rol}
            usuarios.append(new_json)

        obj = {"usuarios": usuarios}
        self.response.out.write(json.dumps(obj))

    def post(self):
        jdata = json.loads(self.request.body)
        if jdata:
            user_name = jdata['username']
            email = jdata['email']
            name = jdata['name']
            password = jdata['password']

        unique_properties = ['email_address']
        user_data = self.user_model.create_user(user_name,
                                                unique_properties,
                                                email_address=email, name=name, password_raw=password,
                                                verified=False)
        if not user_data[0]:  # user_data is a tuple
            self.response.out.write(json.dumps({"state":"ERROR"}))
            return

        user = user_data[1]
        user.add_role("user")

        user_id = user.get_id()

        token = self.user_model.create_signup_token(user_id)

        verification_url = self.uri_for('verification', type='v', user_id=user_id,
                                        signup_token=token, _full=True)

        msg = 'Send an email to user in order to verify their address. \
          They will be able to do so by visiting <a href="{url}">{url}</a>'

        sender = "Ricardo <ricardo.gon.tell@gmail.com>"
        subject = "Your account has been approved"

        #message.to = (":1 <:2>", name, email)

        body = """
            Dear Albert:

            Your example.com account has been approved.  You can now visit
            http://www.example.com/ and sign in using your Google Account to
            access new features.

            Please let us know if you have any questions.
            The example.com Team
        """ + verification_url

        html = """
                <html><head></head><body>
                Dear Albert:

                Your example.com account has been approved.  You can now visit
                http://www.example.com/ and sign in using your Google Account to
                access new features.

                Please let us know if you have any questions.

                The example.com Team
                </body></html>
        """ + verification_url

        send_mail(sender, subject, name, email, body, html)
        self.response.out.write(json.dumps({"state":"OK", "url": verification_url}))

    @admin_required
    def put(self):
        jdata = json.loads(self.request.body)
        username = self.request.get('username') or jdata['username']
        action = self.request.get('action') or jdata['action']

        user = User.get_by_auth_id(username)

        if user:
            if action == 'admin' and not user.has_role('admin'):
                user.add_role('admin')
            elif action == 'user' and user.has_role('admin'):
                user.remove_role('admin')
            self.response.out.write(json.dumps({"state":"Admin"}))
        else:
            self.response.out.write(json.dumps({"state":"OK"}))
        print(user)


class ForgotPasswordHandler(BaseHandler):
    def get(self):
        self.render_template('forgot_password.html')

    def post(self):
        username = self.request.get('username')

        user = self.user_model.get_by_auth_id(username)
        if not user:
            logging.info('Could not find any user entry for username %s', username)
            self._serve_page(not_found=True)
            return

        user_id = user.get_id()
        token = self.user_model.create_signup_token(user_id)

        verification_url = self.uri_for('verification', type='p', user_id=user_id,
                                        signup_token=token, _full=True)

        msg = 'Send an email to user in order to reset their password. \
          They will be able to do so by visiting <a href="{url}">{url}</a>'

        self.display_message(msg.format(url=verification_url))

    def _serve_page(self, not_found=False):
        username = self.request.get('username')
        params = {
            'username': username,
            'not_found': not_found
        }
        self.render_template('forgot.html', params)


class VerificationHandler(BaseHandler):
    def get(self, *args, **kwargs):
        user = None
        user_id = kwargs['user_id']
        signup_token = kwargs['signup_token']
        verification_type = kwargs['type']

        # it should be something more concise like
        # self.auth.get_user_by_token(user_id, signup_token)
        # unfortunately the auth interface does not (yet) allow to manipulate
        # signup tokens concisely
        user, ts = self.user_model.get_by_auth_token(int(user_id), signup_token,
                                                     'signup')

        if not user:
            logging.info('Could not find any user with id "%s" signup token "%s"',
                         user_id, signup_token)
            self.abort(404)

        # store user data in the session
        self.auth.set_session(self.auth.store.user_to_dict(user), remember=True)

        if verification_type == 'v':
            # remove signup token, we don't want users to come back with an old link
            self.user_model.delete_signup_token(user.get_id(), signup_token)

            if not user.verified:
                user.verified = True
                user.put()

            self.display_message('User email address has been verified.')
            return
        elif verification_type == 'p':
            # supply user to the page
            params = {
                'user': user,
                'token': signup_token
            }
            self.render_template('resetpassword.html', params)
        else:
            logging.info('verification type not supported')
            self.abort(404)


class SetPasswordHandler(BaseHandler):
    @user_required
    def post(self):
        password = self.request.get('password')
        old_token = self.request.get('t')

        if not password or password != self.request.get('confirm_password'):
            self.display_message('passwords do not match')
            return

        user = self.user
        user.set_password(password)
        user.put()

        # remove signup token, we don't want users to come back with an old link
        self.user_model.delete_signup_token(user.get_id(), old_token)

        self.display_message('Password updated')


class LoginHandler(BaseHandler):
    def get(self):
        self.render_template("login.html")
        #self._serve_page()

    def post(self):
        jdata = json.loads(self.request.body)
        if jdata:
            username = jdata['username']
            password = jdata['password']

        try:
            us = self.user_model.get_by_auth_id(username)
            if us and us.verified:
                print("Verificado!!")
                u = self.auth.get_user_by_password(username, password, remember=True, save_session=True)
                self.response.out.write(json.dumps({"state": "OK"}))
            elif us:
                print("No esta verificado")
                user_id = us.get_id()
                token = self.user_model.create_signup_token(user_id)

                verification_url = self.uri_for('verification', type='v', user_id=user_id,
                                        signup_token=token, _full=True)
                self.response.out.write(json.dumps({"state": "VERIFIED", "url":verification_url}))


            #self.redirect(self.uri_for('home'))
        except (InvalidAuthIdError, InvalidPasswordError) as e:
            logging.info('Login failed for user %s because of %s', username, type(e))
            self.response.out.write(json.dumps({"state": "ERROR"}))
            #self._serve_page(True)

    def _serve_page(self, failed=False):
        username = self.request.get('username')
        params = {
            'username': username,
            'failed': failed
        }
        self.render_template('login.html', params)


class LogoutHandler(BaseHandler):
    def get(self):
        self.auth.unset_session()
        self.redirect(self.uri_for('main'))


class AuthenticatedHandler(BaseHandler):
    @user_required
    def get(self):
        self.render_template('authenticated.html')


config = {
    'webapp2_extras.auth': {
        'user_model': 'models.User',
        'user_attributes': ['email_address']
    },
    'webapp2_extras.sessions': {
        'secret_key': 'YOUR_SECRET_KEY'
    }
}

logging.getLogger().setLevel(logging.DEBUG)