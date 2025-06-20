// Function to get color based on tag content
export const getTagColor = (tag: string, theme: any) => {
  const tagColors: { [key: string]: string } = {
    // Literary Movements/Periods
    Модернизъм: theme.palette.info.main, // Blue
    Експресионизъм: theme.palette.info.light, // Light Blue/Cyan
    Символизъм: theme.palette.info.dark, // Dark Blue
    Реализъм: theme.palette.success.main, // Green
    "Социален реализъм": theme.palette.success.dark, // Dark Green
    Възраждане: theme.palette.warning.light, // Light Orange
    "Септемврийска литература": theme.palette.warning.dark, // Deep Orange

    // Genres/Forms
    "Революционна лирика": theme.palette.error.main, // Red
    "Героическа поезия": theme.palette.error.dark, // Dark Red
    "Философска поезия": theme.palette.primary.main, // Indigo
    "Социална поезия": theme.palette.secondary.main, // Purple
    "Работническа поезия": theme.palette.secondary.dark, // Deep Purple
    Поема: theme.palette.info.main, // Blue
    Повест: theme.palette.info.light, // Light Blue
    Разказ: theme.palette.success.main, // Green
    "Психологически роман": theme.palette.primary.light, // Light Indigo
    "Социален роман": theme.palette.secondary.light, // Light Purple
    "Исторически роман": theme.palette.warning.main, // Orange
    Драматург: theme.palette.error.light, // Light Red
    Пиеса: theme.palette.error.light, // Light Red
    Сатира: theme.palette.warning.main, // Orange (can be similar to "Lost Generation" for a "biting" feel)
    Фейлетон: theme.palette.warning.light, // Light Orange
    Епиграми: theme.palette.warning.dark, // Deep Orange
    "Комедия на нравите": theme.palette.success.light, // Teal
    Есета: theme.palette.grey[600], // Darker Grey
    Мемоари: theme.palette.grey[700], // Even Darker Grey
    Сонет: theme.palette.info.light, // Cyan
    Елегия: theme.palette.primary.light, // Light Indigo

    // Themes/Concepts
    "Социална критика": theme.palette.error.main, // Red
    "Критика на властта": theme.palette.error.dark, // Dark Red
    "Националноосвободителна борба": theme.palette.error.main, // Red
    Въстание: theme.palette.error.main, // Red
    "Граждански конфликт": theme.palette.error.dark, // Dark Red
    "Държавен терор": theme.palette.error.dark, // Dark Red
    Алегория: theme.palette.primary.main, // Indigo
    Нравственост: theme.palette.success.main, // Green
    Нрави: theme.palette.success.light, // Teal
    "Селски живот": theme.palette.success.light, // Teal
    Песимизъм: theme.palette.grey[700], // Dark Grey
    Гротеска: theme.palette.warning.dark, // Deep Orange
    "Морален упадък": theme.palette.error.main, // Red
    Призив: theme.palette.info.main, // Blue
    Несправедливост: theme.palette.error.main, // Red
    Цензура: theme.palette.grey[800], // Very Dark Grey
    Абсурдизъм: theme.palette.primary.dark, // Dark Indigo

    // Author Types/Roles
    Революционер: theme.palette.error.main, // Red
    Поет: theme.palette.info.main, // Blue
    Публицист: theme.palette.warning.main, // Orange
    Сатирик: theme.palette.warning.dark, // Deep Orange
    Пътеписец: theme.palette.success.main, // Green
    Общественик: theme.palette.primary.main, // Indigo
    Класик: theme.palette.grey[500], // Grey
    Патриот: theme.palette.success.main, // Green
    "Народен поет": theme.palette.info.dark, // Dark Blue
    Възрожденец: theme.palette.warning.light, // Light Orange
    Разказвач: theme.palette.success.main, // Green
    Дисидент: theme.palette.error.dark, // Dark Red
    Писател: theme.palette.grey[500], // Grey (general)
    Публицистика: theme.palette.warning.main, // Orange
  };

  // Default color if no specific match
  return tagColors[tag] || theme.palette.grey[500]; // Grey as default
};
