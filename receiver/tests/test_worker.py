from worker import process_batch


def test_process_batch_inserts_all_events(mocker):
    mock_cursor = mocker.MagicMock()
    batch = [
        {"url": "https://a.com", "referrer": "direct"},
        {"url": "https://b.com", "referrer": "google"},
    ]

    process_batch(batch, mock_cursor)

    mock_cursor.executemany.assert_called_once()
