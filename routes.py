import webapp2

from main import *
from sessions import *

config = {
    'webapp2_extras.auth': {
        'user_model': 'models.User',
        'user_attributes': ['email_address']
    },
    'webapp2_extras.sessions': {
        'secret_key': 'YOUR_SECRET_KEY'
    }
}

app = webapp2.WSGIApplication([
    webapp2.Route('/', MainPage, name='main'),
    webapp2.Route('/signup', SignupHandler),
    webapp2.Route('/<type:v|p>/<user_id:\d+>-<signup_token:.+>', handler=VerificationHandler, name='verification'),
    webapp2.Route('/password', SetPasswordHandler),
    webapp2.Route('/login', LoginHandler, name='login'),
    webapp2.Route('/logout', LogoutHandler, name='logout'),
    webapp2.Route('/forgot', ForgotPasswordHandler, name='forgot'),
    webapp2.Route('/authenticated', AuthenticatedHandler, name='authenticated'),
    webapp2.Route('/dashboard', DashboardPage, name="dashboard"),
    webapp2.Route('/categorias', CategoriasPage, name="categorias"),
    webapp2.Route('/interfaz', InterfazPage, name="interfaz"),
    webapp2.Route('/productos', ProductosPage, name="productos"),
    webapp2.Route('/archivos', ArchivosPage, name="archivos"),
    webapp2.Route('/main_upload', MainUploadImage, name='main_upload'),
    webapp2.Route('/upload', UploadHandler, name='upload'),
    webapp2.Route('/serve/<resource:(.*)>', ServeHandler, name='serve'),
    webapp2.Route('/admin', AdminPage, name='admin'),
    webapp2.Route('/users', UsersPage, name='users')

], debug=True, config=config)