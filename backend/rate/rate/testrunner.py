from django_nose import NoseTestSuiteRunner


class NoDbTestRunner(NoseTestSuiteRunner):

    def setup_databases(self, *args, **kwargs):
        return None

    def teardown_databases(self, *args, **kwargs):
        return None

    def _get_models_for_connection(self,  *args, **kwargs):
        return None


