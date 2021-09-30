export default {
  date(a) {
    return Intl.DateTimeFormat('ru-Ru', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(a));
  },
  index(a) {
    return Intl.NumberFormat('ru-Ru', {
      minimumIntegerDigits: 2,
    }).format(a + 1);
  },
};
