from icalendar import Calendar, Event, vCalAddress, vText
import pytz
from datetime import datetime
import tempfile, os

def calendar_for_fixtures( label, fixtures ):
    cal = Calendar()

    cal.add('prodid', '-//CKA Fixtures Calendar////')
    cal.add('version', '2.0')

    for f in fixtures:
        e = event_for_fixture(f)
        cal.add_component(e)

    f = open( '{}.ics'.format(label), 'wb')
    f.write(cal.to_ical())
    f.close()


def event_for_fixture( fixture ):

    event = Event()
    event.add('summary', 'Phoenix 1 vs Tigers 4')
    event.add('dtstart', datetime(2020,4,4,8,0,0,tzinfo=pytz.utc))
    event.add('dtend', datetime(2020,4,4,10,0,0,tzinfo=pytz.utc))
    event.add('dtstamp', datetime(2020,4,4,0,10,0,tzinfo=pytz.utc))

    organizer = vCalAddress('MAILTO:fixtures@cambskorfball.co.uk')
    organizer.params['cn'] = vText('CKA Fixtures Officer')

    event['organizer'] = organizer
    event['location'] = vText('Cambridge Regional College')
    event.add('priority', 5)

    return event
