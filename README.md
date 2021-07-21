# Hackaton / UKIT Case / WEB RTC Backend
This is socket-io backend server for real time communications

Front-end lib for this backend - [hackaton-ukit-audio-controller](https://github.com/syleront/hackaton-ukit-audio-controller)

## Routes
* `/` - hello world
* `/users` - get current connected users list
* `/static` - static files served in src/static

## socket-io events

### Template
* event_name
* * `data-item` - data item description
    
### Events

* `user_join` - user joined to the server
* * `id` - user_id that joined to the server

----------------

* `user_leave` - user disconnected from the server
* * `id` - user_id that joined to the server

----------------
    
* `voice` - audio data from user
* * `id` - user id
* * `blob` - binary audio data
* * `sampleRate` - sample rate of blob

----------------

* `user_speak` - user is speaking now
* * `id` - user id

----------------

* `audio_sticker` - audio sticker (e.g. OH MY GOD, or Crickets and etc.)
* * `sticker` - sticker name
