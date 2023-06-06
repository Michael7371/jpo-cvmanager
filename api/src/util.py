from dateutil.parser import parse
import pytz
import os


# expects datetime string
def format_date_utc(d):
    if not d:
        return None
    tmp = parse(d)
    utc_tz = tmp.astimezone(pytz.UTC)
    return utc_tz.strftime("%Y-%m-%dT%H:%M:%S")


# expects datetime string - query for mongo counts
def format_date_utc_as_date(d):
    if not d:
        return None
    tmp = parse(d)
    utc_tz = tmp.astimezone(pytz.UTC)
    return utc_tz


# expects datetime string
def format_date_denver(d):
    if not d:
        return None
    tmp = parse(d)
    denver_tz = tmp.astimezone(pytz.timezone(os.getenv("TIMEZONE", "America/Denver")))
    return denver_tz.strftime("%m/%d/%Y %I:%M:%S %p")


# expects datetime object
def format_date_denver_datetime(d):
    if not d:
        return None
    denver_tz = d.astimezone(pytz.timezone(os.getenv("TIMEZONE", "America/Denver")))
    return denver_tz.strftime("%m/%d/%Y %I:%M:%S %p")


# expects datetime string
def format_date_denver_iso(d):
    if not d:
        return None
    tmp = parse(d)
    denver_tz = tmp.astimezone(pytz.timezone(os.getenv("TIMEZONE", "America/Denver")))
    return denver_tz.isoformat()


# expects datetime, utilizes environment variable to custom timezone
def utc2tz(d):
    if not d:
        return None
    tz_d = d.astimezone(pytz.timezone(os.getenv("TIMEZONE", "America/Denver")))
    return tz_d
