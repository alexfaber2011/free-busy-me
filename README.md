# Calendar Gap Slim (v1)

This is, yet another, attempt at putting together calendar gap.  This time, a focus
will be on using tools that help get the job done quickly so that it can be
a proper proof of concept.

## Notes

### Firebase

#### Development

Project name: `calendar-gap-v1`.
_Note: I have other "calendar-gap" projects registered with google, so don't 
get those confused in the future_

App name: `calendar-gap-slim-v1`

##### Sign In Providers

###### Google

I'm starting with only allowing users to authenticate with Google.  This'll
allow me to easily interact with the calendar that's part of their google account.
They'll be able to import calendars into a calendar that calendar-gap will
consume.

###### Microsoft

This is the next provider, since Outlook Calendar seems to be heavily used.


### Google Calendar

Link: https://console.developers.google.com/apis/

I've got a setup for Development and Production.  Each has a different
accepted Javascript origin.

**Both configurations are limited to 100 sensensitive scope logins until the
[OAuth Conset Screen](https://console.developers.google.com/apis/credentials/consent?project=calendar-gap)
is verified.
