import os

os.environ["DB_NAME"] = "pane_analytics_test"

import pytest
from fastapi.testclient import TestClient

from main import app


@pytest.fixture
def client():
    return TestClient(app)
