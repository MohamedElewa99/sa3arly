from sa3arly.common import Fetcher


class Dummy(Fetcher):
    def __init__(self):                      # no browser needed for pacing logic
        self.min_gap, self.max_gap = 2.0, 5.0
        self._base_gap = (2.0, 5.0)
        self.slow_streak = 0


def test_backoff_and_recovery():
    f = Dummy()
    for _ in range(3):
        f._pace(40)
    assert f.overloaded and (f.min_gap, f.max_gap) == (16.0, 40.0)
    f._pace(5)
    assert not f.overloaded and (f.min_gap, f.max_gap) == (8.0, 20.0)
    for _ in range(4):
        f._pace(5)
    assert (f.min_gap, f.max_gap) == (2.0, 5.0)
