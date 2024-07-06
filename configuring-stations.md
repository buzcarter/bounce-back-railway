# How To Configure Stations

## Action Macros

## When - Then

```json
{
  "events": [
    {
      "on": "sensor:triggered:on",
      "and": {
        "sensor": 1,
        "direction": "left"
      },
      "send": {
        "event": "train:speed:stop:start",
        "sensor": 1,
        "duration": 1500
      }
    },
    {
      "on": "train:speed:stop:done",
      "and": {
        "sensor": 1
      },
      "send": {
        "event": "clock:wait:start",
        "sensor": 1,
        "duration": 2000
      }
    },
    {
      "on": "clock:wait:done",
      "and": {
        "sensor": 1
      },
      "send": {
        "event": "train:speed:go:start",
        "sensor": 1,
        "duration": 1500
      }
    }
  ]
}
```


### Chained Actions

```json
{
  "events": [
    {
      "on": "sensor:triggered:start",
      "and": {
        "sensor": 1,
        "direction": "left"
      },
      "then": {
        "action": "train:speed:stop:start",
        "duration": 1500,
        "then": {
          "action": "clock:wait:start",
          "duration": 2000,
          "then": {
            "event": "train:speed:go:start",
            "duration": 1500
          }
        }
      }
    }
  ]
}
```
