const rawGames = [
  // 6U American
  ["6U Division / American", "2026-04-18", "10:00 AM - 11:00 AM", "Oxon Hill Roadrunners", 9, "Clinton Jets #1", 0, "Oak Creek West (Field 5)"],
  ["6U Division / American", "2026-04-18", "10:00 AM - 11:00 AM", "OPDEA Eagles", 3, "Marlboro Mustangs #1", 0, "Oak Creek West (Field 4)"],
  ["6U Division / American", "2026-04-18", "11:00 AM - 12:00 PM", "Marlboro Mustangs #3", 0, "South Bowie Sharks #2", 11, "Oak Creek West (Field 5)"],
  ["6U Division / American", "2026-04-18", "1:00 PM - 2:00 PM", "KLM Cougars #2", 1, "Ft. Washington Cannons #2", 2, "Oak Creek West (Field 4)"],

  ["6U Division / American", "2026-04-25", "10:00 AM - 11:00 AM", "Clinton Jets #1", null, "South Bowie Sharks #2", null, "Oak Creek West (Field 5)"],
  ["6U Division / American", "2026-04-25", "11:00 AM - 12:00 PM", "Oxon Hill Roadrunners", null, "KLM Cougars #2", null, "Oak Creek West (Field 5)"],
  ["6U Division / American", "2026-04-25", "12:00 PM - 1:00 PM", "Marlboro Mustangs #1", null, "Flight School DMV (Black)", null, "Oak Creek West (Field 4)"],
  ["6U Division / American", "2026-04-25", "1:00 PM - 2:00 PM", "Ft. Washington Cannons #2", null, "OPDEA Eagles", null, "Oak Creek West (Field 4)"],
  ["6U Division / American", "2026-04-26", "12:00 PM - 1:00 PM", "Flight School DMV (Black)", null, "Ft. Washington Cannons #2", null, "Oak Creek West (Field 4)"],
  ["6U Division / American", "2026-04-26", "12:00 PM - 1:00 PM", "South Bowie Sharks #2", null, "Oxon Hill Roadrunners", null, "Oak Creek West (Field 5)"],
  ["6U Division / American", "2026-04-26", "1:00 PM - 2:00 PM", "Marlboro Mustangs #3", null, "Marlboro Mustangs #1", null, "Oak Creek West (Field 4)"],
  ["6U Division / American", "2026-04-26", "2:00 PM - 3:00 PM", "OPDEA Eagles", null, "KLM Cougars #2", null, "Oak Creek West (Field 5)"],

  ["6U Division / American", "2026-05-02", "10:00 AM - 11:00 AM", "South Bowie Sharks #2", null, "KLM Cougars #2", null, "Oak Creek West (Field 5)"],
  ["6U Division / American", "2026-05-02", "10:00 AM - 11:00 AM", "Ft. Washington Cannons #2", null, "Marlboro Mustangs #3", null, "Oak Creek West (Field 4)"],
  ["6U Division / American", "2026-05-02", "11:00 AM - 12:00 PM", "Clinton Jets #1", null, "Marlboro Mustangs #1", null, "Oak Creek West (Field 5)"],
  ["6U Division / American", "2026-05-02", "12:00 PM - 1:00 PM", "OPDEA Eagles", null, "Flight School DMV (Black)", null, "Oak Creek West (Field 4)"],
  ["6U Division / American", "2026-05-03", "12:00 PM - 1:00 PM", "Marlboro Mustangs #3", null, "OPDEA Eagles", null, "Oak Creek West (Field 4)"],
  ["6U Division / American", "2026-05-03", "12:00 PM - 1:00 PM", "Marlboro Mustangs #1", null, "Oxon Hill Roadrunners", null, "Oak Creek West (Field 5)"],
  ["6U Division / American", "2026-05-03", "1:00 PM - 2:00 PM", "KLM Cougars #2", null, "Flight School DMV (Black)", null, "Oak Creek West (Field 4)"],
  ["6U Division / American", "2026-05-03", "1:00 PM - 2:00 PM", "Clinton Jets #1", null, "Ft. Washington Cannons #2", null, "Oak Creek West (Field 5)"],

  ["6U Division / American", "2026-05-09", "10:00 AM - 11:00 AM", "South Bowie Sharks #2", null, "Marlboro Mustangs #1", null, "Oak Creek West (Field 5)"],
  ["6U Division / American", "2026-05-09", "11:00 AM - 12:00 PM", "Oxon Hill Roadrunners", null, "Ft. Washington Cannons #2", null, "Oak Creek West (Field 4)"],
  ["6U Division / American", "2026-05-09", "1:00 PM - 2:00 PM", "Flight School DMV (Black)", null, "Marlboro Mustangs #3", null, "Oak Creek West (Field 4)"],
  ["6U Division / American", "2026-05-09", "1:00 PM - 2:00 PM", "OPDEA Eagles", null, "Clinton Jets #1", null, "Oak Creek West (Field 5)"],
  ["6U Division / American", "2026-05-16", "10:00 AM - 11:00 AM", "Clinton Jets #1", null, "Flight School DMV (Black)", null, "Oak Creek West (Field 4)"],
  ["6U Division / American", "2026-05-16", "10:00 AM - 11:00 AM", "KLM Cougars #2", null, "Marlboro Mustangs #3", null, "Oak Creek West (Field 5)"],
  ["6U Division / American", "2026-05-16", "11:00 AM - 12:00 PM", "Ft. Washington Cannons #2", null, "South Bowie Sharks #2", null, "Oak Creek West (Field 5)"],
  ["6U Division / American", "2026-05-16", "1:00 PM - 2:00 PM", "Oxon Hill Roadrunners", null, "OPDEA Eagles", null, "Oak Creek West (Field 4)"],
  ["6U Division / American", "2026-05-17", "12:00 PM - 1:00 PM", "Flight School DMV (Black)", null, "Oxon Hill Roadrunners", null, "Oak Creek West (Field 4)"],
  ["6U Division / American", "2026-05-17", "1:00 PM - 2:00 PM", "Marlboro Mustangs #1", null, "KLM Cougars #2", null, "Oak Creek West (Field 4)"],
  ["6U Division / American", "2026-05-17", "1:00 PM - 2:00 PM", "South Bowie Sharks #2", null, "OPDEA Eagles", null, "Oak Creek West (Field 5)"],
  ["6U Division / American", "2026-05-17", "3:00 PM - 4:00 PM", "Marlboro Mustangs #3", null, "Clinton Jets #1", null, "Oak Creek West (Field 5)"],
  ["6U Division / American", "2026-05-30", "10:00 AM - 11:00 AM", "Oxon Hill Roadrunners", null, "Marlboro Mustangs #3", null, "Oak Creek West (Field 4)"],
  ["6U Division / American", "2026-05-30", "10:00 AM - 11:00 AM", "KLM Cougars #2", null, "Clinton Jets #1", null, "Oak Creek West (Field 5)"],
  ["6U Division / American", "2026-05-30", "11:00 AM - 12:00 PM", "Ft. Washington Cannons #2", null, "Marlboro Mustangs #1", null, "Oak Creek West (Field 4)"],
  ["6U Division / American", "2026-05-30", "11:00 AM - 12:00 PM", "Flight School DMV (Black)", null, "South Bowie Sharks #2", null, "Oak Creek West (Field 5)"],

  // 6U National
  ["6U Division / National", "2026-04-18", "11:00 AM - 12:00 PM", "KLM Cougars #3", 0, "Clinton Jets #2", 2, "Oak Creek West (Field 4)"],
  ["6U Division / National", "2026-04-18", "12:00 PM - 1:00 PM", "KLM Cougars #1", 4, "Ft. Washington Cannons #1", 0, "Oak Creek West (Field 4)"],
  ["6U Division / National", "2026-04-18", "12:00 PM - 1:00 PM", "South Bowie Sharks #3", 1, "Mentoring Through Athletics", 0, "Oak Creek West (Field 5)"],
  ["6U Division / National", "2026-04-18", "1:00 PM - 2:00 PM", "South Bowie Sharks #1", 10, "Marlboro Mustangs #2", 0, "Oak Creek West (Field 5)"],

  ["6U Division / National", "2026-04-25", "10:00 AM - 11:00 AM", "Marlboro Mustangs #2", null, "Flight School DMV (Gold)", null, "Oak Creek West (Field 4)"],
  ["6U Division / National", "2026-04-25", "11:00 AM - 12:00 PM", "KLM Cougars #3", null, "KLM Cougars #1", null, "Oak Creek West (Field 4)"],
  ["6U Division / National", "2026-04-25", "12:00 PM - 1:00 PM", "Clinton Jets #2", null, "South Bowie Sharks #3", null, "Oak Creek West (Field 5)"],
  ["6U Division / National", "2026-04-25", "1:00 PM - 2:00 PM", "Ft. Washington Cannons #1", null, "South Bowie Sharks #1", null, "Oak Creek West (Field 5)"],
  ["6U Division / National", "2026-04-26", "1:00 PM - 2:00 PM", "Flight School DMV (Gold)", null, "Ft. Washington Cannons #1", null, "Oak Creek West (Field 5)"],
  ["6U Division / National", "2026-04-26", "2:00 PM - 3:00 PM", "South Bowie Sharks #3", null, "KLM Cougars #3", null, "Oak Creek West (Field 4)"],
  ["6U Division / National", "2026-04-26", "3:00 PM - 4:00 PM", "Mentoring Through Athletics", null, "Marlboro Mustangs #2", null, "Oak Creek West (Field 4)"],
  ["6U Division / National", "2026-04-26", "3:00 PM - 4:00 PM", "KLM Cougars #1", null, "South Bowie Sharks #1", null, "Oak Creek West (Field 5)"],

  ["6U Division / National", "2026-05-02", "11:00 AM - 12:00 PM", "Ft. Washington Cannons #1", null, "Mentoring Through Athletics", null, "Oak Creek West (Field 4)"],
  ["6U Division / National", "2026-05-02", "12:00 PM - 1:00 PM", "South Bowie Sharks #3", null, "KLM Cougars #1", null, "Oak Creek West (Field 5)"],
  ["6U Division / National", "2026-05-02", "1:00 PM - 2:00 PM", "South Bowie Sharks #1", null, "Flight School DMV (Gold)", null, "Oak Creek West (Field 4)"],
  ["6U Division / National", "2026-05-02", "1:00 PM - 2:00 PM", "Clinton Jets #2", null, "Marlboro Mustangs #2", null, "Oak Creek West (Field 5)"],
  ["6U Division / National", "2026-05-03", "2:00 PM - 3:00 PM", "Clinton Jets #2", null, "Ft. Washington Cannons #1", null, "Oak Creek West (Field 4)"],
  ["6U Division / National", "2026-05-03", "2:00 PM - 3:00 PM", "Mentoring Through Athletics", null, "South Bowie Sharks #1", null, "Oak Creek West (Field 5)"],
  ["6U Division / National", "2026-05-03", "3:00 PM - 4:00 PM", "KLM Cougars #1", null, "Flight School DMV (Gold)", null, "Oak Creek West (Field 4)"],
  ["6U Division / National", "2026-05-03", "3:00 PM - 4:00 PM", "Marlboro Mustangs #2", null, "KLM Cougars #3", null, "Oak Creek West (Field 5)"],
  ["6U Division / National", "2026-05-09", "10:00 AM - 11:00 AM", "KLM Cougars #3", null, "Ft. Washington Cannons #1", null, "Oak Creek West (Field 4)"],
  ["6U Division / National", "2026-05-09", "11:00 AM - 12:00 PM", "Flight School DMV (Gold)", null, "Mentoring Through Athletics", null, "Oak Creek West (Field 5)"],
  ["6U Division / National", "2026-05-09", "12:00 PM - 1:00 PM", "South Bowie Sharks #1", null, "Clinton Jets #2", null, "Oak Creek West (Field 4)"],
  ["6U Division / National", "2026-05-09", "12:00 PM - 1:00 PM", "Marlboro Mustangs #2", null, "South Bowie Sharks #3", null, "Oak Creek West (Field 5)"],
  ["6U Division / National", "2026-05-16", "11:00 AM - 12:00 PM", "Mentoring Through Athletics", null, "KLM Cougars #1", null, "Oak Creek West (Field 4)"],
  ["6U Division / National", "2026-05-16", "12:00 PM - 1:00 PM", "Ft. Washington Cannons #1", null, "South Bowie Sharks #3", null, "Oak Creek West (Field 5)"],
  ["6U Division / National", "2026-05-16", "12:00 PM - 1:00 PM", "South Bowie Sharks #1", null, "KLM Cougars #3", null, "Oak Creek West (Field 4)"],
  ["6U Division / National", "2026-05-16", "1:00 PM - 2:00 PM", "Clinton Jets #2", null, "Flight School DMV (Gold)", null, "Oak Creek West (Field 5)"],
  ["6U Division / National", "2026-05-17", "12:00 PM - 1:00 PM", "Marlboro Mustangs #2", null, "KLM Cougars #1", null, "Oak Creek West (Field 5)"],
  ["6U Division / National", "2026-05-17", "2:00 PM - 3:00 PM", "South Bowie Sharks #3", null, "South Bowie Sharks #1", null, "Oak Creek West (Field 4)"],
  ["6U Division / National", "2026-05-17", "2:00 PM - 3:00 PM", "Mentoring Through Athletics", null, "Clinton Jets #2", null, "Oak Creek West (Field 5)"],
  ["6U Division / National", "2026-05-17", "3:00 PM - 4:00 PM", "Flight School DMV (Gold)", null, "KLM Cougars #3", null, "Oak Creek West (Field 4)"],
  ["6U Division / National", "2026-05-30", "12:00 PM - 1:00 PM", "Flight School DMV (Gold)", null, "South Bowie Sharks #3", null, "Oak Creek West (Field 4)"],
  ["6U Division / National", "2026-05-30", "12:00 PM - 1:00 PM", "Ft. Washington Cannons #1", null, "Marlboro Mustangs #2", null, "Oak Creek West (Field 5)"],
  ["6U Division / National", "2026-05-30", "1:00 PM - 2:00 PM", "KLM Cougars #3", null, "Mentoring Through Athletics", null, "Oak Creek West (Field 4)"],
  ["6U Division / National", "2026-05-30", "1:00 PM - 2:00 PM", "KLM Cougars #1", null, "Clinton Jets #2", null, "Oak Creek West (Field 5)"],

  // 8U American
  ["8U Division / American", "2026-04-18", "10:00 AM - 11:00 AM", "Marlboro Mustangs #2", 1, "OPDEA Eagles", 15, "King's Grant (Field 2)"],
  ["8U Division / American", "2026-04-18", "11:00 AM - 12:00 PM", "Flight School DMV (Gold)", 0, "Mentoring Through Athletics", 6, "King's Grant (Field 2)"],
  ["8U Division / American", "2026-04-18", "12:00 PM - 1:00 PM", "KLM Cougars #1", 3, "Clinton Jets", 1, "King's Grant (Field 2)"],

  ["8U Division / American", "2026-04-25", "10:00 AM - 11:00 AM", "OPDEA Eagles", null, "KLM Cougars #1", null, "King's Grant (Field 2)"],
  ["8U Division / American", "2026-04-25", "11:00 AM - 12:00 PM", "Clinton Jets", null, "Flight School DMV (Gold)", null, "King's Grant (Field 2)"],
  ["8U Division / American", "2026-04-25", "12:00 PM - 1:00 PM", "Marlboro Mustangs #2", null, "Mentoring Through Athletics", null, "King's Grant (Field 2)"],
  ["8U Division / American", "2026-04-26", "12:00 PM - 1:00 PM", "Mentoring Through Athletics", null, "OPDEA Eagles", null, "King's Grant (Field 2)"],
  ["8U Division / American", "2026-04-26", "1:00 PM - 2:00 PM", "KLM Cougars #1", null, "Flight School DMV (Gold)", null, "King's Grant (Field 2)"],
  ["8U Division / American", "2026-04-26", "2:00 PM - 3:00 PM", "Marlboro Mustangs #2", null, "Clinton Jets", null, "King's Grant (Field 2)"],
  ["8U Division / American", "2026-05-02", "10:00 AM - 11:00 AM", "OPDEA Eagles", null, "Clinton Jets", null, "King's Grant (Field 2)"],
  ["8U Division / American", "2026-05-02", "11:00 AM - 12:00 PM", "Mentoring Through Athletics", null, "KLM Cougars #1", null, "King's Grant (Field 2)"],
  ["8U Division / American", "2026-05-02", "12:00 PM - 1:00 PM", "Flight School DMV (Gold)", null, "Marlboro Mustangs #2", null, "King's Grant (Field 2)"],
  ["8U Division / American", "2026-05-03", "12:00 PM - 1:00 PM", "OPDEA Eagles", null, "Flight School DMV (Gold)", null, "King's Grant (Field 2)"],
  ["8U Division / American", "2026-05-03", "1:00 PM - 2:00 PM", "KLM Cougars #1", null, "Marlboro Mustangs #2", null, "King's Grant (Field 2)"],
  ["8U Division / American", "2026-05-03", "2:00 PM - 3:00 PM", "Clinton Jets", null, "Mentoring Through Athletics", null, "King's Grant (Field 2)"],
  ["8U Division / American", "2026-05-09", "10:00 AM - 11:00 AM", "Marlboro Mustangs #2", null, "OPDEA Eagles", null, "King's Grant (Field 2)"],
  ["8U Division / American", "2026-05-09", "11:00 AM - 12:00 PM", "Mentoring Through Athletics", null, "Flight School DMV (Gold)", null, "King's Grant (Field 2)"],
  ["8U Division / American", "2026-05-09", "12:00 PM - 1:00 PM", "Clinton Jets", null, "KLM Cougars #1", null, "King's Grant (Field 2)"],
  ["8U Division / American", "2026-05-16", "10:00 AM - 11:00 AM", "KLM Cougars #1", null, "OPDEA Eagles", null, "King's Grant (Field 2)"],
  ["8U Division / American", "2026-05-16", "11:00 AM - 12:00 PM", "Flight School DMV (Gold)", null, "Clinton Jets", null, "King's Grant (Field 2)"],
  ["8U Division / American", "2026-05-16", "12:00 PM - 1:00 PM", "Mentoring Through Athletics", null, "Marlboro Mustangs #2", null, "King's Grant (Field 2)"],
  ["8U Division / American", "2026-05-30", "10:00 AM - 11:00 AM", "OPDEA Eagles", null, "Mentoring Through Athletics", null, "King's Grant (Field 2)"],
  ["8U Division / American", "2026-05-30", "11:00 AM - 12:00 PM", "Flight School DMV (Gold)", null, "KLM Cougars #1", null, "King's Grant (Field 2)"],
  ["8U Division / American", "2026-05-30", "12:00 PM - 1:00 PM", "Clinton Jets", null, "Marlboro Mustangs #2", null, "King's Grant (Field 2)"],

  // 8U National
  ["8U Division / National", "2026-04-18", "1:00 PM - 2:00 PM", "KLM Cougars #2", 3, "Marlboro Mustangs #1", 1, "King's Grant (Field 2)"],
  ["8U Division / National", "2026-04-18", "2:00 PM - 3:00 PM", "Marlboro Mustangs #3", 2, "Oxon Hill Roadrunners", 0, "King's Grant (Field 2)"],
  ["8U Division / National", "2026-04-18", "3:00 PM - 4:00 PM", "Ft. Washington Cannons", null, "Flight School DMV (Black)", null, "King's Grant (Field 2)"],

  ["8U Division / National", "2026-04-25", "1:00 PM - 2:00 PM", "Marlboro Mustangs #1", null, "Ft. Washington Cannons", null, "King's Grant (Field 2)"],
  ["8U Division / National", "2026-04-25", "2:00 PM - 3:00 PM", "Marlboro Mustangs #3", null, "Flight School DMV (Black)", null, "King's Grant (Field 2)"],
  ["8U Division / National", "2026-04-25", "3:00 PM - 4:00 PM", "Oxon Hill Roadrunners", null, "KLM Cougars #2", null, "King's Grant (Field 2)"],
  ["8U Division / National", "2026-04-26", "3:00 PM - 4:00 PM", "Flight School DMV (Black)", null, "Oxon Hill Roadrunners", null, "King's Grant (Field 2)"],
  ["8U Division / National", "2026-04-26", "4:00 PM - 5:00 PM", "Marlboro Mustangs #3", null, "Marlboro Mustangs #1", null, "King's Grant (Field 2)"],
  ["8U Division / National", "2026-04-26", "5:00 PM - 6:00 PM", "KLM Cougars #2", null, "Ft. Washington Cannons", null, "King's Grant (Field 2)"],
  ["8U Division / National", "2026-05-02", "1:00 PM - 2:00 PM", "Flight School DMV (Black)", null, "KLM Cougars #2", null, "King's Grant (Field 2)"],
  ["8U Division / National", "2026-05-02", "2:00 PM - 3:00 PM", "Ft. Washington Cannons", null, "Marlboro Mustangs #3", null, "King's Grant (Field 2)"],
  ["8U Division / National", "2026-05-02", "3:00 PM - 4:00 PM", "Oxon Hill Roadrunners", null, "Marlboro Mustangs #1", null, "King's Grant (Field 2)"],
  ["8U Division / National", "2026-05-03", "3:00 PM - 4:00 PM", "Marlboro Mustangs #1", null, "Flight School DMV (Black)", null, "King's Grant (Field 2)"],
  ["8U Division / National", "2026-05-03", "4:00 PM - 5:00 PM", "KLM Cougars #2", null, "Marlboro Mustangs #3", null, "King's Grant (Field 2)"],
  ["8U Division / National", "2026-05-03", "5:00 PM - 6:00 PM", "Oxon Hill Roadrunners", null, "Ft. Washington Cannons", null, "King's Grant (Field 2)"],
  ["8U Division / National", "2026-05-09", "1:00 PM - 2:00 PM", "Marlboro Mustangs #1", null, "KLM Cougars #2", null, "King's Grant (Field 2)"],
  ["8U Division / National", "2026-05-09", "2:00 PM - 3:00 PM", "Marlboro Mustangs #3", null, "Oxon Hill Roadrunners", null, "King's Grant (Field 2)"],
  ["8U Division / National", "2026-05-09", "3:00 PM - 4:00 PM", "Flight School DMV (Black)", null, "Ft. Washington Cannons", null, "King's Grant (Field 2)"],
  ["8U Division / National", "2026-05-16", "1:00 PM - 2:00 PM", "Flight School DMV (Black)", null, "Marlboro Mustangs #3", null, "King's Grant (Field 2)"],
  ["8U Division / National", "2026-05-16", "2:00 PM - 3:00 PM", "Ft. Washington Cannons", null, "Marlboro Mustangs #1", null, "King's Grant (Field 2)"],
  ["8U Division / National", "2026-05-16", "3:00 PM - 4:00 PM", "KLM Cougars #2", null, "Oxon Hill Roadrunners", null, "King's Grant (Field 2)"],
  ["8U Division / National", "2026-05-30", "1:00 PM - 2:00 PM", "Oxon Hill Roadrunners", null, "Flight School DMV (Black)", null, "King's Grant (Field 2)"],
  ["8U Division / National", "2026-05-30", "2:00 PM - 3:00 PM", "Marlboro Mustangs #1", null, "Marlboro Mustangs #3", null, "King's Grant (Field 2)"],
  ["8U Division / National", "2026-05-30", "3:00 PM - 4:00 PM", "Ft. Washington Cannons", null, "KLM Cougars #2", null, "King's Grant (Field 2)"],

  // 10U
  ["10U Division / Division", "2026-04-18", "10:00 AM - 11:00 AM", "Mentoring Through Athletics (Red)", 1, "Flight School DMV", 2, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-04-18", "11:00 AM - 12:00 PM", "Ft. Washington Cannons", 1, "OPDEA Eagles", 8, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-04-18", "12:00 PM - 1:00 PM", "Mentoring Through Athletics (Black)", null, "Marlboro Mustangs #1", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-04-18", "1:00 PM - 2:00 PM", "Marlboro Mustangs #2", 1, "Baller University", 8, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-04-18", "2:00 PM - 3:00 PM", "KLM Cougars", 0, "Oxon Hill Roadrunners", 1, "Potomac Landing Community Center"],

  ["10U Division / Division", "2026-04-25", "10:00 AM - 11:00 AM", "Flight School DMV", null, "Marlboro Mustangs #1", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-04-25", "11:00 AM - 12:00 PM", "Mentoring Through Athletics (Black)", null, "Marlboro Mustangs #2", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-04-25", "12:00 PM - 1:00 PM", "Oxon Hill Roadrunners", null, "Ft. Washington Cannons", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-04-25", "1:00 PM - 2:00 PM", "OPDEA Eagles", null, "Mentoring Through Athletics (Red)", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-04-25", "2:00 PM - 3:00 PM", "Baller University", null, "KLM Cougars", null, "Potomac Landing Community Center"],

  ["10U Division / Division", "2026-04-26", "12:00 PM - 1:00 PM", "Oxon Hill Roadrunners", null, "Baller University", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-04-26", "1:00 PM - 2:00 PM", "Ft. Washington Cannons", null, "Marlboro Mustangs #2", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-04-26", "2:00 PM - 3:00 PM", "OPDEA Eagles", null, "Mentoring Through Athletics (Black)", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-04-26", "3:00 PM - 4:00 PM", "Mentoring Through Athletics (Red)", null, "Marlboro Mustangs #1", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-04-26", "4:00 PM - 5:00 PM", "Flight School DMV", null, "KLM Cougars", null, "Potomac Landing Community Center"],

  ["10U Division / Division", "2026-05-02", "10:00 AM - 11:00 AM", "Marlboro Mustangs #1", null, "Oxon Hill Roadrunners", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-05-02", "11:00 AM - 12:00 PM", "Marlboro Mustangs #2", null, "OPDEA Eagles", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-05-02", "12:00 PM - 1:00 PM", "Mentoring Through Athletics (Red)", null, "Ft. Washington Cannons", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-05-02", "1:00 PM - 2:00 PM", "KLM Cougars", null, "Mentoring Through Athletics (Black)", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-05-02", "2:00 PM - 3:00 PM", "Baller University", null, "Flight School DMV", null, "Potomac Landing Community Center"],

  ["10U Division / Division", "2026-05-03", "12:00 PM - 1:00 PM", "Ft. Washington Cannons", null, "KLM Cougars", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-05-03", "1:00 PM - 2:00 PM", "Mentoring Through Athletics (Red)", null, "Oxon Hill Roadrunners", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-05-03", "2:00 PM - 3:00 PM", "Baller University", null, "Mentoring Through Athletics (Black)", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-05-03", "3:00 PM - 4:00 PM", "Marlboro Mustangs #1", null, "OPDEA Eagles", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-05-03", "4:00 PM - 5:00 PM", "Marlboro Mustangs #2", null, "Flight School DMV", null, "Potomac Landing Community Center"],

  ["10U Division / Division", "2026-05-09", "10:00 AM - 11:00 AM", "Flight School DMV", null, "Ft. Washington Cannons", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-05-09", "11:00 AM - 12:00 PM", "Marlboro Mustangs #1", null, "Baller University", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-05-09", "12:00 PM - 1:00 PM", "Mentoring Through Athletics (Black)", null, "Mentoring Through Athletics (Red)", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-05-09", "1:00 PM - 2:00 PM", "Oxon Hill Roadrunners", null, "OPDEA Eagles", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-05-09", "2:00 PM - 3:00 PM", "KLM Cougars", null, "Marlboro Mustangs #2", null, "Potomac Landing Community Center"],

  ["10U Division / Division", "2026-05-16", "10:00 AM - 11:00 AM", "Ft. Washington Cannons", null, "Marlboro Mustangs #1", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-05-16", "11:00 AM - 12:00 PM", "Marlboro Mustangs #2", null, "Oxon Hill Roadrunners", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-05-16", "12:00 PM - 1:00 PM", "KLM Cougars", null, "Mentoring Through Athletics (Red)", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-05-16", "1:00 PM - 2:00 PM", "Flight School DMV", null, "Mentoring Through Athletics (Black)", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-05-16", "2:00 PM - 3:00 PM", "OPDEA Eagles", null, "Baller University", null, "Potomac Landing Community Center"],

  ["10U Division / Division", "2026-05-30", "10:00 AM - 11:00 AM", "Marlboro Mustangs #1", null, "Marlboro Mustangs #2", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-05-30", "11:00 AM - 12:00 PM", "OPDEA Eagles", null, "KLM Cougars", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-05-30", "12:00 PM - 1:00 PM", "Baller University", null, "Mentoring Through Athletics (Red)", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-05-30", "1:00 PM - 2:00 PM", "Mentoring Through Athletics (Black)", null, "Ft. Washington Cannons", null, "Potomac Landing Community Center"],
  ["10U Division / Division", "2026-05-30", "2:00 PM - 3:00 PM", "Oxon Hill Roadrunners", null, "Flight School DMV", null, "Potomac Landing Community Center"],

  // 12U
  ["12U Division / Division", "2026-04-18", "10:00 AM - 11:15 AM", "Flight School DMV", 0, "Clinton Jets", 4, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-04-18", "11:15 AM - 12:30 PM", "Marlboro Mustangs", 1, "KLM Cougars", 7, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-04-18", "12:30 PM - 1:45 PM", "Oxon Hill Roadrunners", 4, "Ft. Washington Cannons", 2, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-04-18", "1:45 PM - 3:00 PM", "Mentoring Through Athletics", 2, "OPDEA Eagles", 3, "Fort Foote Recreation Center"],

  ["12U Division / Division", "2026-04-25", "10:00 AM - 11:15 AM", "Clinton Jets", null, "Marlboro Mustangs", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-04-25", "11:15 AM - 12:30 PM", "Mentoring Through Athletics", null, "Ft. Washington Cannons", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-04-25", "12:30 PM - 1:45 PM", "Flight School DMV", null, "Oxon Hill Roadrunners", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-04-25", "1:45 PM - 3:00 PM", "KLM Cougars", null, "OPDEA Eagles", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-04-26", "12:00 PM - 1:15 PM", "Flight School DMV", null, "KLM Cougars", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-04-26", "1:15 PM - 2:30 PM", "Mentoring Through Athletics", null, "Oxon Hill Roadrunners", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-04-26", "2:30 PM - 3:45 PM", "Marlboro Mustangs", null, "Ft. Washington Cannons", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-04-26", "3:45 PM - 5:00 PM", "OPDEA Eagles", null, "Clinton Jets", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-05-02", "10:00 AM - 11:15 AM", "Clinton Jets", null, "Ft. Washington Cannons", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-05-02", "11:15 AM - 12:30 PM", "Mentoring Through Athletics", null, "KLM Cougars", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-05-02", "12:30 PM - 1:45 PM", "OPDEA Eagles", null, "Oxon Hill Roadrunners", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-05-02", "1:45 PM - 3:00 PM", "Flight School DMV", null, "Marlboro Mustangs", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-05-03", "12:00 PM - 1:15 PM", "KLM Cougars", null, "Mentoring Through Athletics", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-05-03", "1:15 PM - 2:30 PM", "Marlboro Mustangs", null, "Flight School DMV", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-05-03", "2:30 PM - 3:45 PM", "Oxon Hill Roadrunners", null, "OPDEA Eagles", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-05-03", "3:45 PM - 5:00 PM", "Ft. Washington Cannons", null, "Clinton Jets", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-05-09", "10:00 AM - 11:15 AM", "Marlboro Mustangs", null, "Mentoring Through Athletics", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-05-09", "11:15 AM - 12:30 PM", "OPDEA Eagles", null, "Flight School DMV", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-05-09", "12:30 PM - 1:45 PM", "KLM Cougars", null, "Ft. Washington Cannons", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-05-09", "1:45 PM - 3:00 PM", "Oxon Hill Roadrunners", null, "Clinton Jets", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-05-16", "10:00 AM - 11:15 AM", "KLM Cougars", null, "Oxon Hill Roadrunners", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-05-16", "11:15 AM - 12:30 PM", "Ft. Washington Cannons", null, "Flight School DMV", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-05-16", "12:30 PM - 1:45 PM", "OPDEA Eagles", null, "Marlboro Mustangs", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-05-16", "1:45 PM - 3:00 PM", "Clinton Jets", null, "Mentoring Through Athletics", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-05-30", "10:00 AM - 11:15 AM", "Ft. Washington Cannons", null, "OPDEA Eagles", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-05-30", "11:15 AM - 12:30 PM", "Flight School DMV", null, "Mentoring Through Athletics", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-05-30", "12:30 PM - 1:45 PM", "Oxon Hill Roadrunners", null, "Marlboro Mustangs", null, "Fort Foote Recreation Center"],
  ["12U Division / Division", "2026-05-30", "1:45 PM - 3:00 PM", "Clinton Jets", null, "KLM Cougars", null, "Fort Foote Recreation Center"],
];

const slug = (text) =>
  text
    .toLowerCase()
    .replace(/#/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const getAgeGroup = (division) => division.split(" ")[0];

const getBracket = (division) => {
  if (division.includes("American")) return "American";
  if (division.includes("National")) return "National";
  return "Main";
};

const makeTeamId = (division, team) =>
  `${slug(getAgeGroup(division))}-${slug(getBracket(division))}-${slug(team)}`;

const soccerGames = rawGames.map(
  ([division, date, time, team1, score1, team2, score2, location], index) => ({
    id: `game-${index + 1}`,

    sport: "Soccer",

    date,
    time,
    title: "Game [Summary]",
    ageGroup: getAgeGroup(division),
    bracket: getBracket(division),
    division,

    team1,
    team1Id: makeTeamId(division, team1),
    score1,

    team2,
    team2Id: makeTeamId(division, team2),
    score2,

    location,
    isPlayed: score1 !== null && score2 !== null,
  })
);
export { soccerGames };