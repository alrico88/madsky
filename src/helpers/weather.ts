const conditions = [
  {
    code: 1,
    icon: {
      day: "wi:day-cloudy",
      night: "wi:night-alt-cloudy",
    },
  },
  {
    code: 2,
    icon: {
      day: "wi:day-cloudy",
      night: "wi:night-alt-cloudy",
    },
  },
  {
    code: 3,
    icon: {
      day: "wi:day-cloudy",
      night: "wi:night-alt-cloudy",
    },
  },
  {
    code: 45,
    icon: {
      day: "wi:day-fog",
      night: "wi:night-fog",
    },
  },
  {
    code: 48,
    icon: {
      day: "wi:day-fog",
      night: "wi:night-fog",
    },
  },
  {
    code: 51,
    icon: {
      day: "wi:day-sprinkle",
      night: "wi:night-alt-sprinkle",
    },
  },
  {
    code: 53,
    icon: {
      day: "wi:day-sprinkle",
      night: "wi:night-alt-sprinkle",
    },
  },
  {
    code: 55,
    icon: {
      day: "wi:day-sprinkle",
      night: "wi:night-alt-sprinkle",
    },
  },
  {
    code: 56,
    icon: {
      day: "wi:day-sleet",
      night: "wi:night-alt-sleet",
    },
  },
  {
    code: 57,
    icon: {
      day: "wi:day-sleet",
      night: "wi:night-alt-sleet",
    },
  },
  {
    code: 61,
    icon: {
      day: "wi:day-showers",
      night: "wi:night-alt-showers",
    },
  },
  {
    code: 63,
    icon: {
      day: "wi:day-showers",
      night: "wi:night-alt-showers",
    },
  },
  {
    code: 65,
    icon: {
      day: "wi:day-showers",
      night: "wi:night-alt-showers",
    },
  },
  {
    code: 66,
    icon: {
      day: "wi:day-sleet",
      night: "wi:night-alt-sleet",
    },
  },
  {
    code: 67,
    icon: {
      day: "wi:day-sleet",
      night: "wi:night-alt-sleet",
    },
  },
  {
    code: 71,
    icon: {
      day: "wi:day-snow",
      night: "wi:night-alt-snow",
    },
  },
  {
    code: 73,
    icon: {
      day: "wi:day-snow",
      night: "wi:night-alt-snow",
    },
  },
  {
    code: 75,
    icon: {
      day: "wi:day-snow",
      night: "wi:night-alt-snow",
    },
  },
  {
    code: 77,
    icon: {
      day: "wi:day-snow",
      night: "wi:night-alt-snow",
    },
  },
  {
    code: 80,
    icon: {
      day: "wi:day-snow",
      night: "wi:night-alt-snow",
    },
  },
  {
    code: 81,
    icon: {
      day: "wi:day-snow",
      night: "wi:night-alt-snow",
    },
  },
  {
    code: 82,
    icon: {
      day: "wi:day-snow",
      night: "wi:night-alt-snow",
    },
  },
  {
    code: 85,
    icon: {
      day: "wi:day-snow",
      night: "wi:night-alt-snow",
    },
  },
  {
    code: 86,
    icon: {
      day: "wi:day-snow",
      night: "wi:night-alt-snow",
    },
  },
  {
    code: 95,
    icon: {
      day: "wi:day-thunderstorm",
      night: "wi:night-alt-thunderstorm",
    },
  },
  {
    code: 96,
    icon: {
      day: "wi:day-thunderstorm",
      night: "wi:night-alt-thunderstorm",
    },
  },
  {
    code: 99,
    icon: {
      day: "wi:day-thunderstorm",
      night: "wi:night-alt-thunderstorm",
    },
  },
];

export function mapIcon(
  weatherStatusCode: number,
  timeOfDay: "day" | "night"
): string {
  const mapping = conditions.find(
    (condition) => condition.code === weatherStatusCode
  );

  if (mapping) {
    if (timeOfDay === "day") {
      return mapping.icon.day;
    }

    if (timeOfDay === "night") {
      return mapping.icon.night;
    }
  }

  return "wi:day-sunny";
}
